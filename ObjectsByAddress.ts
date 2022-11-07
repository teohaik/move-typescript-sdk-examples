
import { JsonRpcProvider } from '@mysten/sui.js';

let message: string = 'Hello, Sui!';
console.log(message);

const myAddress = '0x3e68b87e765d62a8c7ab8c2fbb284ad72d750e17';


const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io:443');
const objects = provider.getObjectsOwnedByAddress(
    myAddress
).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: '+myAddress +" ------------------- :");
    res.forEach(obj => {
        console.log('Object id : ' + obj.objectId + " - Type:  " + obj.type);
    });

});