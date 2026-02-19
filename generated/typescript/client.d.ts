import * as types from './types.js';
export declare class SolanaRpcError extends Error {
    code: number;
    data?: any;
    constructor(code: number, message: string, data?: any);
}
export interface SolanaRpcClientConfig {
    endpoint: string;
    headers?: Record<string, string>;
    fetch?: typeof fetch;
}
export declare const ENDPOINTS: {
    readonly MAINNET_BETA: "https://api.mainnet-beta.solana.com";
    readonly DEVNET: "https://api.devnet.solana.com";
    readonly TESTNET: "https://api.testnet.solana.com";
};
export declare class SolanaRpcClient {
    private endpoint;
    private headers;
    private fetchFn;
    private requestId;
    constructor(config: SolanaRpcClientConfig);
    private call;
    /**
     * Returns all information associated with the account of provided Pubkey
     * @param pubkey Pubkey of account to query, as base-58 encoded string
     * @param config
     */
    getAccountInfo(pubkey: types.Pubkey, config?: types.GetAccountInfoConfig): Promise<types.AccountInfoResponse>;
    /**
     * Returns the lamport balance of the account of provided Pubkey
     * @param pubkey
     * @param config
     */
    getBalance(pubkey: types.Pubkey, config?: types.CommitmentConfig): Promise<types.RpcResponseU64>;
    /**
     * Returns identity and transaction information about a confirmed block in the ledger
     * @param slot
     * @param config
     */
    getBlock(slot: types.Slot, config?: types.GetBlockConfig): Promise<types.Block>;
    /**
     * Returns commitment for particular block
     * @param slot
     */
    getBlockCommitment(slot: types.Slot): Promise<types.BlockCommitment>;
    /**
     * Returns the current block height of the node
     * @param config
     */
    getBlockHeight(config?: types.CommitmentConfig): Promise<number>;
    /**
     * Returns recent block production information from the current or previous epoch
     * @param config
     */
    getBlockProduction(config?: types.GetBlockProductionConfig): Promise<types.BlockProduction>;
    /**
     * Returns the estimated production time of a block
     * @param slot
     */
    getBlockTime(slot: types.Slot): Promise<number>;
    /**
     * Returns a list of confirmed blocks between two slots
     * @param startSlot
     * @param endSlot
     * @param config
     */
    getBlocks(startSlot: types.Slot, endSlot?: types.Slot, config?: types.CommitmentConfig): Promise<Array<types.Slot>>;
    /**
     * Returns a list of confirmed blocks starting at the given slot
     * @param startSlot
     * @param limit
     * @param config
     */
    getBlocksWithLimit(startSlot: types.Slot, limit: number, config?: types.CommitmentConfig): Promise<Array<types.Slot>>;
    /**
     * Returns information about all the nodes participating in the cluster
     */
    getClusterNodes(): Promise<Array<types.ClusterNode>>;
    /**
     * Returns information about the current epoch
     * @param config
     */
    getEpochInfo(config?: types.CommitmentConfig): Promise<types.EpochInfo>;
    /**
     * Returns the epoch schedule information from this cluster's genesis config
     */
    getEpochSchedule(): Promise<types.EpochSchedule>;
    /**
     * Returns the fee the network will charge for a particular message
     * @param message
     * @param config
     */
    getFeeForMessage(message: string, config?: types.CommitmentConfig): Promise<types.RpcResponseU64>;
    /**
     * Returns the slot of the lowest confirmed block that has not been purged from the ledger
     */
    getFirstAvailableBlock(): Promise<types.Slot>;
    /**
     * Returns the genesis hash
     */
    getGenesisHash(): Promise<types.Hash>;
    /**
     * Returns the current health of the node
     */
    getHealth(): Promise<'ok' | 'behind' | 'unknown'>;
    /**
     * Returns the highest slot information that the node has snapshots for
     */
    getHighestSnapshotSlot(): Promise<types.SnapshotSlotInfo>;
    /**
     * Returns the identity pubkey for the current node
     */
    getIdentity(): Promise<{
        identity: types.Pubkey;
    }>;
    /**
     * Returns the current inflation governor
     * @param config
     */
    getInflationGovernor(config?: types.CommitmentConfig): Promise<types.InflationGovernor>;
    /**
     * Returns the specific inflation values for the current epoch
     */
    getInflationRate(): Promise<types.InflationRate>;
    /**
     * Returns the inflation / staking reward for a list of addresses for an epoch
     * @param addresses
     * @param config
     */
    getInflationReward(addresses: Array<types.Pubkey>, config?: types.GetInflationRewardConfig): Promise<Array<types.InflationReward>>;
    /**
     * Returns the 20 largest accounts, by lamport balance
     * @param config
     */
    getLargestAccounts(config?: types.GetLargestAccountsConfig): Promise<types.RpcResponseLargestAccounts>;
    /**
     * Returns the latest blockhash
     * @param config
     */
    getLatestBlockhash(config?: types.CommitmentConfig): Promise<types.LatestBlockhashResponse>;
    /**
     * Returns the leader schedule for an epoch
     * @param slot
     * @param config
     */
    getLeaderSchedule(slot?: types.Slot, config?: types.GetLeaderScheduleConfig): Promise<types.LeaderSchedule>;
    /**
     * Get the max slot seen from retransmit stage
     */
    getMaxRetransmitSlot(): Promise<types.Slot>;
    /**
     * Get the max slot seen from after shred insert
     */
    getMaxShredInsertSlot(): Promise<types.Slot>;
    /**
     * Returns minimum balance required to make account rent exempt
     * @param dataLength
     * @param config
     */
    getMinimumBalanceForRentExemption(dataLength: number, config?: types.CommitmentConfig): Promise<number>;
    /**
     * Returns the account information for a list of Pubkeys
     * @param pubkeys
     * @param config
     */
    getMultipleAccounts(pubkeys: Array<types.Pubkey>, config?: types.GetAccountInfoConfig): Promise<types.MultipleAccountsResponse>;
    /**
     * Returns all accounts owned by the provided program Pubkey
     * @param programId
     * @param config
     */
    getProgramAccounts(programId: types.Pubkey, config?: types.GetProgramAccountsConfig): Promise<Array<types.ProgramAccount>>;
    /**
     * Returns a list of recent performance samples
     * @param limit
     */
    getRecentPerformanceSamples(limit?: number): Promise<Array<types.PerformanceSample>>;
    /**
     * Returns a list of prioritization fees from recent blocks
     * @param addresses
     */
    getRecentPrioritizationFees(addresses?: Array<types.Pubkey>): Promise<Array<types.PrioritizationFee>>;
    /**
     * Returns the statuses of a list of signatures
     * @param signatures
     * @param config
     */
    getSignatureStatuses(signatures: Array<types.Signature>, config?: types.GetSignatureStatusesConfig): Promise<types.SignatureStatusesResponse>;
    /**
     * Returns signatures for confirmed transactions that include the given address
     * @param address
     * @param config
     */
    getSignaturesForAddress(address: types.Pubkey, config?: types.GetSignaturesForAddressConfig): Promise<Array<types.SignatureInfo>>;
    /**
     * Returns the slot that has reached the given or default commitment level
     * @param config
     */
    getSlot(config?: types.CommitmentConfig): Promise<types.Slot>;
    /**
     * Returns the current slot leader
     * @param config
     */
    getSlotLeader(config?: types.CommitmentConfig): Promise<types.Pubkey>;
    /**
     * Returns the slot leaders for a given slot range
     * @param startSlot
     * @param limit
     */
    getSlotLeaders(startSlot: types.Slot, limit: number): Promise<Array<types.Pubkey>>;
    /**
     * Returns the stake minimum delegation, in lamports
     * @param config
     */
    getStakeMinimumDelegation(config?: types.CommitmentConfig): Promise<types.RpcResponseU64>;
    /**
     * Returns information about the current supply
     * @param config
     */
    getSupply(config?: types.GetSupplyConfig): Promise<types.SupplyResponse>;
    /**
     * Returns the token balance of an SPL Token account
     * @param pubkey
     * @param config
     */
    getTokenAccountBalance(pubkey: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenBalanceResponse>;
    /**
     * Returns all SPL Token accounts by approved Delegate
     * @param delegate
     * @param filter
     * @param config
     */
    getTokenAccountsByDelegate(delegate: types.Pubkey, filter: types.TokenAccountsFilter, config?: types.GetTokenAccountsConfig): Promise<types.TokenAccountsResponse>;
    /**
     * Returns all SPL Token accounts by token owner
     * @param owner
     * @param filter
     * @param config
     */
    getTokenAccountsByOwner(owner: types.Pubkey, filter: types.TokenAccountsFilter, config?: types.GetTokenAccountsConfig): Promise<types.TokenAccountsResponse>;
    /**
     * Returns the 20 largest accounts of a particular SPL Token type
     * @param mint
     * @param config
     */
    getTokenLargestAccounts(mint: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenLargestAccountsResponse>;
    /**
     * Returns the total supply of an SPL Token type
     * @param mint
     * @param config
     */
    getTokenSupply(mint: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenBalanceResponse>;
    /**
     * Returns transaction details for a confirmed transaction
     * @param signature
     * @param config
     */
    getTransaction(signature: types.Signature, config?: types.GetTransactionConfig): Promise<types.TransactionResponse>;
    /**
     * Returns the current Transaction count from the ledger
     * @param config
     */
    getTransactionCount(config?: types.CommitmentConfig): Promise<number>;
    /**
     * Returns the current Solana version running on the node
     */
    getVersion(): Promise<types.Version>;
    /**
     * Returns the account info and associated stake for all the voting accounts in the current bank
     * @param config
     */
    getVoteAccounts(config?: types.GetVoteAccountsConfig): Promise<types.VoteAccountsResponse>;
    /**
     * Returns whether a blockhash is still valid or not
     * @param blockhash
     * @param config
     */
    isBlockhashValid(blockhash: types.Hash, config?: types.CommitmentConfig): Promise<types.RpcResponseBool>;
    /**
     * Returns the lowest slot that the node has information about in its ledger
     */
    minimumLedgerSlot(): Promise<types.Slot>;
    /**
     * Requests an airdrop of lamports to a Pubkey
     * @param pubkey
     * @param lamports
     * @param config
     */
    requestAirdrop(pubkey: types.Pubkey, lamports: number, config?: types.CommitmentConfig): Promise<types.Signature>;
    /**
     * Submits a signed transaction to the cluster for processing
     * @param transaction
     * @param config
     */
    sendTransaction(transaction: string, config?: types.SendTransactionConfig): Promise<types.Signature>;
    /**
     * Simulate sending a transaction
     * @param transaction
     * @param config
     */
    simulateTransaction(transaction: string, config?: types.SimulateTransactionConfig): Promise<types.SimulateTransactionResponse>;
}
export declare function createSolanaRpcClient(endpoint?: string): SolanaRpcClient;
//# sourceMappingURL=client.d.ts.map