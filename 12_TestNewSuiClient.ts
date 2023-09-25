/**
 * Retrieves all Objects owned by a given address
 */
import {getFullnodeUrl, SuiClient} from "@mysten/sui.js/client";

const ADMIN_ADDRESS="0x7bfe53744b0cef3ec21da0ad284b91f4cd64fa933ba8e0b75a5f263c8543427e";

const run = async () => {

    const client = new SuiClient({url: "https://explorer-rpc.devnet.sui.io/"});
    const coins = await client.getCoins({owner: ADMIN_ADDRESS});
    console.log(coins);

    let currentEpoch = await client.getCurrentEpoch();

    console.log("Current Epoch: ", currentEpoch)
};

run();