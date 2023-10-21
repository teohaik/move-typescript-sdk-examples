import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";
import {fromB64} from '@mysten/sui.js/utils';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {SuiMoveNormalizedModules} from "@mysten/sui.js/src/client/types";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const capyArray = [
    "0x13008cab6607258afe42267f3c24839615dd5da123e914b5062e5a18ce795037",
    "0x182dbc757a8e6387e100a30e4fb2de0167b2e30dcea55011da4500548ee79171",
    "0x224ee50f6591acddbc6b9c5f83b9c58779a641f06562b7dbe37232d0cb29f5a2"
]


console.log("Getting Multiple Objects with Batch Request");

console.log("Batch array = ", capyArray);


const myAddress = '0x6cd789e6e45489fc61959e0aaa57e573f76c57d05c3c376684f6810e899ecc37'; //Example Address


const objects = client.getOwnedObjects(
    {owner:  myAddress, options:{showContent: true}}
).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: ' +myAddress +" ------------------- :");
    res.data.forEach(obj => {
        console.log('Object id : ' + obj.data.objectId , " - ", obj.data.content.dataType);
    });
    console.log('Results END--------------------------');
});

