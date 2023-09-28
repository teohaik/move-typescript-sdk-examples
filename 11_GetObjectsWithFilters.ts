/**
 * Retrieves all Objects owned by a given address
 */
import {SUI_FRAMEWORK_ADDRESS, fromB64} from '@mysten/sui.js/utils';
import {SuiClient} from "@mysten/sui.js/client";


const client = new SuiClient({url: "https://explorer-rpc.mainnet.sui.io/"});

console.log("Getting Multiple Objects with Batch Request");


const myAddress = '0x9a13bca12a4360885185e53f0c20bd47c7707e895cbddeed96d6daa293ca084d'; //Example Address

const coinFlipObjects = client.getOwnedObjects(
    {
        owner:  myAddress,
        filter: {
            MatchAny: [
                {StructType: `0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>`},
                {ObjectId : '0xf22c2eed91403d9c62e347287586af7e28fda6a3406e0142de5839aa331ddee2'},
                {StructType: `${SUI_FRAMEWORK_ADDRESS}::kiosk::KioskOwnerCap`},
            ]

        }
    }

).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: ' +myAddress +" - with filter :");
    res.data.forEach(obj => {
        console.log('Object id : ' + obj.data.objectId );
    });
    console.log('Results END--------------------------');
});