import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

import {SuiEvent} from "@mysten/sui.js/src/types/events";

const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
});

const pythFilterMainnet = {
    MoveEventType: "0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::suifrens::SuiFrenMinted2"
};

const listenToEvents = async () => {
    const devNftSub = await client.subscribeEvent({
        filter: pythFilterMainnet,
        onMessage(event : SuiEvent) {
            console.log("Event Happened! = ", event);
        },
    });
};

listenToEvents();


//
// const packageFiltering = provider.subscribeEvent({
//     filter: {
//         Package: "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1"
//     },
//     onMessage(event: SuiEvent) {
//         console.log("Suifrens Event Happened! = ", event);
//     },
// }).then(SubscriptionId => {
//     console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
//         " \nSubscriptionId = ", SubscriptionId);
// });
//
// const moveModuleFiltering = provider.subscribeEvent({
//     filter: {
//         MoveModule:
//             { package: "0x00b53b0f4174108627fbee72e2498b58d6a2714cded53fac537034c220d26302",
//                 module: "pyth"
//             }
//     },
//     onMessage(event: SuiEvent) {
//         console.log("pyth Event Happened! = ", event);
//     },
// }).then(SubscriptionId => {
//     console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
//         " \nSubscriptionId = ", SubscriptionId);
// });
//
//
// const moveEventFieldFiltering = provider.subscribeEvent({
//     filter: {
//         MoveEventField:
//             { path: "/transactionModule",
//                 value: "capy_labs"
//             }
//     },
//     onMessage(event: SuiEvent) {
//         console.log("moveEventFieldFiltering Event Happened! = ", event);
//     },
// }).then(SubscriptionId => {
//     console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
//         " \nSubscriptionId = ", SubscriptionId);
// });
