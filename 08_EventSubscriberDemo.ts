import {Connection, JsonRpcProvider, SuiEvent} from "@mysten/sui.js";

const connOptions = new Connection({
    fullnode: 'https://suifrens-rpc.testnet.sui.io:443',
});

let provider = new JsonRpcProvider(connOptions);

const demoSubscriber = provider.subscribeEvent({
    filter: {
        MoveEventType: "0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::SuiFrenMinted"
    },
    onMessage(event: SuiEvent) {
        console.log("Event Happened! = ",event);
    },
}).then(SubscriptionId=>{
    console.log("Subscriber subscribed. Listening to ",connOptions.fullnode,
        " \nSubscriptionId = ", SubscriptionId);
});

