// Auto-generated Solana RPC Client
// Solana JSON-RPC API v2.0.0
// Solana JSON-RPC API specification for interacting with Solana nodes
export class SolanaRpcError extends Error {
    code;
    data;
    constructor(code, message, data) {
        super(message);
        this.name = 'SolanaRpcError';
        this.code = code;
        this.data = data;
    }
}
export const ENDPOINTS = {
    MAINNET_BETA: 'https://api.mainnet-beta.solana.com',
    DEVNET: 'https://api.devnet.solana.com',
    TESTNET: 'https://api.testnet.solana.com',
};
export class SolanaRpcClient {
    endpoint;
    headers;
    fetchFn;
    requestId = 0;
    constructor(config) {
        this.endpoint = config.endpoint;
        this.headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
        this.fetchFn = config.fetch ?? globalThis.fetch;
    }
    async call(method, params) {
        const id = ++this.requestId;
        const body = JSON.stringify({
            jsonrpc: '2.0',
            id,
            method,
            params,
        });
        const response = await this.fetchFn(this.endpoint, {
            method: 'POST',
            headers: this.headers,
            body,
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const json = await response.json();
        if (json.error) {
            throw new SolanaRpcError(json.error.code, json.error.message, json.error.data);
        }
        return json.result;
    }
    /**
     * Returns all information associated with the account of provided Pubkey
     * @param pubkey Pubkey of account to query, as base-58 encoded string
     * @param config
     */
    async getAccountInfo(pubkey, config) {
        const params = [];
        params.push(pubkey);
        if (config !== undefined)
            params.push(config);
        return this.call('getAccountInfo', params);
    }
    /**
     * Returns the lamport balance of the account of provided Pubkey
     * @param pubkey
     * @param config
     */
    async getBalance(pubkey, config) {
        const params = [];
        params.push(pubkey);
        if (config !== undefined)
            params.push(config);
        return this.call('getBalance', params);
    }
    /**
     * Returns identity and transaction information about a confirmed block in the ledger
     * @param slot
     * @param config
     */
    async getBlock(slot, config) {
        const params = [];
        params.push(slot);
        if (config !== undefined)
            params.push(config);
        return this.call('getBlock', params);
    }
    /**
     * Returns commitment for particular block
     * @param slot
     */
    async getBlockCommitment(slot) {
        const params = [];
        params.push(slot);
        return this.call('getBlockCommitment', params);
    }
    /**
     * Returns the current block height of the node
     * @param config
     */
    async getBlockHeight(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getBlockHeight', params);
    }
    /**
     * Returns recent block production information from the current or previous epoch
     * @param config
     */
    async getBlockProduction(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getBlockProduction', params);
    }
    /**
     * Returns the estimated production time of a block
     * @param slot
     */
    async getBlockTime(slot) {
        const params = [];
        params.push(slot);
        return this.call('getBlockTime', params);
    }
    /**
     * Returns a list of confirmed blocks between two slots
     * @param startSlot
     * @param endSlot
     * @param config
     */
    async getBlocks(startSlot, endSlot, config) {
        const params = [];
        params.push(startSlot);
        if (endSlot !== undefined)
            params.push(endSlot);
        if (config !== undefined)
            params.push(config);
        return this.call('getBlocks', params);
    }
    /**
     * Returns a list of confirmed blocks starting at the given slot
     * @param startSlot
     * @param limit
     * @param config
     */
    async getBlocksWithLimit(startSlot, limit, config) {
        const params = [];
        params.push(startSlot);
        params.push(limit);
        if (config !== undefined)
            params.push(config);
        return this.call('getBlocksWithLimit', params);
    }
    /**
     * Returns information about all the nodes participating in the cluster
     */
    async getClusterNodes() {
        const params = [];
        return this.call('getClusterNodes', params);
    }
    /**
     * Returns information about the current epoch
     * @param config
     */
    async getEpochInfo(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getEpochInfo', params);
    }
    /**
     * Returns the epoch schedule information from this cluster's genesis config
     */
    async getEpochSchedule() {
        const params = [];
        return this.call('getEpochSchedule', params);
    }
    /**
     * Returns the fee the network will charge for a particular message
     * @param message
     * @param config
     */
    async getFeeForMessage(message, config) {
        const params = [];
        params.push(message);
        if (config !== undefined)
            params.push(config);
        return this.call('getFeeForMessage', params);
    }
    /**
     * Returns the slot of the lowest confirmed block that has not been purged from the ledger
     */
    async getFirstAvailableBlock() {
        const params = [];
        return this.call('getFirstAvailableBlock', params);
    }
    /**
     * Returns the genesis hash
     */
    async getGenesisHash() {
        const params = [];
        return this.call('getGenesisHash', params);
    }
    /**
     * Returns the current health of the node
     */
    async getHealth() {
        const params = [];
        return this.call('getHealth', params);
    }
    /**
     * Returns the highest slot information that the node has snapshots for
     */
    async getHighestSnapshotSlot() {
        const params = [];
        return this.call('getHighestSnapshotSlot', params);
    }
    /**
     * Returns the identity pubkey for the current node
     */
    async getIdentity() {
        const params = [];
        return this.call('getIdentity', params);
    }
    /**
     * Returns the current inflation governor
     * @param config
     */
    async getInflationGovernor(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getInflationGovernor', params);
    }
    /**
     * Returns the specific inflation values for the current epoch
     */
    async getInflationRate() {
        const params = [];
        return this.call('getInflationRate', params);
    }
    /**
     * Returns the inflation / staking reward for a list of addresses for an epoch
     * @param addresses
     * @param config
     */
    async getInflationReward(addresses, config) {
        const params = [];
        params.push(addresses);
        if (config !== undefined)
            params.push(config);
        return this.call('getInflationReward', params);
    }
    /**
     * Returns the 20 largest accounts, by lamport balance
     * @param config
     */
    async getLargestAccounts(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getLargestAccounts', params);
    }
    /**
     * Returns the latest blockhash
     * @param config
     */
    async getLatestBlockhash(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getLatestBlockhash', params);
    }
    /**
     * Returns the leader schedule for an epoch
     * @param slot
     * @param config
     */
    async getLeaderSchedule(slot, config) {
        const params = [];
        if (slot !== undefined)
            params.push(slot);
        if (config !== undefined)
            params.push(config);
        return this.call('getLeaderSchedule', params);
    }
    /**
     * Get the max slot seen from retransmit stage
     */
    async getMaxRetransmitSlot() {
        const params = [];
        return this.call('getMaxRetransmitSlot', params);
    }
    /**
     * Get the max slot seen from after shred insert
     */
    async getMaxShredInsertSlot() {
        const params = [];
        return this.call('getMaxShredInsertSlot', params);
    }
    /**
     * Returns minimum balance required to make account rent exempt
     * @param dataLength
     * @param config
     */
    async getMinimumBalanceForRentExemption(dataLength, config) {
        const params = [];
        params.push(dataLength);
        if (config !== undefined)
            params.push(config);
        return this.call('getMinimumBalanceForRentExemption', params);
    }
    /**
     * Returns the account information for a list of Pubkeys
     * @param pubkeys
     * @param config
     */
    async getMultipleAccounts(pubkeys, config) {
        const params = [];
        params.push(pubkeys);
        if (config !== undefined)
            params.push(config);
        return this.call('getMultipleAccounts', params);
    }
    /**
     * Returns all accounts owned by the provided program Pubkey
     * @param programId
     * @param config
     */
    async getProgramAccounts(programId, config) {
        const params = [];
        params.push(programId);
        if (config !== undefined)
            params.push(config);
        return this.call('getProgramAccounts', params);
    }
    /**
     * Returns a list of recent performance samples
     * @param limit
     */
    async getRecentPerformanceSamples(limit) {
        const params = [];
        if (limit !== undefined)
            params.push(limit);
        return this.call('getRecentPerformanceSamples', params);
    }
    /**
     * Returns a list of prioritization fees from recent blocks
     * @param addresses
     */
    async getRecentPrioritizationFees(addresses) {
        const params = [];
        if (addresses !== undefined)
            params.push(addresses);
        return this.call('getRecentPrioritizationFees', params);
    }
    /**
     * Returns the statuses of a list of signatures
     * @param signatures
     * @param config
     */
    async getSignatureStatuses(signatures, config) {
        const params = [];
        params.push(signatures);
        if (config !== undefined)
            params.push(config);
        return this.call('getSignatureStatuses', params);
    }
    /**
     * Returns signatures for confirmed transactions that include the given address
     * @param address
     * @param config
     */
    async getSignaturesForAddress(address, config) {
        const params = [];
        params.push(address);
        if (config !== undefined)
            params.push(config);
        return this.call('getSignaturesForAddress', params);
    }
    /**
     * Returns the slot that has reached the given or default commitment level
     * @param config
     */
    async getSlot(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getSlot', params);
    }
    /**
     * Returns the current slot leader
     * @param config
     */
    async getSlotLeader(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getSlotLeader', params);
    }
    /**
     * Returns the slot leaders for a given slot range
     * @param startSlot
     * @param limit
     */
    async getSlotLeaders(startSlot, limit) {
        const params = [];
        params.push(startSlot);
        params.push(limit);
        return this.call('getSlotLeaders', params);
    }
    /**
     * Returns the stake minimum delegation, in lamports
     * @param config
     */
    async getStakeMinimumDelegation(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getStakeMinimumDelegation', params);
    }
    /**
     * Returns information about the current supply
     * @param config
     */
    async getSupply(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getSupply', params);
    }
    /**
     * Returns the token balance of an SPL Token account
     * @param pubkey
     * @param config
     */
    async getTokenAccountBalance(pubkey, config) {
        const params = [];
        params.push(pubkey);
        if (config !== undefined)
            params.push(config);
        return this.call('getTokenAccountBalance', params);
    }
    /**
     * Returns all SPL Token accounts by approved Delegate
     * @param delegate
     * @param filter
     * @param config
     */
    async getTokenAccountsByDelegate(delegate, filter, config) {
        const params = [];
        params.push(delegate);
        params.push(filter);
        if (config !== undefined)
            params.push(config);
        return this.call('getTokenAccountsByDelegate', params);
    }
    /**
     * Returns all SPL Token accounts by token owner
     * @param owner
     * @param filter
     * @param config
     */
    async getTokenAccountsByOwner(owner, filter, config) {
        const params = [];
        params.push(owner);
        params.push(filter);
        if (config !== undefined)
            params.push(config);
        return this.call('getTokenAccountsByOwner', params);
    }
    /**
     * Returns the 20 largest accounts of a particular SPL Token type
     * @param mint
     * @param config
     */
    async getTokenLargestAccounts(mint, config) {
        const params = [];
        params.push(mint);
        if (config !== undefined)
            params.push(config);
        return this.call('getTokenLargestAccounts', params);
    }
    /**
     * Returns the total supply of an SPL Token type
     * @param mint
     * @param config
     */
    async getTokenSupply(mint, config) {
        const params = [];
        params.push(mint);
        if (config !== undefined)
            params.push(config);
        return this.call('getTokenSupply', params);
    }
    /**
     * Returns transaction details for a confirmed transaction
     * @param signature
     * @param config
     */
    async getTransaction(signature, config) {
        const params = [];
        params.push(signature);
        if (config !== undefined)
            params.push(config);
        return this.call('getTransaction', params);
    }
    /**
     * Returns the current Transaction count from the ledger
     * @param config
     */
    async getTransactionCount(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getTransactionCount', params);
    }
    /**
     * Returns the current Solana version running on the node
     */
    async getVersion() {
        const params = [];
        return this.call('getVersion', params);
    }
    /**
     * Returns the account info and associated stake for all the voting accounts in the current bank
     * @param config
     */
    async getVoteAccounts(config) {
        const params = [];
        if (config !== undefined)
            params.push(config);
        return this.call('getVoteAccounts', params);
    }
    /**
     * Returns whether a blockhash is still valid or not
     * @param blockhash
     * @param config
     */
    async isBlockhashValid(blockhash, config) {
        const params = [];
        params.push(blockhash);
        if (config !== undefined)
            params.push(config);
        return this.call('isBlockhashValid', params);
    }
    /**
     * Returns the lowest slot that the node has information about in its ledger
     */
    async minimumLedgerSlot() {
        const params = [];
        return this.call('minimumLedgerSlot', params);
    }
    /**
     * Requests an airdrop of lamports to a Pubkey
     * @param pubkey
     * @param lamports
     * @param config
     */
    async requestAirdrop(pubkey, lamports, config) {
        const params = [];
        params.push(pubkey);
        params.push(lamports);
        if (config !== undefined)
            params.push(config);
        return this.call('requestAirdrop', params);
    }
    /**
     * Submits a signed transaction to the cluster for processing
     * @param transaction
     * @param config
     */
    async sendTransaction(transaction, config) {
        const params = [];
        params.push(transaction);
        if (config !== undefined)
            params.push(config);
        return this.call('sendTransaction', params);
    }
    /**
     * Simulate sending a transaction
     * @param transaction
     * @param config
     */
    async simulateTransaction(transaction, config) {
        const params = [];
        params.push(transaction);
        if (config !== undefined)
            params.push(config);
        return this.call('simulateTransaction', params);
    }
}
export function createSolanaRpcClient(endpoint = ENDPOINTS.MAINNET_BETA) {
    return new SolanaRpcClient({ endpoint });
}
//# sourceMappingURL=client.js.map