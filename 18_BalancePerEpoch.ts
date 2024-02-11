import {
    StakingRequestEvent, SuiTransactionType,
    TransactionType,
    UnstakingRequestEvent
} from './types';
import {
    CheckpointPage,
    SuiClient,
    SuiEvent,
    SuiTransaction,
    SuiTransactionBlockResponse
} from '@mysten/sui.js/client';
import {
    addTransactionForEpoch,
    getTxDigests,
} from "./17_TransactionHistoryForAddress";

const client = new SuiClient({
    url: 'https://mysten-rpc.mainnet.sui.io'//getFullnodeUrl('mainnet')
});

const MIST_PER_SUI = 1000000000;

export function handleStakeUnstakeEvents(events: SuiEvent[],
                                         suiTransaction: SuiTransactionType,
                                         transactionsMap: Map<number, SuiTransactionType[]>) {
    const event = events[0];

    const eventType = event.type;
    if (eventType.includes('validator::StakingRequestEvent')) {
        suiTransaction.type = TransactionType.staking;
        const stakingRequestEvent = event.parsedJson as StakingRequestEvent;
        suiTransaction.principalAmount = parseInt(stakingRequestEvent.amount) / MIST_PER_SUI; //Amount Staked

        addTransactionForEpoch(suiTransaction.epoch, suiTransaction, transactionsMap);
    } else if (eventType.includes('validator::UnstakingRequestEvent')) {

        suiTransaction.type = TransactionType.unstaking;
        const unstakingEvent: UnstakingRequestEvent = event.parsedJson as UnstakingRequestEvent;
        suiTransaction.principalAmount = unstakingEvent.principal_amount / MIST_PER_SUI;
        suiTransaction.rewardsAmount = unstakingEvent.reward_amount / MIST_PER_SUI;

        addTransactionForEpoch(suiTransaction.epoch, suiTransaction, transactionsMap);
    }
}


export function handleSendSuiTx(block : SuiTransactionBlockResponse,
                                address: string,
                                suiTransaction: SuiTransactionType,
                                transactionsMap: Map<number, SuiTransactionType[]>) {
    const tx = block.transaction?.data.transaction;


    if (tx && tx.kind === 'ProgrammableTransaction') {

        let suiBalanceChangesForAddress = block.balanceChanges.filter(balanceChange => {
            return (Object.keys(balanceChange.owner)[0] == 'AddressOwner' && Object.values(balanceChange.owner)[0] === address && balanceChange.coinType.includes('sui::SUI') )
        });

        suiBalanceChangesForAddress.forEach(balanceChange => {
            suiTransaction.type = TransactionType.send;

            suiTransaction.principalAmount = parseInt(balanceChange.amount) / MIST_PER_SUI;
            addTransactionForEpoch(suiTransaction.epoch, suiTransaction, transactionsMap);
        });
    }
}

export function handleReceiveSui(block : SuiTransactionBlockResponse,
                                 address: string,
                                 suiTransaction: SuiTransactionType,
                                 transactionsMap: Map<number, SuiTransactionType[]>) {
    const tx = block.transaction?.data.transaction;

    if (tx && tx.kind === 'ProgrammableTransaction') {

        let suiBalanceChangesForAddress = block.balanceChanges.filter(balanceChange => {
            return (Object.keys(balanceChange.owner)[0] == 'AddressOwner' && Object.values(balanceChange.owner)[0] === address && balanceChange.coinType.includes('sui::SUI') )
        });
        suiBalanceChangesForAddress.forEach(balanceChange => {
            suiTransaction.type = TransactionType.receive;
            suiTransaction.principalAmount = parseInt(balanceChange.amount) / MIST_PER_SUI;
            addTransactionForEpoch(suiTransaction.epoch, suiTransaction, transactionsMap);
        });
    }
}

export async function getData(address: string): Promise<Map<number, SuiTransactionType[]>> {

    let transactionPerEpoch = new Map<number, SuiTransactionType[]>();

    console.log('Querying Transactions for Address ', address);

    const txDigests = await getTxDigests(address);

    if (txDigests.length === 0) {
        return transactionPerEpoch;
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
        };
        suiTransaction.epoch = parseInt(block.effects.executedEpoch);

        var date = new Date(suiTransaction.timestampMs);
        suiTransaction.timestampDate = date.toISOString();

        if (sender && sender === address) {

            let eventsLength = block.events?.length || 0;
            if (block.effects?.status.status === 'success') {

                if (eventsLength > 0) {
                    const events: SuiEvent[] = (block.events || []) as SuiEvent[];
                    handleStakeUnstakeEvents(events, suiTransaction, transactionPerEpoch);
                }
                else {
                    //tx is send sui to other account
                    handleSendSuiTx(block, address, suiTransaction, transactionPerEpoch);
                }

            }
        }else{
            //sender is not this address
            handleReceiveSui(block, address, suiTransaction, transactionPerEpoch);
        }

    }
    return transactionPerEpoch;
}


 getData('0x7d819ea06c8dea160dce6a7df62ba3413762f05377087315441f57239198d2ac')
     .then(data => {

            data.forEach((value: SuiTransactionType[], key: number) => {
                console.log('Epoch:', key);
                value.forEach((transaction: SuiTransactionType) => {
                    console.log('Transaction:', transaction);
                });
            });
     });

