import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';
// Generate a new Keypair
//const keypair = new Ed25519Keypair();


//Use the recovery phrase to load the current active keypair
const keypair = Ed25519Keypair.deriveKeypair("bless bright cactus spy couch try spell cart slam salt law pretty");

const provider = new JsonRpcProvider();

const signer = new RawSigner(keypair, provider);
const mergeTxn = signer.mergeCoin({
    primaryCoin: '0x1bd3088fe01984492a961f83532d185ea2d654ad',
    coinToMerge: '0xf4b66604861a351d0998cca2131efdbcb5ed21c0',
    gasBudget: 1000,
}).then(function(res){
    console.log("OK");
});
console.log('MergeCoin txn', mergeTxn);