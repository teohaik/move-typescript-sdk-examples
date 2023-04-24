import {Ed25519Keypair, JsonRpcProvider, RawSigner,  Connection} from '@mysten/sui.js';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();

const connOptions = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io:443',
    faucet:  'https://fullnode.testnet.sui.io:443/faucet'
});
let provider = new JsonRpcProvider(connOptions);

const addr = keypair.getPublicKey().toSuiAddress();

console.log("Requesting sui tokens for address: " + addr);

provider.requestSuiFromFaucet('0x6cd789e6e45489fc61959e0aaa57e573f76c57d05c3c376684f6810e899ecc37')
        .then(function(result){
            console.log("Request finished with result: "+ result);
        })


console.log(" public key base 64 ", keypair.getPublicKey().toBase64());
console.log(" public key toString ", keypair.getPublicKey().toString());

console.log(" public key to Sui Address ", keypair.getPublicKey().toSuiAddress());

console.log("Exported keypair", keypair.export());

