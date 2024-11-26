import { bcs, fromHex, toHex } from '@mysten/bcs';


let name = "TeoHaik";

let serializedHex = bcs.string().serialize(name).toHex();
let serializedBase64 = bcs.string().serialize(name).toBase64();
let serializedBase58 = bcs.string().serialize(name).toBase58();


console.log("\n\n");
console.log("Name  plain = ",name);
console.log("Name    Hex = ",serializedHex);
console.log("Name Base64 = ",serializedBase64);
console.log("Name Base58 = ",serializedBase58);



const namefromHex = bcs.string().fromHex(serializedHex);
const namefromBase64 = bcs.string().fromBase64(serializedBase64);
const namefromBase58 = bcs.string().fromBase58(serializedBase58);
console.log("namefromHex = ",namefromHex);

console.log("namefromBase64 = ",namefromBase64);
console.log("namefromBase58 = ",namefromBase58);


const bytesArray = bcs.bytes(4).serialize(Uint8Array.from([1, 2, 3, 4]) ).toBytes();



const intArray = bcs.fixedArray(4, bcs.u8()).serialize([1, 2, 3, 4]).toBytes();
const stringArray = bcs.fixedArray(3, bcs.string()).serialize(['a', 'b', 'c']).toBytes();


const AccData = bcs.struct("AccData", {
    id: bcs.u64(),
    name: bcs.string(),
    type: bcs.string(),
    gender: bcs.u8(),
    att_keys: bcs.vector(bcs.string()),
    att_values: bcs.vector(bcs.string()),
    url: bcs.string()
});


let serializedAccDataObject = AccData.serialize({
        id: 1,
        name: "Basic Helmet",
        type: "Helmet",
        gender: 0,
        att_keys: ["type"],
        att_values: ["belt"],
        url: "https://cdn.discordapp.com/attachments/942580584994205696/1105991970096156783/Basic_Helmet.png",
    })
    .toBytes();

const accData = AccData.parse(serializedAccDataObject);

console.log("serialized accData result = ",serializedAccDataObject);
console.log("de-serialized accData result = ",accData);

const bytes = bcs.bytes(4).serialize(Uint8Array.from([1, 2, 3, 4])).toBytes();
console.log("serialized bytes result = ",bytes);
