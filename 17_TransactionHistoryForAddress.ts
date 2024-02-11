import {
    StakingRequestEvent, SuiTransactionScalarData, SuiTransactionType,
    TransactionType,
    UnstakingRequestEvent
} from './types';
import {
    SuiClient,
    SuiEvent,
    SuiTransaction,
    SuiTransactionBlockResponse
} from '@mysten/sui.js/client';


const client = new SuiClient({
    url: 'https://mysten-rpc.mainnet.sui.io'//getFullnodeUrl('mainnet')
});

const MIST_PER_SUI = 1000000000;

export function addGasCost(block: SuiTransactionBlockResponse) {
    const gas = block.effects?.gasUsed;
    if (!gas) {
        return 0;
    }
    let txCost: number = parseInt(gas.computationCost) + parseInt(gas.storageCost) - parseInt(gas.storageRebate);
    txCost = txCost / MIST_PER_SUI;
    return txCost;
}

export function addTransactionForEpoch(epoch: number,
                                transaction: SuiTransactionType,
                                transactionPerEpoch: Map<number, SuiTransactionType[]>
) {
    let suiTransactionTypes = transactionPerEpoch.get(epoch);
    if (!suiTransactionTypes) {
        suiTransactionTypes = [];
        suiTransactionTypes.push(transaction);
        transactionPerEpoch.set(epoch, suiTransactionTypes);
    } else {
        suiTransactionTypes.push(transaction);
    }
}


export function handleStakeUnstakeEvents(events: SuiEvent[],
                                         suiTransaction: SuiTransactionType,
                                         transactions: SuiTransactionType[]) {
    const event = events[0];

    const eventType = event.type;
    if (eventType.includes('validator::StakingRequestEvent')) {
        suiTransaction.type = TransactionType.staking;
        const stakingRequestEvent = event.parsedJson as StakingRequestEvent;
        suiTransaction.principalAmount = parseInt(stakingRequestEvent.amount) / MIST_PER_SUI; //Amount Staked

        transactions.push(suiTransaction);
    } else if (eventType.includes('validator::UnstakingRequestEvent')) {

        suiTransaction.type = TransactionType.unstaking;
        const unstakingEvent: UnstakingRequestEvent = event.parsedJson as UnstakingRequestEvent;
        suiTransaction.principalAmount = unstakingEvent.principal_amount / MIST_PER_SUI;
        suiTransaction.rewardsAmount = unstakingEvent.reward_amount / MIST_PER_SUI;

        transactions.push(suiTransaction);
    }
}

export function handleSendSuiTx(block : SuiTransactionBlockResponse, address: string, suiTransaction: SuiTransactionType, transactions: SuiTransactionType[]) {
    const tx = block.transaction?.data.transaction;


    if (tx && tx.kind === 'ProgrammableTransaction') {

        let suiBalanceChangesForAddress = block.balanceChanges.filter(balanceChange => {
            return (Object.keys(balanceChange.owner)[0] == 'AddressOwner' && Object.values(balanceChange.owner)[0] === address && balanceChange.coinType.includes('sui::SUI') )
        });

        suiBalanceChangesForAddress.forEach(balanceChange => {
            suiTransaction.type = TransactionType.send;

            suiTransaction.principalAmount = parseInt(balanceChange.amount) / MIST_PER_SUI;
            transactions.push(suiTransaction);
        });
    }
}

export function handleReceiveSui(block : SuiTransactionBlockResponse, address: string, suiTransaction: SuiTransactionType, transactions: SuiTransactionType[]) {
    const tx = block.transaction?.data.transaction;

    if (tx && tx.kind === 'ProgrammableTransaction') {

        let suiBalanceChangesForAddress = block.balanceChanges.filter(balanceChange => {
            return (Object.keys(balanceChange.owner)[0] == 'AddressOwner' && Object.values(balanceChange.owner)[0] === address && balanceChange.coinType.includes('sui::SUI') )
        });

        suiBalanceChangesForAddress.forEach(balanceChange => {
            suiTransaction.type = TransactionType.receive;

            suiTransaction.principalAmount = parseInt(balanceChange.amount) / MIST_PER_SUI;
            transactions.push(suiTransaction);
        });
    }
}

