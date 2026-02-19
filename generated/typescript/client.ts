// Auto-generated Solana RPC Client
// Solana JSON-RPC API v2.0.0
// Solana JSON-RPC API specification for interacting with Solana nodes

import * as types from './types.js';

export class SolanaRpcError extends Error {
  code: number;
  data?: any;

  constructor(code: number, message: string, data?: any) {
    super(message);
    this.name = 'SolanaRpcError';
    this.code = code;
    this.data = data;
  }
}

export interface SolanaRpcClientConfig {
  endpoint: string;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export const ENDPOINTS = {
  MAINNET_BETA: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
} as const;

export class SolanaRpcClient {
  private endpoint: string;
  private headers: Record<string, string>;
  private fetchFn: typeof fetch;
  private requestId = 0;

  constructor(config: SolanaRpcClientConfig) {
    this.endpoint = config.endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.fetchFn = config.fetch ?? globalThis.fetch;
  }

  private async call<T>(method: string, params: any[]): Promise<T> {
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

    return json.result as T;
  }

  /**
   * Returns all information associated with the account of provided Pubkey
   * @param pubkey Pubkey of account to query, as base-58 encoded string
   * @param config 
   */
  async getAccountInfo(pubkey: types.Pubkey, config?: types.GetAccountInfoConfig): Promise<types.AccountInfoResponse> {
    const params: any[] = [];
    params.push(pubkey);
    if (config !== undefined) params.push(config);
    return this.call<types.AccountInfoResponse>('getAccountInfo', params);
  }

  /**
   * Returns the lamport balance of the account of provided Pubkey
   * @param pubkey 
   * @param config 
   */
  async getBalance(pubkey: types.Pubkey, config?: types.CommitmentConfig): Promise<types.RpcResponseU64> {
    const params: any[] = [];
    params.push(pubkey);
    if (config !== undefined) params.push(config);
    return this.call<types.RpcResponseU64>('getBalance', params);
  }

  /**
   * Returns identity and transaction information about a confirmed block in the ledger
   * @param slot 
   * @param config 
   */
  async getBlock(slot: types.Slot, config?: types.GetBlockConfig): Promise<types.Block> {
    const params: any[] = [];
    params.push(slot);
    if (config !== undefined) params.push(config);
    return this.call<types.Block>('getBlock', params);
  }

  /**
   * Returns commitment for particular block
   * @param slot 
   */
  async getBlockCommitment(slot: types.Slot): Promise<types.BlockCommitment> {
    const params: any[] = [];
    params.push(slot);
    return this.call<types.BlockCommitment>('getBlockCommitment', params);
  }

  /**
   * Returns the current block height of the node
   * @param config 
   */
  async getBlockHeight(config?: types.CommitmentConfig): Promise<number> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<number>('getBlockHeight', params);
  }

