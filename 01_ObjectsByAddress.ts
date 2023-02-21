/**
 * Retrieves all Objects owned by a given address
 */
import {JsonRpcProvider, Network} from '@mysten/sui.js';

const provider = new JsonRpcProvider(Network.DEVNET);

const capyArray = [
    "97c87130059f483c67540197f788728be6890c29",
    "e3a0240465103d7d5472eb53312d04368df2e36d",
    "95a32be2f7ae6d68f91b0e85898db3a4df44100c"
]


console.log("Getting Multiple Objects with Batch Request");

console.log("Batch array = ", capyArray);
provider.getObjectBatch(
    capyArray
).then(function (res){
    console.log("batch response");
    for(let i =0; i< res.length; i++){
        let obj = res[i];
        console.log(obj);
    }
});



const myAddress = '0x3e68b87e765d62a8c7ab8c2fbb284ad72d750e17'; //Example Address


const objects = provider.getObjectsOwnedByAddress(
    myAddress
).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: '+myAddress +" ------------------- :");
    res.forEach(obj => {
        console.log('Object id : ' + obj.objectId + " - Type:  " + obj.type);
    });
    console.log('Results END--------------------------');
});