export async function getTxDigests(address: string) {
    const results = await client.queryTransactionBlocks({
        limit: 1000,
        cursor: null,
        filter: {
            FromAddress: address
        }
    });

    const resultsReceiveSui = await client.queryTransactionBlocks({
        limit: 1000,
        cursor: null,
        filter: {
            ToAddress: address
        }
    });

    const digestSet = new Set<string>(results.data.map(tx => tx.digest));

    resultsReceiveSui.data.map(tx => tx.digest).forEach(digest => {
        digestSet.add(digest);
    });

    const txDigests = Array.from(digestSet);
    return txDigests;
}

export async function getData(address: string): Promise<SuiTransactionType[]> {

    const transactions: SuiTransactionType[] = [];

    console.log('Querying Transactions for Address ', address);

    const txDigests = await getTxDigests(address);

    if (txDigests.length === 0) {
        return transactions;
    }

    const blocks: SuiTransactionBlockResponse[] = await client.multiGetTransactionBlocks({
        digests: txDigests,
        options: {
            showInput: true,
            showEffects: true,
            showEvents: true,
            showObjectChanges: true,
            showBalanceChanges: true
        }
    });

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        const sender = block.transaction?.data.sender;

        const suiTransaction: SuiTransactionType = {
            digest: block.digest,
            timestampMs: parseInt(block.timestampMs!),
            explorer: `https://suivision.xyz/txblock/${block.digest}`
        };

        var date = new Date(suiTransaction.timestampMs);
        suiTransaction.timestampDate = date.toISOString();
        suiTransaction.gas = addGasCost(block);
        suiTransaction.epoch = parseInt(block.effects.executedEpoch);

        if (sender && sender === address) {

            let eventsLength = block.events?.length || 0;
            if (block.effects?.status.status === 'success') {

                if (eventsLength > 0) {
                    const events: SuiEvent[] = (block.events || []) as SuiEvent[];
                    handleStakeUnstakeEvents(events, suiTransaction, transactions);
                }
                else {
                    //tx is send sui to other account
                    handleSendSuiTx(block, address, suiTransaction, transactions);
                }
            }
        }
        else { //sender is not this address
            handleReceiveSui(block, address, suiTransaction, transactions);
        }

    } //tx block

 //   await addCurrencyData(transactions);

    return transactions;
}

async function calculateScalarData(address: string, fromEpoch?: number, toEpoch?: number){

    const transactions = await getData(address);

    const txPerEpochMap = new Map<number, SuiTransactionType[]>();
    const scalarTransactions: SuiTransactionScalarData[] = [];

    const orderedTransactions = transactions.sort((a, b) => a.timestampMs - b.timestampMs);

    orderedTransactions.forEach(transaction => {
        addTransactionForEpoch(transaction.epoch!, transaction,  txPerEpochMap);
    });


    const transactionsForEpoch = txPerEpochMap.get(fromEpoch);

    const suiTransactionScalarData = {
        epoch: fromEpoch,
        balance: 0,
        stakedBalance: 0,
        rewardsBalance: 0
    };

    for (let i = 0; i < transactionsForEpoch.length; i++) {
        const transaction = transactionsForEpoch[i];
        if (transaction.type === TransactionType.staking) {
            suiTransactionScalarData.stakedBalance += transaction.principalAmount!;
        } else if (transaction.type === TransactionType.unstaking) {
            suiTransactionScalarData.stakedBalance -= transaction.principalAmount!;
            suiTransactionScalarData.rewardsBalance += transaction.rewardsAmount!;
        } else if (transaction.type === TransactionType.receive) {
            suiTransactionScalarData.balance += transaction.principalAmount!;
        } else if (transaction.type === TransactionType.send) {
            suiTransactionScalarData.balance -= transaction.principalAmount!;
        }
    }


    for(let i = fromEpoch; i <= toEpoch; i++){

        const transactionsForEpoch = txPerEpochMap.get(i);

        const suiTransactionScalarData = {
            epoch: i,
            balance: 0,
            stakedBalance: 0,
            rewardsBalance: 0
        };

        if(transactionsForEpoch){
            //do something with the transactions for the epoch
        }
    }



}

async function main(){
    calculateScalarData('0x7d819ea06c8dea160dce6a7df62ba3413762f05377087315441f57239198d2ac');
}

main();