  /**
   * Returns recent block production information from the current or previous epoch
   * @param config 
   */
  async getBlockProduction(config?: types.GetBlockProductionConfig): Promise<types.BlockProduction> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.BlockProduction>('getBlockProduction', params);
  }

  /**
   * Returns the estimated production time of a block
   * @param slot 
   */
  async getBlockTime(slot: types.Slot): Promise<number> {
    const params: any[] = [];
    params.push(slot);
    return this.call<number>('getBlockTime', params);
  }

  /**
   * Returns a list of confirmed blocks between two slots
   * @param startSlot 
   * @param endSlot 
   * @param config 
   */
  async getBlocks(startSlot: types.Slot, endSlot?: types.Slot, config?: types.CommitmentConfig): Promise<Array<types.Slot>> {
    const params: any[] = [];
    params.push(startSlot);
    if (endSlot !== undefined) params.push(endSlot);
    if (config !== undefined) params.push(config);
    return this.call<Array<types.Slot>>('getBlocks', params);
  }

  /**
   * Returns a list of confirmed blocks starting at the given slot
   * @param startSlot 
   * @param limit 
   * @param config 
   */
  async getBlocksWithLimit(startSlot: types.Slot, limit: number, config?: types.CommitmentConfig): Promise<Array<types.Slot>> {
    const params: any[] = [];
    params.push(startSlot);
    params.push(limit);
    if (config !== undefined) params.push(config);
    return this.call<Array<types.Slot>>('getBlocksWithLimit', params);
  }

  /**
   * Returns information about all the nodes participating in the cluster
   */
  async getClusterNodes(): Promise<Array<types.ClusterNode>> {
    const params: any[] = [];
    return this.call<Array<types.ClusterNode>>('getClusterNodes', params);
  }

  /**
   * Returns information about the current epoch
   * @param config 
   */
  async getEpochInfo(config?: types.CommitmentConfig): Promise<types.EpochInfo> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.EpochInfo>('getEpochInfo', params);
  }

  /**
   * Returns the epoch schedule information from this cluster's genesis config
   */
  async getEpochSchedule(): Promise<types.EpochSchedule> {
    const params: any[] = [];
    return this.call<types.EpochSchedule>('getEpochSchedule', params);
  }

  /**
   * Returns the fee the network will charge for a particular message
   * @param message 
   * @param config 
   */
  async getFeeForMessage(message: string, config?: types.CommitmentConfig): Promise<types.RpcResponseU64> {
    const params: any[] = [];
    params.push(message);
    if (config !== undefined) params.push(config);
    return this.call<types.RpcResponseU64>('getFeeForMessage', params);
  }

  /**
   * Returns the slot of the lowest confirmed block that has not been purged from the ledger
   */
  async getFirstAvailableBlock(): Promise<types.Slot> {
    const params: any[] = [];
    return this.call<types.Slot>('getFirstAvailableBlock', params);
  }

  /**
   * Returns the genesis hash
   */
  async getGenesisHash(): Promise<types.Hash> {
    const params: any[] = [];
    return this.call<types.Hash>('getGenesisHash', params);
  }

  /**
   * Returns the current health of the node
   */
  async getHealth(): Promise<'ok' | 'behind' | 'unknown'> {
    const params: any[] = [];
    return this.call<'ok' | 'behind' | 'unknown'>('getHealth', params);
  }

  /**
   * Returns the highest slot information that the node has snapshots for
   */
  async getHighestSnapshotSlot(): Promise<types.SnapshotSlotInfo> {
    const params: any[] = [];
    return this.call<types.SnapshotSlotInfo>('getHighestSnapshotSlot', params);
  }

  /**
   * Returns the identity pubkey for the current node
   */
  async getIdentity(): Promise<{
    identity: types.Pubkey
}> {
    const params: any[] = [];
    return this.call<{
    identity: types.Pubkey
}>('getIdentity', params);
  }

  /**
   * Returns the current inflation governor
   * @param config 
   */
  async getInflationGovernor(config?: types.CommitmentConfig): Promise<types.InflationGovernor> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.InflationGovernor>('getInflationGovernor', params);
  }

  /**
   * Returns the specific inflation values for the current epoch
   */
  async getInflationRate(): Promise<types.InflationRate> {
    const params: any[] = [];
    return this.call<types.InflationRate>('getInflationRate', params);
  }

  /**
   * Returns the inflation / staking reward for a list of addresses for an epoch
   * @param addresses 
   * @param config 
   */
  async getInflationReward(addresses: Array<types.Pubkey>, config?: types.GetInflationRewardConfig): Promise<Array<types.InflationReward>> {
    const params: any[] = [];
    params.push(addresses);
    if (config !== undefined) params.push(config);
    return this.call<Array<types.InflationReward>>('getInflationReward', params);
  }

  /**
   * Returns the 20 largest accounts, by lamport balance
   * @param config 
   */
  async getLargestAccounts(config?: types.GetLargestAccountsConfig): Promise<types.RpcResponseLargestAccounts> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.RpcResponseLargestAccounts>('getLargestAccounts', params);
  }

  /**
   * Returns the latest blockhash
   * @param config 
   */
  async getLatestBlockhash(config?: types.CommitmentConfig): Promise<types.LatestBlockhashResponse> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.LatestBlockhashResponse>('getLatestBlockhash', params);
  }

  /**
   * Returns the leader schedule for an epoch
   * @param slot 
   * @param config 
   */
  async getLeaderSchedule(slot?: types.Slot, config?: types.GetLeaderScheduleConfig): Promise<types.LeaderSchedule> {
    const params: any[] = [];
    if (slot !== undefined) params.push(slot);
    if (config !== undefined) params.push(config);
    return this.call<types.LeaderSchedule>('getLeaderSchedule', params);
  }

  /**
   * Get the max slot seen from retransmit stage
   */
  async getMaxRetransmitSlot(): Promise<types.Slot> {
    const params: any[] = [];
    return this.call<types.Slot>('getMaxRetransmitSlot', params);
  }

  /**
   * Get the max slot seen from after shred insert
   */
  async getMaxShredInsertSlot(): Promise<types.Slot> {
    const params: any[] = [];
    return this.call<types.Slot>('getMaxShredInsertSlot', params);
  }

  /**
   * Returns minimum balance required to make account rent exempt
   * @param dataLength 
   * @param config 
   */
  async getMinimumBalanceForRentExemption(dataLength: number, config?: types.CommitmentConfig): Promise<number> {
    const params: any[] = [];
    params.push(dataLength);
    if (config !== undefined) params.push(config);
    return this.call<number>('getMinimumBalanceForRentExemption', params);
  }

  /**
   * Returns the account information for a list of Pubkeys
   * @param pubkeys 
   * @param config 
   */
  async getMultipleAccounts(pubkeys: Array<types.Pubkey>, config?: types.GetAccountInfoConfig): Promise<types.MultipleAccountsResponse> {
    const params: any[] = [];
    params.push(pubkeys);
    if (config !== undefined) params.push(config);
    return this.call<types.MultipleAccountsResponse>('getMultipleAccounts', params);
  }

  /**
   * Returns all accounts owned by the provided program Pubkey
   * @param programId 
   * @param config 
   */
  async getProgramAccounts(programId: types.Pubkey, config?: types.GetProgramAccountsConfig): Promise<Array<types.ProgramAccount>> {
    const params: any[] = [];
    params.push(programId);
    if (config !== undefined) params.push(config);
    return this.call<Array<types.ProgramAccount>>('getProgramAccounts', params);
  }

  /**
   * Returns a list of recent performance samples
   * @param limit 
   */
  async getRecentPerformanceSamples(limit?: number): Promise<Array<types.PerformanceSample>> {
    const params: any[] = [];
    if (limit !== undefined) params.push(limit);
    return this.call<Array<types.PerformanceSample>>('getRecentPerformanceSamples', params);
  }

  /**
   * Returns a list of prioritization fees from recent blocks
   * @param addresses 
   */
  async getRecentPrioritizationFees(addresses?: Array<types.Pubkey>): Promise<Array<types.PrioritizationFee>> {
    const params: any[] = [];
    if (addresses !== undefined) params.push(addresses);
    return this.call<Array<types.PrioritizationFee>>('getRecentPrioritizationFees', params);
  }

  /**
   * Returns the statuses of a list of signatures
   * @param signatures 
   * @param config 
   */
  async getSignatureStatuses(signatures: Array<types.Signature>, config?: types.GetSignatureStatusesConfig): Promise<types.SignatureStatusesResponse> {
    const params: any[] = [];
    params.push(signatures);
    if (config !== undefined) params.push(config);
    return this.call<types.SignatureStatusesResponse>('getSignatureStatuses', params);
  }

  /**
   * Returns signatures for confirmed transactions that include the given address
   * @param address 
   * @param config 
   */
  async getSignaturesForAddress(address: types.Pubkey, config?: types.GetSignaturesForAddressConfig): Promise<Array<types.SignatureInfo>> {
    const params: any[] = [];
    params.push(address);
    if (config !== undefined) params.push(config);
    return this.call<Array<types.SignatureInfo>>('getSignaturesForAddress', params);
  }

  /**
   * Returns the slot that has reached the given or default commitment level
   * @param config 
   */
  async getSlot(config?: types.CommitmentConfig): Promise<types.Slot> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.Slot>('getSlot', params);
  }

  /**
   * Returns the current slot leader
   * @param config 
   */
  async getSlotLeader(config?: types.CommitmentConfig): Promise<types.Pubkey> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.Pubkey>('getSlotLeader', params);
  }

  /**
   * Returns the slot leaders for a given slot range
   * @param startSlot 
   * @param limit 
   */
  async getSlotLeaders(startSlot: types.Slot, limit: number): Promise<Array<types.Pubkey>> {
    const params: any[] = [];
    params.push(startSlot);
    params.push(limit);
    return this.call<Array<types.Pubkey>>('getSlotLeaders', params);
  }

  /**
   * Returns the stake minimum delegation, in lamports
   * @param config 
   */
  async getStakeMinimumDelegation(config?: types.CommitmentConfig): Promise<types.RpcResponseU64> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.RpcResponseU64>('getStakeMinimumDelegation', params);
  }

  /**
   * Returns information about the current supply
   * @param config 
   */
  async getSupply(config?: types.GetSupplyConfig): Promise<types.SupplyResponse> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.SupplyResponse>('getSupply', params);
  }

  /**
   * Returns the token balance of an SPL Token account
   * @param pubkey 
   * @param config 
   */
  async getTokenAccountBalance(pubkey: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenBalanceResponse> {
    const params: any[] = [];
    params.push(pubkey);
    if (config !== undefined) params.push(config);
    return this.call<types.TokenBalanceResponse>('getTokenAccountBalance', params);
  }

  /**
   * Returns all SPL Token accounts by approved Delegate
   * @param delegate 
   * @param filter 
   * @param config 
   */
  async getTokenAccountsByDelegate(delegate: types.Pubkey, filter: types.TokenAccountsFilter, config?: types.GetTokenAccountsConfig): Promise<types.TokenAccountsResponse> {
    const params: any[] = [];
    params.push(delegate);
    params.push(filter);
    if (config !== undefined) params.push(config);
    return this.call<types.TokenAccountsResponse>('getTokenAccountsByDelegate', params);
  }

  /**
   * Returns all SPL Token accounts by token owner
   * @param owner 
   * @param filter 
   * @param config 
   */
  async getTokenAccountsByOwner(owner: types.Pubkey, filter: types.TokenAccountsFilter, config?: types.GetTokenAccountsConfig): Promise<types.TokenAccountsResponse> {
    const params: any[] = [];
    params.push(owner);
    params.push(filter);
    if (config !== undefined) params.push(config);
    return this.call<types.TokenAccountsResponse>('getTokenAccountsByOwner', params);
  }

  /**
   * Returns the 20 largest accounts of a particular SPL Token type
   * @param mint 
   * @param config 
   */
  async getTokenLargestAccounts(mint: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenLargestAccountsResponse> {
    const params: any[] = [];
    params.push(mint);
    if (config !== undefined) params.push(config);
    return this.call<types.TokenLargestAccountsResponse>('getTokenLargestAccounts', params);
  }

  /**
   * Returns the total supply of an SPL Token type
   * @param mint 
   * @param config 
   */
  async getTokenSupply(mint: types.Pubkey, config?: types.CommitmentConfig): Promise<types.TokenBalanceResponse> {
    const params: any[] = [];
    params.push(mint);
    if (config !== undefined) params.push(config);
    return this.call<types.TokenBalanceResponse>('getTokenSupply', params);
  }

  /**
   * Returns transaction details for a confirmed transaction
   * @param signature 
   * @param config 
   */
  async getTransaction(signature: types.Signature, config?: types.GetTransactionConfig): Promise<types.TransactionResponse> {
    const params: any[] = [];
    params.push(signature);
    if (config !== undefined) params.push(config);
    return this.call<types.TransactionResponse>('getTransaction', params);
  }

  /**
   * Returns the current Transaction count from the ledger
   * @param config 
   */
  async getTransactionCount(config?: types.CommitmentConfig): Promise<number> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<number>('getTransactionCount', params);
  }

  /**
   * Returns the current Solana version running on the node
   */
  async getVersion(): Promise<types.Version> {
    const params: any[] = [];
    return this.call<types.Version>('getVersion', params);
  }

  /**
   * Returns the account info and associated stake for all the voting accounts in the current bank
   * @param config 
   */
  async getVoteAccounts(config?: types.GetVoteAccountsConfig): Promise<types.VoteAccountsResponse> {
    const params: any[] = [];
    if (config !== undefined) params.push(config);
    return this.call<types.VoteAccountsResponse>('getVoteAccounts', params);
  }

  /**
   * Returns whether a blockhash is still valid or not
   * @param blockhash 
   * @param config 
   */
  async isBlockhashValid(blockhash: types.Hash, config?: types.CommitmentConfig): Promise<types.RpcResponseBool> {
    const params: any[] = [];
    params.push(blockhash);
    if (config !== undefined) params.push(config);
    return this.call<types.RpcResponseBool>('isBlockhashValid', params);
  }

  /**
   * Returns the lowest slot that the node has information about in its ledger
   */
  async minimumLedgerSlot(): Promise<types.Slot> {
    const params: any[] = [];
    return this.call<types.Slot>('minimumLedgerSlot', params);
  }

  /**
   * Requests an airdrop of lamports to a Pubkey
   * @param pubkey 
   * @param lamports 
   * @param config 
   */
  async requestAirdrop(pubkey: types.Pubkey, lamports: number, config?: types.CommitmentConfig): Promise<types.Signature> {
    const params: any[] = [];
    params.push(pubkey);
    params.push(lamports);
    if (config !== undefined) params.push(config);
    return this.call<types.Signature>('requestAirdrop', params);
  }

  /**
   * Submits a signed transaction to the cluster for processing
   * @param transaction 
   * @param config 
   */
  async sendTransaction(transaction: string, config?: types.SendTransactionConfig): Promise<types.Signature> {
    const params: any[] = [];
    params.push(transaction);
    if (config !== undefined) params.push(config);
    return this.call<types.Signature>('sendTransaction', params);
  }

  /**
   * Simulate sending a transaction
   * @param transaction 
   * @param config 
   */
  async simulateTransaction(transaction: string, config?: types.SimulateTransactionConfig): Promise<types.SimulateTransactionResponse> {
    const params: any[] = [];
    params.push(transaction);
    if (config !== undefined) params.push(config);
    return this.call<types.SimulateTransactionResponse>('simulateTransaction', params);
  }

}

export function createSolanaRpcClient(endpoint: string = ENDPOINTS.MAINNET_BETA): SolanaRpcClient {
  return new SolanaRpcClient({ endpoint });
}
