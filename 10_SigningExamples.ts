import {
    JsonRpcProvider,
    RawSigner,
    Secp256k1Keypair,
    testnetConnection,
} from '@mysten/sui.js';

const VALID_SECP256K1_SECRET_KEY = [
    59, 148, 11, 85, 134, 130, 61, 253, 2, 174, 59, 70, 27, 180, 51, 107, 94, 203,
    174, 253, 102, 39, 170, 146, 46, 252, 4, 143, 236, 12, 136, 28,
];

let secp256k1Keypair = Secp256k1Keypair.generate();

const secret_key = new Uint8Array(VALID_SECP256K1_SECRET_KEY);

const keypair256k1 = Secp256k1Keypair.fromSecretKey(secret_key);

const signer = new RawSigner(keypair256k1, new JsonRpcProvider(testnetConnection));

const address = keypair256k1.getPublicKey().toSuiAddress();
console.log('address = ', address);

let signData = new TextEncoder().encode('hello world');
signer.signData(signData).then((signature) => {
    console.log('signature = ', signature);
});

//Should print signature:
// Ad0rzhFvX6DXsNl/ZBcqssNByWwaVwcFQCBNy9YlZw+SXEL0VNbdfUhTzZALUfoy3my3mpNIQVJ9mXKa/Ash0KACHRUjB8a3Kw7QQYsOcM2A5/UpW42G9XItP1IT+9I5TzY=