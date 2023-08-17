
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



