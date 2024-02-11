export interface StakingRequestEvent {
    amount: string;
    epoch: number;
    pool_id: string;
    staker_address: string;
    validator_address: string;
}

export interface UnstakingRequestEvent {
    pool_id: string,
    validator_address: string,
    staker_address: string ,
    stake_activation_epoch: number,
    unstaking_epoch: number,
    principal_amount: number,
    reward_amount: number,
}

export interface PoolDepositEvent {
    amount: number,
    pool: string,
    sender: string,
}


export interface GeneralSuiObject {
    objectId: string;
    packageId: string;
    moduleName: string;
    structName: string;
    version: string;
}

export interface SuiTransactionType {
    digest: string;
    timestampMs: number;
    timestampDate?: string;
    type?: TransactionType;
    explorer?: string;
    gas?: number;
    principalAmount?: number;
    rewardsAmount?: number;
    suiPrice?: number;
    epoch?: number;
}

export interface SuiTransactionScalarData{
    epoch: number;
    balance: number;
    stakedBalance: number;
    rewardsBalance: number;
}

export enum TransactionType {
    staking = 'Staking',
    unstaking = 'Unstaking',
    receive = 'Receive',
    send = 'Send'
}


export type CoinsResponse = {
    market_data: {
        current_price: Record<string, number>;
        fully_diluted_valuation: Record<string, number>;
        market_cap: Record<string, number>;
        price_change_percentage_24h: number;
        circulating_supply: number;
        total_supply: number;
    };
};
