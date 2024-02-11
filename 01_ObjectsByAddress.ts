import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});

const capyArray = [
    "0x13008cab6607258afe42267f3c24839615dd5da123e914b5062e5a18ce795037",
    "0x182dbc757a8e6387e100a30e4fb2de0167b2e30dcea55011da4500548ee79171",
    "0x224ee50f6591acddbc6b9c5f83b9c58779a641f06562b7dbe37232d0cb29f5a2"
]


console.log("Getting Multiple Objects with Batch Request");

console.log("Batch array = ", capyArray);


const myAddress = '0x7d819ea06c8dea160dce6a7df62ba3413762f05377087315441f57239198d2ac'; //Example Address



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
    });
    console.log('Results END--------------------------');
});

client.getStakes({
    owner: myAddress
}).then(function (res) {
    console.log('Results:');
    console.log('----- Stakes for Address: ' + myAddress + " ------------------- :");
    res.forEach(stake => {
        stake.stakes.forEach(stake => {
            console.log('Stake id : ' + stake.stakedSuiId, " - ",JSON.stringify(stake, null, 2));
        });
    });
    console.log('Results END--------------------------');
});
