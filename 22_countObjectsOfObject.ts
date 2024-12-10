import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";


const suiClient = new SuiClient({
    url: getFullnodeUrl("testnet")
});

interface GetVoteNftIdProps {
    suiClient: SuiClient;
    memeNftId: string;
}


async function getVotes(suiClient, cursor, memeNftId: string) {
    return await suiClient.getOwnedObjects({
        owner: memeNftId,
        cursor,
        filter: {
            StructType: `0x6724d824513109d0ac8f3e72182e59e724becd2f935c92604686a441ceae4030::vote::Vote`,
        }
        , options: {
            showContent: true,
            showType: true
        }
    });
}

const getNFTVotes = async ({
                               suiClient,
                               memeNftId ,
                           }: GetVoteNftIdProps): Promise<number> => {

    let votesCount = 0;
    let res = await getVotes(suiClient, null, memeNftId);

    votesCount = res.data.length;

    while (res.hasNextPage) {
        res = await getVotes(suiClient, res.nextCursor, memeNftId);
        votesCount += res.data.length;
    }

    console.log("votesCount = ", votesCount);
    return votesCount;
};



getNFTVotes( {suiClient, memeNftId: "0x316bee8465ef2e956cc8aa732ca6020eb6281283f1347b147c3b4134d3d82952" });