
import { JsonRpcProvider } from '@mysten/sui.js';

let message: string = 'Hello, Sui!';
console.log(message);

const myAddress = '0x788a511738ad4ab1d7f769b49076d9c7b272826c';


const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io:443');
const objects = provider.getObjectsOwnedByAddress(
    myAddress
).then(function (res) {
    console.log('results');
  //  console.log(res);

    console.log(' Objects Owned By Address'+myAddress +" :");
    res.forEach(a => {
        console.log('Object id : ' + a.objectId + "Type:  " + a.type);
    });

});