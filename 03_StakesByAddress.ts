import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});


console.log("Getting Multiple Objects with Batch Request");

const myAddress = '0x7d819ea06c8dea160dce6a7df62ba3413762f05377087315441f57239198d2ac'; //Example Address

client.getOwnedObjects(
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
        const contentType = dataType == "moveObject" ? obj.data.content.type : dataType;
        if(contentType.includes('0x3::staking_pool::StakedSui')){

            client.getObject({
                id: obj.data.objectId,
                options: {
                    showContent: true,
                    showType: true
                }
            }).then(function (res) {
                if(res.data.content.dataType == "moveObject"){
                    const fields = res.data.content.fields;
                    console.log(res.data.objectId.substring(0,10), " - pool id : ", fields['pool_id']);
                }
            });
        }
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
