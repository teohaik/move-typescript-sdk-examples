import {fromB64} from '@mysten/sui.js/utils';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';

import {
    PACKAGE_ADDRESS, SUI_NETWORK,
} from "./config";

import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";

//Admin-partner signer setup
let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(process.env.ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

console.log("Admin address: ", adminAddress);

const client = new SuiClient({
    url: SUI_NETWORK
});


const doactions = async () => {


    const txb = new TransactionBlock();

    const now: number = Date.now();

    console.log("Package = ",PACKAGE_ADDRESS);
    txb.moveCall({
        target: `${PACKAGE_ADDRESS}::allow_list_test::add_to_whitelist`,
        arguments: [
            txb.pure(adminAddress!),
        ],
    });



    txb.setGasBudget(1000000000);
    client.signAndExecuteTransactionBlock({
        signer: adminKeypair,
        transactionBlock: txb,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true, showObjectChanges: true,
        },
    }).then((txRes) => {

        let status1 = txRes.effects?.status;
        if (status1?.status !== "success") {
            console.log("process failed. Status: ", status1);
            process.exit(1);
        }
        console.log("process Finished. Status: ", status1);
    }).catch((err) => {
        console.log("process failed. Error: ", err);
        process.exit(1);
    });

}


const doactions2 = async () => {


    client.getAllCoins({owner: adminAddress}).then((coins) => {
        console.log("Coins: ", coins);
    });

}


doactions();
