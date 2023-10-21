import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";
import {fromB64} from '@mysten/sui.js/utils';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {SuiMoveNormalizedModules} from "@mysten/sui.js/src/client/types";
import {SuiMoveNormalizedStruct} from "@mysten/sui.js/src/client/types/generated";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});



async function doGetModulesOfPackage(packageId: string)  {

    const modules: SuiMoveNormalizedModules = await client.getNormalizedMoveModulesByPackage({
        package: packageId
    });
    console.log("Modules of Package: ", packageId);

    for (const moduleName of Object.keys(modules)) {
        console.log("--------------------------------------------------------------------------------------------");
        const aModule = modules[moduleName];
        console.log("Module = ", aModule.name);
        console.log("Module address = ", aModule.address);
        console.log("Module friends = ", aModule.friends);
        console.log("--------------------------------------------------------------------------------------------");
        console.log("Module Structs: ");
            let structs: any = aModule.structs;
            for (const structName of Object.keys(structs)) {
                const aStruct: SuiMoveNormalizedStruct = structs[structName];
                console.log("Struct = ", structName);
                console.log("   Struct fields = ", aStruct.fields);
            }
            console.log("--------------------------------------------------------------------------------------------");
        console.log("Module Functions: ");
        let functions: any = aModule.exposedFunctions;
        for (const functionName of Object.keys(functions)) {
            const aFunction: SuiMoveNormalizedStruct = functions[functionName];
            console.log("Function = ", functionName);
            console.log("   Function fields = ", aFunction.fields);
            console.log("   Function Type Params = ", aFunction.typeParameters);
            console.log("   Function Abilities = ", aFunction.abilities);
        }
    }
}

doGetModulesOfPackage("0x0a5dd18e66e274e678ab43e133460fe5a023bd8049157a5cedc5334f55bfafab");