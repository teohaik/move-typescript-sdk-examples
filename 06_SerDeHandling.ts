import { BCS, getSuiMoveConfig } from "@mysten/bcs";


const bcs = new BCS(getSuiMoveConfig());

let name = "TeoHaik";

let serializedHex = bcs.ser('string', name).toString("hex");
let serializedBase64 = bcs.ser('string', name).toString("base64");

console.log(serializedHex);


console.log(bcs.de('string',serializedHex,"hex"));
console.log(bcs.de('string',serializedBase64,"base64"));


console.log("test = ", bcs.de('string' , 'AEZ1Fpwd1XOj+T0MOK9/RrmHyuIVKTVQct4+7IktDRWj' ,"base64"));

bcs.registerStructType("AccData", {
    id: "u64",
    name: "string",
    type: "string",
    gender: "u8",
    att_keys: "vector<string>",
    att_values: "vector<string>",
    url: "string",
});


let uint8Array = bcs
    .ser("AccData", {
        id: 1,
        name: "Basic Helmet",
        type: "Helmet",
        gender: 0,
        att_keys: ["type"],
        att_values: ["belt"],
        url: "https://cdn.discordapp.com/attachments/942580584994205696/1105991970096156783/Basic_Helmet.png",
    })
    .toBytes();


console.log("result = ",bcs.de("u64", Uint8Array.from([ 64, 66, 15, 0, 0, 0, 0, 0 ])));
