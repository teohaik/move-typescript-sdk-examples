import {ADMIN_SECRET_KEY, PACKAGE_ADDRESS, SUI_NETWORK, USER_SECRET_KEY} from "./config";

import {SuiClient} from "@mysten/sui.js/client";
import {fromB64} from '@mysten/sui.js/utils';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';

console.log("Connecting to SUI network: ", SUI_NETWORK);

const client = new SuiClient({
    url: SUI_NETWORK,
});

let adminPrivateKeyArray = Uint8Array.from(Array.from(fromB64(ADMIN_SECRET_KEY!)));
const adminKeypair = Ed25519Keypair.fromSecretKey(adminPrivateKeyArray.slice(1));
const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

let privateKeyArray = Uint8Array.from(Array.from(fromB64(USER_SECRET_KEY!)));
const userKeypair = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));
const userAddress = userKeypair.getPublicKey().toSuiAddress();


const doSponsoredMint = async () => {

    console.log("Sponsored Transaction Example. " +
        "User mints and object, gas paid from admin account");
    console.log("User address   : ", userAddress);
    console.log("Admin address  : ", adminAddress);

    const txb = new TransactionBlock();

    txb.moveCall({
        target: `${PACKAGE_ADDRESS}::teotest::create_weapon`,
        arguments: [
            txb.pure("Super Axe 2000"),  // weapon name
            txb.pure(89),  // weapon damage
        ],
    });

    const kindBytes = await txb.build({client: client, onlyTransactionKind: true});

    let sponsoredTx = await sponsorTransaction( userAddress, // TX Sender (executor)
                                                                adminAddress, // sponsor
                                                                kindBytes);

    let signedTX = await userKeypair.signTransactionBlock(
        await TransactionBlock.from(sponsoredTx.bytes).build({client: client}));

    client.executeTransactionBlock({
        transactionBlock: signedTX.bytes,
            signature: [signedTX.signature, sponsoredTx.signature],
            requestType: "WaitForLocalExecution",
            options: {
                showEvents: true,
                showEffects: true,
                showObjectChanges: true,
                showBalanceChanges: true,
                showInput: true
            }
        }
    ).then(res => {
        const status = res?.effects?.status.status;

        if (status === "success") {
            console.log("\r\n executed! status = ", status);
            console.log("Transaction digest = ", res?.digest, "   ");
            process.exit(0);
        }
        if (status == "failure") {
            console.log("Error = ", res?.effects);
            process.exit(1);
        }

    }).catch(error => {
        console.log(error);
    });
}


export async function sponsorTransaction(sender: string,
                                         sponsorAddress: string,
                                         transactionKindBytes: Uint8Array) {

    console.log(`Sponsor address: ${sponsorAddress}`);
    const tx = TransactionBlock.fromKind(transactionKindBytes);
    tx.setSender(sender);
    tx.setGasOwner(sponsorAddress);
    return adminKeypair.signTransactionBlock(await tx.build({client: client}));
}


doSponsoredMint();
