import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";

import {fromB64} from '@mysten/sui.js/utils';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {SUI_NETWORK} from "./config";
import {generateNonce, generateRandomness} from "@mysten/zklogin";

console.log("Connecting to SUI network: ", SUI_NETWORK);

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

//Admin signer setup
let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(process.env.ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

console.log("Admin address: ", adminAddress);



async function doActions() {

    const REDIRECT_URI = 'https://zklogin-dev-redirect.vercel.app/api/auth';

    const params = new URLSearchParams({
        // When using the provided test client ID + redirect site, the redirect_uri needs to be provided in the state.
        state: new URLSearchParams({
            redirect_uri: REDIRECT_URI
        }).toString(),
        // Test Client ID for devnet / testnet:
        client_id: process.env.GOOGLE_DEV_CLIENT_ID!,
        redirect_uri: REDIRECT_URI,
        respond_type: 'id_token',
        scope: 'openid',
        // See below for details about generation of the nonce
        nonce: 'nonce',
    });

    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    const currentEpoch = 124;//;await  client.getCurrentEpoch();

    const maxEpoch = 124 + 2;
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

    console.log("nonce = ", nonce);

}


doActions();
























//
// async function executeTX() {
//
//
//     const txb = new TransactionBlock();
//     txb.setGasBudget(1000000000);
//
//     client.signAndExecuteTransactionBlock({
//         signer: adminKeypair,
//         transactionBlock: txb,
//         requestType: "WaitForLocalExecution",
//         options: {
//             showEffects: true,
//             showObjectChanges: true,
//         }
//
//     }).then(res => {
//         const status = res?.effects?.status.status;
//
//         if (status === "success") {
//             console.log("\r\n  Status = ", status);
//             console.log("Transaction digest = ", res?.digest, "   ");
//
//             res?.objectChanges?.find((obj) => {
//                 if (obj.type === "created"  && obj.objectType.startsWith("AAA")) {
//
//                 }
//             });
//
//         }
//         if (status == "failure") {
//             console.log("Error = ", res?.effects);
//             process.exit(1);
//         }
//
//     }).catch(error => {
//         console.log(error);
//     });
//
// }
//
