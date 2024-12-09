import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";


const suiClient = new SuiClient({
    url: getFullnodeUrl("testnet")
});

interface GetVoteNftIdProps {
    suiClient: SuiClient;
    address: string;
}


const getNFTVotes = ({
                               suiClient,
                               address,
                           }: GetVoteNftIdProps): Promise<number> => {
    return suiClient
        .getOwnedObjects({
            owner: address,
            filter: {
                StructType: `0x6724d824513109d0ac8f3e72182e59e724becd2f935c92604686a441ceae4030::vote::Vote`,
            }
            ,options:{
                showContent: true,
                showType: true
            }
        })
        .then((res) => {
            const objects = res?.data || [];
            return objects.length;
        })
        .catch((err) => {
            console.error(`Error fetching votes for address ${address}:`, err);
            return 0; // Returning 0 votes if there is an error
        });
};

getNFTVotes( {suiClient, address: "0x316bee8465ef2e956cc8aa732ca6020eb6281283f1347b147c3b4134d3d82952" });