import {Connection, JsonRpcProvider} from "@mysten/sui.js";

const connOptions = new Connection({
    fullnode: 'https://suifrens-rpc.testnet.sui.io:443',
});

let provider = new JsonRpcProvider(connOptions);


let parent = '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a';
provider.getDynamicFields({parentId: parent}).then(res => {
    provider.getDynamicFieldObject({
        parentId: parent, name: res.data[0].name
    }).then(res => {
        console.log(JSON.stringify(res, null, 4));
    });
});
