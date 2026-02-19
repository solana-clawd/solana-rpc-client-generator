//! Auto-generated Solana RPC Client

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::atomic::{AtomicU64, Ordering};

pub const MAINNET_BETA: &str = "https://api.mainnet-beta.solana.com";
pub const DEVNET: &str = "https://api.devnet.solana.com";
pub const TESTNET: &str = "https://api.testnet.solana.com";

#[derive(Debug, Deserialize)]
struct RpcResponse {
    result: Option<Value>,
    error: Option<RpcError>,
}

#[derive(Debug, Deserialize)]
pub struct RpcError {
    pub code: i64,
    pub message: String,
}

pub struct SolanaRpcClient {
    endpoint: String,
    client: Client,
    request_id: AtomicU64,
}

impl SolanaRpcClient {
    pub fn new(endpoint: &str) -> Self {
        Self {
            endpoint: endpoint.to_string(),
            client: Client::new(),
            request_id: AtomicU64::new(0),
        }
    }

    async fn call(&self, method: &str, params: Vec<Value>) -> Result<Value, String> {
        let id = self.request_id.fetch_add(1, Ordering::SeqCst);
        let request = json!({
            "jsonrpc": "2.0",
            "id": id,
            "method": method,
            "params": params,
        });

        let response: RpcResponse = self.client
            .post(&self.endpoint)
            .json(&request)
            .send()
            .await
            .map_err(|e| e.to_string())?
            .json()
            .await
            .map_err(|e| e.to_string())?;

        if let Some(error) = response.error {
            return Err(format!("RPC error {}: {}", error.code, error.message));
        }

        Ok(response.result.unwrap_or(Value::Null))
    }

