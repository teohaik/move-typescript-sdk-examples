import {getFullnodeUrl, SuiClient, SuiParsedData} from "@mysten/sui.js/client";
import { SuiMoveObject } from "@mysten/sui.js/src/types";

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


async function getDynamicFieldsOfObject(
    objectId: string
) {

    client.getDynamicFields({
        parentId: objectId
    }).then(fields => {

        const allFields = fields.data;
        console.log("| All Fields |: ", allFields.length);

        //iterate over all fields
        allFields.forEach(field => {

            client
                .getObject({ id: field.objectId, options: { showContent: true  } })
                .then((res) => {
                    console.log("Dynamic field: ", res.data.objectId, " Fields : ");
                    if (res.data.content.dataType == "moveObject") {
                        const dynamicFieldObjectFields = res.data.content.fields; // id, name , value

                        if(typeof dynamicFieldObjectFields["name"] == "object"){  //for complex name types eg DynField Name = 0x2::kiosk::Listing
                            console.log("\t " + dynamicFieldObjectFields["name"].type + "( id: " + dynamicFieldObjectFields["name"].fields.id + " ) = "+ "`" + dynamicFieldObjectFields["value"] + "`");
                        }
                        else  //for simple names (eg: string)
                        {
                            console.log("\t " + dynamicFieldObjectFields["name"] + ": `" + dynamicFieldObjectFields["value"] + "`");
                        }
                    }
                });
        });
    });
}

getDynamicFieldsOfObject("0x24c0247fb22457a719efac7f670cdc79be321b521460bd6bd2ccfa9f80713b14");


readTable('0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb');