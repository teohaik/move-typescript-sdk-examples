
import {fromB64} from '@mysten/sui/utils';
import {Transaction} from '@mysten/sui/transactions';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';

import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";

//Admin-partner signer setup
let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(process.env.ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

console.log("Price Admin address: ", adminAddress);

const client = new SuiClient({
    url: getFullnodeUrl("testnet")
});


async function doSplitCoinActions (cointToSplit : string) {

    const txb = new Transaction();

    const coinToPay = await  client.getObject({ id: cointToSplit });

    let newcoins1 = txb.splitCoins(txb.gas, [txb.pure.u64(7000000)]);
    let newcoins2 = txb.splitCoins(txb.gas, [txb.pure.u64(7000000)]);

    txb.transferObjects([newcoins1, newcoins2], txb.pure.address(adminAddress!));

    txb.setGasBudget(100000000);

    txb.setGasPayment([{
        digest: coinToPay.data.digest,
        objectId: coinToPay.data.objectId,
        version: coinToPay.data.version
    }]);

    client.signAndExecuteTransaction({
        signer: adminKeypair,
        transaction: txb,
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

doSplitCoinActions('0x2b31426fdebd67f866f23fe82510c3fb26cb7229e6ea3354b722a618c3b646b6');