    /// Returns all information associated with the account of provided Pubkey
    pub async fn get_account_info(&self, pubkey: Pubkey, config: Option<GetAccountInfoConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(pubkey));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getAccountInfo", params).await
    }

    /// Returns the lamport balance of the account of provided Pubkey
    pub async fn get_balance(&self, pubkey: Pubkey, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(pubkey));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBalance", params).await
    }

    /// Returns identity and transaction information about a confirmed block in the ledger
    pub async fn get_block(&self, slot: Slot, config: Option<GetBlockConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(slot));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBlock", params).await
    }

    /// Returns commitment for particular block
    pub async fn get_block_commitment(&self, slot: Slot) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(slot));
        self.call("getBlockCommitment", params).await
    }

    /// Returns the current block height of the node
    pub async fn get_block_height(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBlockHeight", params).await
    }

    /// Returns recent block production information from the current or previous epoch
    pub async fn get_block_production(&self, config: Option<GetBlockProductionConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBlockProduction", params).await
    }

    /// Returns the estimated production time of a block
    pub async fn get_block_time(&self, slot: Slot) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(slot));
        self.call("getBlockTime", params).await
    }

    /// Returns a list of confirmed blocks between two slots
    pub async fn get_blocks(&self, start_slot: Slot, end_slot: Option<Slot>, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(start_slot));
        if let Some(v) = end_slot { params.push(json!(v)); }
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBlocks", params).await
    }

    /// Returns a list of confirmed blocks starting at the given slot
    pub async fn get_blocks_with_limit(&self, start_slot: Slot, limit: i64, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(start_slot));
        params.push(json!(limit));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getBlocksWithLimit", params).await
    }

    /// Returns information about all the nodes participating in the cluster
    pub async fn get_cluster_nodes(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getClusterNodes", params).await
    }

    /// Returns information about the current epoch
    pub async fn get_epoch_info(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getEpochInfo", params).await
    }

    /// Returns the epoch schedule information from this cluster's genesis config
    pub async fn get_epoch_schedule(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getEpochSchedule", params).await
    }

    /// Returns the fee the network will charge for a particular message
    pub async fn get_fee_for_message(&self, message: String, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(message));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getFeeForMessage", params).await
    }

    /// Returns the slot of the lowest confirmed block that has not been purged from the ledger
    pub async fn get_first_available_block(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getFirstAvailableBlock", params).await
    }

    /// Returns the genesis hash
    pub async fn get_genesis_hash(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getGenesisHash", params).await
    }

    /// Returns the current health of the node
    pub async fn get_health(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getHealth", params).await
    }

    /// Returns the highest slot information that the node has snapshots for
    pub async fn get_highest_snapshot_slot(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getHighestSnapshotSlot", params).await
    }

    /// Returns the identity pubkey for the current node
    pub async fn get_identity(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getIdentity", params).await
    }

    /// Returns the current inflation governor
    pub async fn get_inflation_governor(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getInflationGovernor", params).await
    }

    /// Returns the specific inflation values for the current epoch
    pub async fn get_inflation_rate(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getInflationRate", params).await
    }

    /// Returns the inflation / staking reward for a list of addresses for an epoch
    pub async fn get_inflation_reward(&self, addresses: Vec<Pubkey>, config: Option<GetInflationRewardConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(addresses));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getInflationReward", params).await
    }

    /// Returns the 20 largest accounts, by lamport balance
    pub async fn get_largest_accounts(&self, config: Option<GetLargestAccountsConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getLargestAccounts", params).await
    }

    /// Returns the latest blockhash
    pub async fn get_latest_blockhash(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getLatestBlockhash", params).await
    }

    /// Returns the leader schedule for an epoch
    pub async fn get_leader_schedule(&self, slot: Option<Slot>, config: Option<GetLeaderScheduleConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = slot { params.push(json!(v)); }
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getLeaderSchedule", params).await
    }

    /// Get the max slot seen from retransmit stage
    pub async fn get_max_retransmit_slot(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getMaxRetransmitSlot", params).await
    }

    /// Get the max slot seen from after shred insert
    pub async fn get_max_shred_insert_slot(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getMaxShredInsertSlot", params).await
    }

    /// Returns minimum balance required to make account rent exempt
    pub async fn get_minimum_balance_for_rent_exemption(&self, data_length: i64, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(data_length));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getMinimumBalanceForRentExemption", params).await
    }

    /// Returns the account information for a list of Pubkeys
    pub async fn get_multiple_accounts(&self, pubkeys: Vec<Pubkey>, config: Option<GetAccountInfoConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(pubkeys));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getMultipleAccounts", params).await
    }

    /// Returns all accounts owned by the provided program Pubkey
    pub async fn get_program_accounts(&self, program_id: Pubkey, config: Option<GetProgramAccountsConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(program_id));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getProgramAccounts", params).await
    }

    /// Returns a list of recent performance samples
    pub async fn get_recent_performance_samples(&self, limit: Option<i64>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = limit { params.push(json!(v)); }
        self.call("getRecentPerformanceSamples", params).await
    }

    /// Returns a list of prioritization fees from recent blocks
    pub async fn get_recent_prioritization_fees(&self, addresses: Option<Vec<Pubkey>>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = addresses { params.push(json!(v)); }
        self.call("getRecentPrioritizationFees", params).await
    }

    /// Returns the statuses of a list of signatures
    pub async fn get_signature_statuses(&self, signatures: Vec<Signature>, config: Option<GetSignatureStatusesConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(signatures));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getSignatureStatuses", params).await
    }

    /// Returns signatures for confirmed transactions that include the given address
    pub async fn get_signatures_for_address(&self, address: Pubkey, config: Option<GetSignaturesForAddressConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(address));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getSignaturesForAddress", params).await
    }

    /// Returns the slot that has reached the given or default commitment level
    pub async fn get_slot(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getSlot", params).await
    }

    /// Returns the current slot leader
    pub async fn get_slot_leader(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getSlotLeader", params).await
    }

    /// Returns the slot leaders for a given slot range
    pub async fn get_slot_leaders(&self, start_slot: Slot, limit: i64) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(start_slot));
        params.push(json!(limit));
        self.call("getSlotLeaders", params).await
    }

    /// Returns the stake minimum delegation, in lamports
    pub async fn get_stake_minimum_delegation(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getStakeMinimumDelegation", params).await
    }

    /// Returns information about the current supply
    pub async fn get_supply(&self, config: Option<GetSupplyConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getSupply", params).await
    }

    /// Returns the token balance of an SPL Token account
    pub async fn get_token_account_balance(&self, pubkey: Pubkey, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(pubkey));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTokenAccountBalance", params).await
    }

    /// Returns all SPL Token accounts by approved Delegate
    pub async fn get_token_accounts_by_delegate(&self, delegate: Pubkey, filter: TokenAccountsFilter, config: Option<GetTokenAccountsConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(delegate));
        params.push(json!(filter));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTokenAccountsByDelegate", params).await
    }

    /// Returns all SPL Token accounts by token owner
    pub async fn get_token_accounts_by_owner(&self, owner: Pubkey, filter: TokenAccountsFilter, config: Option<GetTokenAccountsConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(owner));
        params.push(json!(filter));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTokenAccountsByOwner", params).await
    }

    /// Returns the 20 largest accounts of a particular SPL Token type
    pub async fn get_token_largest_accounts(&self, mint: Pubkey, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(mint));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTokenLargestAccounts", params).await
    }

    /// Returns the total supply of an SPL Token type
    pub async fn get_token_supply(&self, mint: Pubkey, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(mint));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTokenSupply", params).await
    }

    /// Returns transaction details for a confirmed transaction
    pub async fn get_transaction(&self, signature: Signature, config: Option<GetTransactionConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(signature));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTransaction", params).await
    }

    /// Returns the current Transaction count from the ledger
    pub async fn get_transaction_count(&self, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getTransactionCount", params).await
    }

    /// Returns the current Solana version running on the node
    pub async fn get_version(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("getVersion", params).await
    }

    /// Returns the account info and associated stake for all the voting accounts in the current bank
    pub async fn get_vote_accounts(&self, config: Option<GetVoteAccountsConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        if let Some(v) = config { params.push(json!(v)); }
        self.call("getVoteAccounts", params).await
    }

    /// Returns whether a blockhash is still valid or not
    pub async fn is_blockhash_valid(&self, blockhash: Hash, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(blockhash));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("isBlockhashValid", params).await
    }

    /// Returns the lowest slot that the node has information about in its ledger
    pub async fn minimum_ledger_slot(&self) -> Result<Value, String> {
        let mut params = Vec::new();
        self.call("minimumLedgerSlot", params).await
    }

    /// Requests an airdrop of lamports to a Pubkey
    pub async fn request_airdrop(&self, pubkey: Pubkey, lamports: i64, config: Option<CommitmentConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(pubkey));
        params.push(json!(lamports));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("requestAirdrop", params).await
    }

    /// Submits a signed transaction to the cluster for processing
    pub async fn send_transaction(&self, transaction: String, config: Option<SendTransactionConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(transaction));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("sendTransaction", params).await
    }

    /// Simulate sending a transaction
    pub async fn simulate_transaction(&self, transaction: String, config: Option<SimulateTransactionConfig>) -> Result<Value, String> {
        let mut params = Vec::new();
        params.push(json!(transaction));
        if let Some(v) = config { params.push(json!(v)); }
        self.call("simulateTransaction", params).await
    }

}