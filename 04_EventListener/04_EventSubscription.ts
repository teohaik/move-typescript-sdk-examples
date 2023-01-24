import { JsonRpcProvider, SuiEventEnvelope } from '@mysten/sui.js';
const provider = new JsonRpcProvider();


  //for(let i=0; i<100; i++){
  // calls RPC method 'sui_subscribeEvent' with params:
  // [ { SenderAddress: '0xbff6ccc8707aa517b4f1b95750a2a8c666012df3' } ]
  const subscriptionId = provider.subscribeEvent(
    { SenderAddress: '0xf2fd5d109a159329c96307f1ad57ac3d6017fd95' },
    (event: SuiEventEnvelope) => {
      console.log("Event happened! "+event);
      
      // handle subscription notification message here. This function is called once per subscription message.
    }
  );
  console.log ("Block statement execution no.");
 // }


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
// later, to unsubscribe
// calls RPC method 'sui_unsubscribeEvent' with params: [ subscriptionId ]
//const subFoundAndRemoved = await provider.unsubscribeEvent(subscriptionId);