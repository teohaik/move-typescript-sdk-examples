import {Connection, JsonRpcProvider, SuiEvent} from "@mysten/sui.js";
import {MoveEventField} from "@mysten/sui.js/src/types/events";

const connOptions = new Connection({
    fullnode: 'https://rpc.mainnet.sui.io:443',
});

let provider = new JsonRpcProvider(connOptions);

const demoSubscriber = provider.subscribeEvent({
    filter: {
        MoveEventType: "0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::SuiFrenMinted"
    },
    onMessage(event: SuiEvent) {
        console.log("Event Happened! = ", event);
    },
}).then(SubscriptionId => {
    console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
        " \nSubscriptionId = ", SubscriptionId);
});


const packageFiltering = provider.subscribeEvent({
    filter: {
        Package: "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1"
    },
    onMessage(event: SuiEvent) {
        console.log("Suifrens Event Happened! = ", event);
    },
}).then(SubscriptionId => {
    console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
        " \nSubscriptionId = ", SubscriptionId);
});

const moveModuleFiltering = provider.subscribeEvent({
    filter: {
        MoveModule:
            { package: "0x00b53b0f4174108627fbee72e2498b58d6a2714cded53fac537034c220d26302",
                module: "pyth"
            }
    },
    onMessage(event: SuiEvent) {
        console.log("pyth Event Happened! = ", event);
    },
}).then(SubscriptionId => {
    console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
        " \nSubscriptionId = ", SubscriptionId);
});


const moveEventFieldFiltering = provider.subscribeEvent({
    filter: {
        MoveEventField:
            { path: "/transactionModule",
                value: "capy_labs"
            }
    },
    onMessage(event: SuiEvent) {
        console.log("moveEventFieldFiltering Event Happened! = ", event);
    },
}).then(SubscriptionId => {
    console.log("Subscriber subscribed. Listening to ", connOptions.fullnode,
        " \nSubscriptionId = ", SubscriptionId);
});
