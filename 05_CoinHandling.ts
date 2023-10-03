
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


async function doActions () {

    const tx = new TransactionBlock();

    const { error, transferredGasObjects } = await requestSuiFromFaucetV0({
        recipient: adminAddress,
        host: getFullnodeUrl("testnet"),
    });

    console.log("gas created ", transferredGasObjects);

    // client.signAndExecuteTransactionBlock({
    //     transactionBlock: tx,
    //     signer: adminKeypair,
    // }).then(result=>{
    //     console.log( result );
    // })

}

doActions();
