
import {fromB64} from '@mysten/sui.js/utils';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import { requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";

//Admin-partner signer setup
let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(process.env.ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

console.log("Price Admin address: ", adminAddress);

const client = new SuiClient({
    url: getFullnodeUrl("testnet")
});


async function doSplitCoinActions (cointToSplit : string) {

    const txb = new TransactionBlock();

    const coinToPay = await  client.getObject({ id: cointToSplit });

    let newcoins1 = txb.splitCoins(txb.gas, [txb.pure(7000000)]);
    let newcoins2 = txb.splitCoins(txb.gas, [txb.pure(7000000)]);

    txb.transferObjects([newcoins1, newcoins2], txb.pure(adminAddress!));

    txb.setGasBudget(100000000);

    txb.setGasPayment([{
        digest: coinToPay.data.digest,
        objectId: coinToPay.data.objectId,
        version: coinToPay.data.version
    }]);

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

doSplitCoinActions('0x9de03681002234a697df06c63fc748cc2899f66ac61ef463bf4ff1e5cb3db5b4');
