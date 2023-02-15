import {JsonRpcProvider, Network, SuiEventEnvelope} from '@mysten/sui.js';
import {EventType} from "@mysten/sui.js/src/types/events";

const provider = new JsonRpcProvider(Network.DEVNET);

// const devNftSub = provider.subscribeEvent(
//     {
//         All: [
//             { EventType: 'MoveEvent' },
//             { Package: '0x7f0164a2585e2b66d9f2925824a8940b082ab6cf' },
//             { Module: 'capy_market' },
//         ],
//     },
//     (event: SuiEventEnvelope) => {
//       console.log("Event happened!")
//       console.log(event);
//     }
// );

//4Ha7MDipUhN9KeF3HrecN6KkFf1w2W8LXToPD9Pj4rZ5


const devNftSu2b = provider.subscribeEvent(
    {
        All: [
         //   { Module: 'capy_item' },
            { SenderAddress: '0x6367e016ee28c7c958e2f2fc7b0fd0d6cf8cfd83' },
        ],
    },
    (event: SuiEventEnvelope) => {
        console.log("frenemies Event happened!")
        console.log(event);
    }
);

// later, to unsubscribe
// calls RPC method 'sui_unsubscribeEvent' with params: [ subscriptionId ]
//const subFoundAndRemoved = await provider.unsubscribeEvent(subscriptionId);