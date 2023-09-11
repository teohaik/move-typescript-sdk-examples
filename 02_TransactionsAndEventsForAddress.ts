
import {JsonRpcProvider, Connection, Checkpoint} from '@mysten/sui.js';
import {CheckpointPage} from "@mysten/sui.js/src/types/checkpoints";
import {getFullnodeUrl} from "@mysten/sui.js/client";

const connOptions = new Connection({
    fullnode: getFullnodeUrl("testnet")
});

let provider = new JsonRpcProvider(connOptions);

/**
 *  Get latest 100 checkpoints in descending order and print Transaction Digests for each one of them
 */
provider.getCheckpoints({descendingOrder: true})
    .then(function (checkpointPage: CheckpointPage) {
        checkpointPage.data.forEach(checkpoint => {
            console.log("---------------------------------------------------------------")
            console.log(" -----------   Transactions for Checkpoint:  ", checkpoint.sequenceNumber, " -------- ")
            console.log("---------------------------------------------------------------")
            checkpoint.transactions.forEach(tx => {
                console.log(tx);
            })
            console.log("***************************************************************")
        })
    });


/**
 *  Get Checkpoint 1994010 and print details
 */
provider.getCheckpoint({id: "1994010"})
    .then(function (checkpoint: Checkpoint) {
        console.log("Checkpoint Sequence Num ", checkpoint.sequenceNumber);
        console.log("Checkpoint timestampMs ", checkpoint.timestampMs);
        console.log("Checkpoint # of Transactions ", checkpoint.transactions.length);

    });



provider.getTransactionBlock({
    digest:'HyWEk1GCEVVSgSG2GiNgigeY7TQsDs2WGQbAE5f5JGQz',
    options: {
        showInput: false,
        showEffects: true,
        showEvents: false,
        showObjectChanges: false,
        showBalanceChanges: false
    }
}).then(block => {
    console.log(block.effects);
})


provider.multiGetTransactionBlocks({
    digests:
        [
            "1WuC2hJs2kkBpe4Rk7jDyefZLZBJDJF5EwM2Kew7sVB",
            "9psfk16gp3aX4nLGy8Err5PpvLmdaVwovL4SueqCBEW5",
            "9xzjuoob2qsrh9kFMoHn8vbpiojesqZ3Wv3wkJ6Tz1Nv",
            "3MzDkyZya7BRvtxkeM8NhtPGgJLX122gxHVNpc4Cxvkq",
            "B1mAvKT9ADQpqrFHgmN8vrb5cakQfoYtdU2WyWzW5yYZ",
            "AgPRUDrrJrAGUEj63H6NTq7DsjhB7EBxeGwEJynRzt8E",
            "2W87VEbK3aLASNmmpQrmRN6FF6TkBojCgqTmjzsuWMGE",
            "7mhDpg9zJSsq7KXHsnqWwCrBfbHpXTRFkGXHRPpcztHJ",
            "4CWyteng664d5rLT2fJGv9k5k3vCFvSDDRpYPVfBHXg2",
        ],
        options: {
            showInput: false,
            showEffects: true,
            showEvents: false,
            showObjectChanges: false,
            showBalanceChanges: true
        }
}).then(block => {
    let totalCompCost = 0;
    let totalStorageCost = 0;
    let totalStorageRebate = 0;
    let totalNonRefundableFee = 0;
    for(let i=0; i<block.length; i++){
        const b = block[i];
        totalCompCost += parseInt(b.effects.gasUsed.computationCost);
        totalStorageRebate += parseInt(b.effects.gasUsed.storageRebate);
        totalStorageCost += parseInt(b.effects.gasUsed.storageCost);
        totalNonRefundableFee += parseInt(b.effects.gasUsed.nonRefundableStorageFee);
    }

    console.log("Total TXs =  ", block.length);
    console.log("-----------------------------------------------")
    console.log("Total Computation Cost: \t", totalCompCost);
    console.log("Total Storage Rebate: \t", totalStorageRebate);
    console.log("Total Storage Cost: \t", totalStorageCost);
    console.log("Total Non Refundable Fee: \t", totalNonRefundableFee);

    const base = 1000000000;
    console.log("-----------------------------------------------")
    console.log("IN SUI")
    console.log("-----------------------------------------------")
    console.log("Total Computation Cost: \t", totalCompCost/base);
    console.log("Total Storage Rebate: \t", totalStorageRebate /base );
    console.log("Total Storage Cost: \t", totalStorageCost/base);
    console.log("Total Non Refundable Fee: \t", totalNonRefundableFee/base);

})


