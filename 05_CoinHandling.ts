import {Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock} from '@mysten/sui.js';

//Use the recovery phrase to load the current active keypair
const keypair = Ed25519Keypair.deriveKeypair("bless bright cactus spy couch try spell cart slam salt law pretty");

const provider = new JsonRpcProvider();

const tx = new TransactionBlock();

const signer = new RawSigner(keypair, provider);

tx.mergeCoins(
    tx.object(
        '0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2',
    ),
    [
        tx.object(
            '0x127a8975134a4824d9288722c4ee4fc824cd22502ab4ad9f6617f3ba19229c1b',
        ),
    ],
);
signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
}).then(result=>{
    console.log( result );
})

