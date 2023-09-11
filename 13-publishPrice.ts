import {
    Ed25519Keypair,
    fromB64,

    TransactionBlock,
} from "@mysten/sui.js";

import {
    PACKAGE_ADDRESS,
    ADMIN_SECRET_KEY,
    SUI_NETWORK, PRICE_ADMIN_CAP_ID, PRICE_ORACLE_ID,
} from "./config";

import {SuiClient} from "@mysten/sui.js/client";

console.log("Connecting to SUI network: ", SUI_NETWORK);


//Admin-partner signer setup
let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

console.log("Price Admin address: ", adminAddress);

const client = new SuiClient({
    url: SUI_NETWORK,
});


const doActions = async () => {

    const txb = new TransactionBlock();

    const now: number = Date.now();

    console.log("updating price at: ", now);
    txb.moveCall({
        target: `${PACKAGE_ADDRESS}::price_oracle::publish_price`,
        arguments: [
            txb.object(PRICE_ADMIN_CAP_ID!),
            txb.object(PRICE_ORACLE_ID!),
            txb.pure(now),
            txb.pure("EURUSD"),
            txb.pure(["publisher", "r", "s", "v"]),
            txb.pure(["publisher-1", "rrr"+now, "ssssss"+now, "vvv"+now]),
        ],
    });

    txb.setGasBudget(1000000000);

    let txRes =
        await client.signAndExecuteTransactionBlock({
            signer: adminKeypair,
            transactionBlock: txb,
            requestType: "WaitForLocalExecution",
            options: {
                showEffects: true, showObjectChanges: true,
            },
        });

    let status1 = txRes.effects?.status;
    if (status1?.status !== "success") {
        console.log("process failed. Status: ", status1);
        process.exit(1);
    }
    console.log("process Finished. Status: ", status1);

    console.log("Check Price at:");
    console.log(`https://suiexplorer.com/object/${PRICE_ORACLE_ID}?network=testnet`);
}


doActions();


//
//
// const keys1 = ["r", "s", "v"];
// const values1 = ["rrr1", "ss1", "vvv1"];
// const keys2 = ["r", "s", "v"];
// const values2 = ["rrr1", "ss1", "vvv1"];
//
//
// const vec = txb.makeMoveVec({
//     objects: [
//         txb.makeMoveVec({objects:[txb.pure(keys1)]}),
//         txb.makeMoveVec({objects:[txb.pure(values1)]}),
//         txb.makeMoveVec({objects:[txb.pure(keys2)]}),
//         txb.makeMoveVec({objects:[txb.pure(values2)]}),
//     ],
// });
//
// const vec2 = txb.makeMoveVec({
//     objects: [
//         txb.pure(keys1,"string"),
//         txb.pure(values2,"string"),
//     ],
// });
// const masterVec = [keys1, values1, keys2,values2];
//
// let price_with_map = txb.moveCall({
//     target: `${PACKAGE_ADDRESS}::stork::new_price_2`,
//     arguments: [
//         txb.object(PRICE_CAP_ID),
//         txb.pure("16944286666"),
//         txb.pure("data with map"),
//         txb.pure(
//             bcs
//                 .ser(
//                     "vector<vector<string>>",
//                     masterVec
//                 )
//                 .toBytes()
//         ),
//     ],
// });
//
// txb.transferObjects([price1, price_with_map], txb.pure(adminAddress));