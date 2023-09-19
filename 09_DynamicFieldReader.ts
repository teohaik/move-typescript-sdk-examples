import {getFullnodeUrl, SuiClient, SuiParsedData} from "@mysten/sui.js/client";
import {SuiMoveObject} from "@mysten/sui.js";

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});


const readTable = async function (tableId: string) {
    client.getDynamicFields({parentId: tableId}).then(dynamicFieldPage => {

        const resultData = dynamicFieldPage.data;

        resultData?.forEach(tableRowResult => {
            const poolId = tableRowResult.objectId;
            client.getObject({
                id: poolId,
                options: {showContent: true}
            }).then(dynFieldForPool => {
                const poolFields  = (dynFieldForPool.data.content as SuiMoveObject).fields.value.fields;
                console.log("Dynamic Field id = ",dynFieldForPool.data.objectId);
                console.log("pool_address: ",poolFields["pool_address"]);
                console.log("is_closed: ",poolFields["is_closed"]);
                console.log("is_show_rewarder: ",poolFields["is_closed"]);
                console.log("project_url: ",poolFields["project_url"]);
                console.log("show_rewarder_1: ",poolFields["show_rewarder_1"]);
                console.log("show_rewarder_2: ",poolFields["show_rewarder_2"]);
                console.log("show_rewarder_3: ",poolFields["show_rewarder_3"]);

                console.log("--------------------------------------------------")
            })
        });
    });

}

readTable('0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb');