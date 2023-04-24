/**
 * Retrieves all Objects owned by a given address
 */
import {Connection, JsonRpcProvider} from "@mysten/sui.js";


const connOptions = new Connection({
    fullnode: 'https://suifrens-rpc.testnet.sui.io:443',
});

let provider = new JsonRpcProvider(connOptions);

const capyArray = [
    "0x13008cab6607258afe42267f3c24839615dd5da123e914b5062e5a18ce795037",
    "0x182dbc757a8e6387e100a30e4fb2de0167b2e30dcea55011da4500548ee79171",
    "0x224ee50f6591acddbc6b9c5f83b9c58779a641f06562b7dbe37232d0cb29f5a2"
]


console.log("Getting Multiple Objects with Batch Request");

console.log("Batch array = ", capyArray);
provider.multiGetObjects( {
    ids:capyArray
} ).then(function (res){
    console.log("batch response");
    for(let i =0; i< res.length; i++){
        let obj = res[i];
        console.log(obj);
    }
});


const myAddress = '0x6cd789e6e45489fc61959e0aaa57e573f76c57d05c3c376684f6810e899ecc37'; //Example Address


const objects = provider.getOwnedObjects( {owner:  myAddress }
).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: ' +myAddress +" ------------------- :");
    res.data.forEach(obj => {
        console.log('Object id : ' + obj.data.objectId );
    });
    console.log('Results END--------------------------');
});