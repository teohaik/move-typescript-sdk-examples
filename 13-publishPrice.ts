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

    let price2 = txb.moveCall({
        target: `${PACKAGE_ADDRESS}::price_oracle::new_price_2`,
        arguments: [
            txb.object(PRICE_ADMIN_CAP_ID!),
            txb.pure(now),
            txb.pure("EURUSD"),
            txb.pure([
                ["publisher", "r", "s", "v"],
                ["publisher-1", "rrr"+now, "ssssss"+now, "vvv"+now]
            ], "vector<vector<string>>")
        ],
    });

    txb.transferObjects([price2], txb.pure(adminAddress));

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
