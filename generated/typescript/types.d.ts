export type Pubkey = string;
export type Signature = string;
export type Hash = string;
export type Slot = number;
export type Commitment = 'processed' | 'confirmed' | 'finalized';
export type Encoding = 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
export type TransactionEncoding = 'json' | 'jsonParsed' | 'base58' | 'base64';
export interface CommitmentConfig {
    commitment: Commitment;
    minContextSlot: number;
}
export interface GetAccountInfoConfig {
    commitment: Commitment;
    encoding: Encoding;
    dataSlice: DataSlice;
    minContextSlot: number;
}
export interface DataSlice {
    offset: number;
    length: number;
}
export interface RpcContext {
    apiVersion: string;
    slot: Slot;
}
export interface AccountInfo {
    lamports: number;
    owner: Pubkey;
    data: any;
    executable: boolean;
    rentEpoch: number;
    space: number;
}
export interface AccountInfoResponse {
    context: RpcContext;
    value: AccountInfo;
}
export interface RpcResponseU64 {
    context: RpcContext;
    value: number;
}
export interface RpcResponseBool {
    context: RpcContext;
    value: boolean;
}
export interface GetBlockConfig {
    encoding: TransactionEncoding;
    transactionDetails: 'full' | 'accounts' | 'signatures' | 'none';
    rewards: boolean;
    commitment: Commitment;
    maxSupportedTransactionVersion: number;
}
export interface Block {
    blockhash: Hash;
    previousBlockhash: Hash;
    parentSlot: Slot;
    transactions: any[];
    signatures: Array<Signature>;
    rewards: any[];
    blockTime: number;
    blockHeight: number;
}
export interface BlockCommitment {
    commitment: Array<number>;
    totalStake: number;
}
export interface GetBlockProductionConfig {
    commitment: Commitment;
    range: {
        firstSlot: Slot;
        lastSlot: Slot;
    };
    identity: Pubkey;
}
export interface BlockProduction {
    context: RpcContext;
    value: {
        byIdentity: Record<string, any>;
        range: {
            firstSlot: Slot;
            lastSlot: Slot;
        };
    };
}
export interface ClusterNode {
    pubkey: Pubkey;
    gossip: string;
    tpu: string;
    rpc: string;
    version: string;
    featureSet: number;
    shredVersion: number;
}
export interface EpochInfo {
    absoluteSlot: Slot;
    blockHeight: number;
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    transactionCount: number;
}
export interface EpochSchedule {
    slotsPerEpoch: number;
    leaderScheduleSlotOffset: number;
    warmup: boolean;
    firstNormalEpoch: number;
    firstNormalSlot: Slot;
}
export interface SnapshotSlotInfo {
    full: Slot;
    incremental: Slot;
}
export interface InflationGovernor {
    initial: number;
    terminal: number;
    taper: number;
    foundation: number;
    foundationTerm: number;
}
export interface InflationRate {
    total: number;
    validator: number;
    foundation: number;
    epoch: number;
}
export interface GetInflationRewardConfig {
    commitment: Commitment;
    epoch: number;
    minContextSlot: number;
}
export interface InflationReward {
    epoch: number;
    effectiveSlot: Slot;
    amount: number;
    postBalance: number;
    commission: number;
}
export interface GetLargestAccountsConfig {
    commitment: Commitment;
    filter: 'circulating' | 'nonCirculating';
}
export interface RpcResponseLargestAccounts {
    context: RpcContext;
    value: Array<{
        address: Pubkey;
        lamports: number;
    }>;
}
export interface LatestBlockhashResponse {
    context: RpcContext;
    value: {
        blockhash: Hash;
        lastValidBlockHeight: number;
    };
}
export interface GetLeaderScheduleConfig {
    commitment: Commitment;
    identity: Pubkey;
}
export type LeaderSchedule = Record<string, Array<number>>;
export interface MultipleAccountsResponse {
    context: RpcContext;
    value: Array<AccountInfo>;
}
export interface GetProgramAccountsConfig {
    commitment: Commitment;
    encoding: Encoding;
    dataSlice: DataSlice;
    filters: Array<AccountFilter>;
    withContext: boolean;
    minContextSlot: number;
}
export interface AccountFilter {
    memcmp: {
        offset: number;
        bytes: string;
        encoding: string;
    };
    dataSize: number;
}
export interface ProgramAccount {
    pubkey: Pubkey;
    account: AccountInfo;
}
export interface PerformanceSample {
    slot: Slot;
    numTransactions: number;
    numSlots: number;
    samplePeriodSecs: number;
    numNonVoteTransactions: number;
}
export interface PrioritizationFee {
    slot: Slot;
    prioritizationFee: number;
}
export interface GetSignatureStatusesConfig {
    searchTransactionHistory: boolean;
}
export interface SignatureStatusesResponse {
    context: RpcContext;
    value: Array<SignatureStatus>;
}
export interface SignatureStatus {
    slot: Slot;
    confirmations: number;
    err: any;
    confirmationStatus: Commitment;
}
export interface GetSignaturesForAddressConfig {
    limit: number;
    before: Signature;
    until: Signature;
    commitment: Commitment;
    minContextSlot: number;
}
export interface SignatureInfo {
    signature: Signature;
    slot: Slot;
    err: any;
    memo: string;
    blockTime: number;
    confirmationStatus: Commitment;
}
export interface GetSupplyConfig {
    commitment: Commitment;
    excludeNonCirculatingAccountsList: boolean;
}
export interface SupplyResponse {
    context: RpcContext;
    value: {
        total: number;
        circulating: number;
        nonCirculating: number;
        nonCirculatingAccounts: Array<Pubkey>;
    };
}
export interface TokenBalanceResponse {
    context: RpcContext;
    value: TokenAmount;
}
export interface TokenAmount {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
}
export interface TokenAccountsFilter {
    mint: Pubkey;
    programId: Pubkey;
}
export interface GetTokenAccountsConfig {
    commitment: Commitment;
    encoding: Encoding;
    dataSlice: DataSlice;
    minContextSlot: number;
}
export interface TokenAccountsResponse {
    context: RpcContext;
    value: Array<{
        pubkey: Pubkey;
        account: AccountInfo;
    }>;
}
export interface TokenLargestAccountsResponse {
    context: RpcContext;
    value: Array<{
        address: Pubkey;
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    }>;
}
export interface GetTransactionConfig {
    encoding: TransactionEncoding;
    commitment: Commitment;
    maxSupportedTransactionVersion: number;
}
export interface TransactionResponse {
    slot: Slot;
    transaction: any;
    blockTime: number;
    meta: TransactionMeta;
    version: any;
}
export interface TransactionMeta {
    err: any;
    fee: number;
    preBalances: Array<number>;
    postBalances: Array<number>;
    innerInstructions: any[];
    preTokenBalances: any[];
    postTokenBalances: any[];
    logMessages: Array<string>;
    rewards: any[];
    loadedAddresses: {
        writable: Array<Pubkey>;
        readonly: Array<Pubkey>;
    };
    computeUnitsConsumed: number;
}
export interface Version {
    'solana-core': string;
    'feature-set': number;
}
export interface GetVoteAccountsConfig {
    commitment: Commitment;
    votePubkey: Pubkey;
    keepUnstakedDelinquents: boolean;
    delinquentSlotDistance: number;
}
export interface VoteAccountsResponse {
    current: Array<VoteAccount>;
    delinquent: Array<VoteAccount>;
}
export interface VoteAccount {
    votePubkey: Pubkey;
    nodePubkey: Pubkey;
    activatedStake: number;
    epochVoteAccount: boolean;
    commission: number;
    lastVote: Slot;
    epochCredits: any[];
    rootSlot: Slot;
}
export interface SendTransactionConfig {
    encoding: 'base58' | 'base64';
    skipPreflight: boolean;
    preflightCommitment: Commitment;
    maxRetries: number;
    minContextSlot: number;
}
export interface SimulateTransactionConfig {
    sigVerify: boolean;
    commitment: Commitment;
    encoding: 'base58' | 'base64';
    replaceRecentBlockhash: boolean;
    accounts: {
        encoding: Encoding;
        addresses: Array<Pubkey>;
    };
    minContextSlot: number;
    innerInstructions: boolean;
}
export interface SimulateTransactionResponse {
    context: RpcContext;
    value: {
        err: any;
        logs: Array<string>;
        accounts: Array<AccountInfo>;
        unitsConsumed: number;
        returnData: {
            programId: Pubkey;
            data: any[];
        };
        innerInstructions: any[];
    };
}
//# sourceMappingURL=types.d.ts.map