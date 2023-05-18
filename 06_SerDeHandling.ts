import { BCS, getSuiMoveConfig } from "@mysten/bcs";


const bcs = new BCS(getSuiMoveConfig());

let name = "TeoHaik";

let serializedHex = bcs.ser('string', name).toString("hex");
let serializedBase64 = bcs.ser('string', name).toString("base64");

console.log(serializedHex);


console.log(bcs.de('string',serializedHex,"hex"));
console.log(bcs.de('string',serializedBase64,"base64"));


console.log("test = ", bcs.de('string' , 'AEZ1Fpwd1XOj+T0MOK9/RrmHyuIVKTVQct4+7IktDRWj' ,"base64"));



