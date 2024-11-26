import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {SUI_NETWORK} from "./config";

const client = new SuiClient({
    url: SUI_NETWORK!
});



console.log("Getting Multiple Objects with Batch Request");


const myAddress = '0x7bfe53744b0cef3ec21da0ad284b91f4cd64fa933ba8e0b75a5f263c8543427e'; //Example Address

const blobs = [];

const objects = client.getOwnedObjects(
    {
        owner: myAddress,
        options: {
            showContent: true,
            showType: true
        }
    }
).then(function (res) {
    console.log('Results:');
    console.log('----- Objects Owned By Address: ' + myAddress + " ------------------- :");
    res.data.forEach(obj => {
        const dataType = obj.data.content.dataType;
        console.log('Object id : ' + obj.data.objectId, " - ", dataType == "moveObject" ? obj.data.content.type : dataType );

        if(dataType == "moveObject" && obj.data.content.type == "0x8bf57168d5acb0e83efa49905a326d0d62ff147955106d94fb09b6abdaa7bbc::blob::Blob") {
            blobs.push(obj.data.objectId);
        }
    });
    console.log('Results END--------------------------');
}).then(function () {

});
//
// client.getStakes({
//     owner: myAddress
// }).then(function (res) {
//     console.log('Results:');
//     console.log('----- Stakes for Address: ' + myAddress + " ------------------- :");
//     res.forEach(stake => {
//         stake.stakes.forEach(stake => {
//             console.log('Stake id : ' + stake.stakedSuiId, " - ",JSON.stringify(stake, null, 2));
//         });
//     });
//     console.log('Results END--------------------------');
// });

