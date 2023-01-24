import {
    Base64DataBuffer,
    Ed25519Keypair,
    JsonRpcProvider,
    LocalTxnDataSerializer,
    Network,
    RawSigner
} from '@mysten/sui.js';

const keypair = Ed25519Keypair.deriveKeypair("brown tilt squeeze session today dumb twenty power warrior inch lecture maid");

const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);
const moveCallTxn =  signer.executeMoveCall({
    packageObjectId: '0x2',
    module: 'devnet_nft',
    function: 'mint',
    typeArguments: [],
    arguments: [
        'Example NFT',
        'An NFT created by the wallet Command Line Tool',
        'ipfs://bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty',
    ],
    gasBudget: 10000,
}).then(function (result){
    console.log(result);
});

