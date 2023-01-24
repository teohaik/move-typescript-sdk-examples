import { Ed25519Keypair, JsonRpcProvider, RawSigner, Network  } from '@mysten/sui.js';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider(Network.DEVNET);
const signer = new RawSigner(keypair, provider);


const addr = keypair.getPublicKey().toSuiAddress();

console.log("Requesting sui tokens for address: " + addr);

provider.requestSuiFromFaucet(addr)
        .then(function(result){
            console.log("Request finished with result: "+ result);
        })



const keypair2 = new Ed25519Keypair();

console.log(" public key base 64 ", keypair2.getPublicKey().toBase64());
console.log(" public key toString ", keypair2.getPublicKey().toString());

console.log(" public key to Sui Address ", keypair2.getPublicKey().toSuiAddress());

console.log("Exporter keypair", keypair2.export());

