using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Solana.Rpc
{
    /// <summary>Auto-generated Solana RPC Client</summary>
    public class SolanaRpcClient
    {
        public static readonly string MainnetBeta = "https://api.mainnet-beta.solana.com";
        public static readonly string Devnet = "https://api.devnet.solana.com";
        public static readonly string Testnet = "https://api.testnet.solana.com";

        private readonly string _endpoint;
        private readonly HttpClient _httpClient;
        private long _requestId;

        public SolanaRpcClient(string endpoint)
        {
            _endpoint = endpoint;
            _httpClient = new HttpClient();
        }

        private async Task<JsonElement> CallAsync(string method, List<object> parameters)
        {
            var request = new { jsonrpc = "2.0", id = ++_requestId, method, @params = parameters };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(json);
            if (result.TryGetProperty("error", out var error) && error.ValueKind != JsonValueKind.Null)
                throw new Exception($"RPC Error: {error}");
            return result.GetProperty("result");
        }

        /// <summary>Returns all information associated with the account of provided Pubkey</summary>
        public async Task<JsonElement> GetAccountInfoAsync(Pubkey pubkey, GetAccountInfoConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(pubkey);
            if (config != default) parameters.Add(config);
            return await CallAsync("getAccountInfo", parameters);
        }

        /// <summary>Returns the lamport balance of the account of provided Pubkey</summary>
        public async Task<JsonElement> GetBalanceAsync(Pubkey pubkey, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(pubkey);
            if (config != default) parameters.Add(config);
            return await CallAsync("getBalance", parameters);
        }

        /// <summary>Returns identity and transaction information about a confirmed block in the ledger</summary>
        public async Task<JsonElement> GetBlockAsync(Slot slot, GetBlockConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(slot);
            if (config != default) parameters.Add(config);
            return await CallAsync("getBlock", parameters);
        }

        /// <summary>Returns commitment for particular block</summary>
        public async Task<JsonElement> GetBlockCommitmentAsync(Slot slot)
        {
            var parameters = new List<object>();
            parameters.Add(slot);
            return await CallAsync("getBlockCommitment", parameters);
        }

        /// <summary>Returns the current block height of the node</summary>
        public async Task<JsonElement> GetBlockHeightAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getBlockHeight", parameters);
        }

        /// <summary>Returns recent block production information from the current or previous epoch</summary>
        public async Task<JsonElement> GetBlockProductionAsync(GetBlockProductionConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getBlockProduction", parameters);
        }

        /// <summary>Returns the estimated production time of a block</summary>
        public async Task<JsonElement> GetBlockTimeAsync(Slot slot)
        {
            var parameters = new List<object>();
            parameters.Add(slot);
            return await CallAsync("getBlockTime", parameters);
        }

        /// <summary>Returns a list of confirmed blocks between two slots</summary>
        public async Task<JsonElement> GetBlocksAsync(Slot startSlot, Slot endSlot = default, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(startSlot);
            if (endSlot != default) parameters.Add(endSlot);
            if (config != default) parameters.Add(config);
            return await CallAsync("getBlocks", parameters);
        }

        /// <summary>Returns a list of confirmed blocks starting at the given slot</summary>
        public async Task<JsonElement> GetBlocksWithLimitAsync(Slot startSlot, long limit, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(startSlot);
            parameters.Add(limit);
            if (config != default) parameters.Add(config);
            return await CallAsync("getBlocksWithLimit", parameters);
        }

        /// <summary>Returns information about all the nodes participating in the cluster</summary>
        public async Task<JsonElement> GetClusterNodesAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getClusterNodes", parameters);
        }

        /// <summary>Returns information about the current epoch</summary>
        public async Task<JsonElement> GetEpochInfoAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getEpochInfo", parameters);
        }

        /// <summary>Returns the epoch schedule information from this cluster's genesis config</summary>
        public async Task<JsonElement> GetEpochScheduleAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getEpochSchedule", parameters);
        }

        /// <summary>Returns the fee the network will charge for a particular message</summary>
        public async Task<JsonElement> GetFeeForMessageAsync(string message, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(message);
            if (config != default) parameters.Add(config);
            return await CallAsync("getFeeForMessage", parameters);
        }

        /// <summary>Returns the slot of the lowest confirmed block that has not been purged from the ledger</summary>
        public async Task<JsonElement> GetFirstAvailableBlockAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getFirstAvailableBlock", parameters);
        }

        /// <summary>Returns the genesis hash</summary>
        public async Task<JsonElement> GetGenesisHashAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getGenesisHash", parameters);
        }

        /// <summary>Returns the current health of the node</summary>
        public async Task<JsonElement> GetHealthAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getHealth", parameters);
        }

        /// <summary>Returns the highest slot information that the node has snapshots for</summary>
        public async Task<JsonElement> GetHighestSnapshotSlotAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getHighestSnapshotSlot", parameters);
        }

        /// <summary>Returns the identity pubkey for the current node</summary>
        public async Task<JsonElement> GetIdentityAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getIdentity", parameters);
        }

        /// <summary>Returns the current inflation governor</summary>
        public async Task<JsonElement> GetInflationGovernorAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getInflationGovernor", parameters);
        }

        /// <summary>Returns the specific inflation values for the current epoch</summary>
        public async Task<JsonElement> GetInflationRateAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getInflationRate", parameters);
        }

        /// <summary>Returns the inflation / staking reward for a list of addresses for an epoch</summary>
        public async Task<JsonElement> GetInflationRewardAsync(List<Pubkey> addresses, GetInflationRewardConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(addresses);
            if (config != default) parameters.Add(config);
            return await CallAsync("getInflationReward", parameters);
        }

        /// <summary>Returns the 20 largest accounts, by lamport balance</summary>
        public async Task<JsonElement> GetLargestAccountsAsync(GetLargestAccountsConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getLargestAccounts", parameters);
        }

        /// <summary>Returns the latest blockhash</summary>
        public async Task<JsonElement> GetLatestBlockhashAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getLatestBlockhash", parameters);
        }

        /// <summary>Returns the leader schedule for an epoch</summary>
        public async Task<JsonElement> GetLeaderScheduleAsync(Slot slot = default, GetLeaderScheduleConfig config = default)
        {
            var parameters = new List<object>();
            if (slot != default) parameters.Add(slot);
            if (config != default) parameters.Add(config);
            return await CallAsync("getLeaderSchedule", parameters);
        }

        /// <summary>Get the max slot seen from retransmit stage</summary>
        public async Task<JsonElement> GetMaxRetransmitSlotAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getMaxRetransmitSlot", parameters);
        }

        /// <summary>Get the max slot seen from after shred insert</summary>
        public async Task<JsonElement> GetMaxShredInsertSlotAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getMaxShredInsertSlot", parameters);
        }

        /// <summary>Returns minimum balance required to make account rent exempt</summary>
        public async Task<JsonElement> GetMinimumBalanceForRentExemptionAsync(long dataLength, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(dataLength);
            if (config != default) parameters.Add(config);
            return await CallAsync("getMinimumBalanceForRentExemption", parameters);
        }

        /// <summary>Returns the account information for a list of Pubkeys</summary>
        public async Task<JsonElement> GetMultipleAccountsAsync(List<Pubkey> pubkeys, GetAccountInfoConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(pubkeys);
            if (config != default) parameters.Add(config);
            return await CallAsync("getMultipleAccounts", parameters);
        }

        /// <summary>Returns all accounts owned by the provided program Pubkey</summary>
        public async Task<JsonElement> GetProgramAccountsAsync(Pubkey programId, GetProgramAccountsConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(programId);
            if (config != default) parameters.Add(config);
            return await CallAsync("getProgramAccounts", parameters);
        }

        /// <summary>Returns a list of recent performance samples</summary>
        public async Task<JsonElement> GetRecentPerformanceSamplesAsync(long limit = default)
        {
            var parameters = new List<object>();
            if (limit != default) parameters.Add(limit);
            return await CallAsync("getRecentPerformanceSamples", parameters);
        }

        /// <summary>Returns a list of prioritization fees from recent blocks</summary>
        public async Task<JsonElement> GetRecentPrioritizationFeesAsync(List<Pubkey> addresses = default)
        {
            var parameters = new List<object>();
            if (addresses != default) parameters.Add(addresses);
            return await CallAsync("getRecentPrioritizationFees", parameters);
        }

        /// <summary>Returns the statuses of a list of signatures</summary>
        public async Task<JsonElement> GetSignatureStatusesAsync(List<Signature> signatures, GetSignatureStatusesConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(signatures);
            if (config != default) parameters.Add(config);
            return await CallAsync("getSignatureStatuses", parameters);
        }

        /// <summary>Returns signatures for confirmed transactions that include the given address</summary>
        public async Task<JsonElement> GetSignaturesForAddressAsync(Pubkey address, GetSignaturesForAddressConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(address);
            if (config != default) parameters.Add(config);
            return await CallAsync("getSignaturesForAddress", parameters);
        }

        /// <summary>Returns the slot that has reached the given or default commitment level</summary>
        public async Task<JsonElement> GetSlotAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getSlot", parameters);
        }

        /// <summary>Returns the current slot leader</summary>
        public async Task<JsonElement> GetSlotLeaderAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getSlotLeader", parameters);
        }

        /// <summary>Returns the slot leaders for a given slot range</summary>
        public async Task<JsonElement> GetSlotLeadersAsync(Slot startSlot, long limit)
        {
            var parameters = new List<object>();
            parameters.Add(startSlot);
            parameters.Add(limit);
            return await CallAsync("getSlotLeaders", parameters);
        }

        /// <summary>Returns the stake minimum delegation, in lamports</summary>
        public async Task<JsonElement> GetStakeMinimumDelegationAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getStakeMinimumDelegation", parameters);
        }

        /// <summary>Returns information about the current supply</summary>
        public async Task<JsonElement> GetSupplyAsync(GetSupplyConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getSupply", parameters);
        }

        /// <summary>Returns the token balance of an SPL Token account</summary>
        public async Task<JsonElement> GetTokenAccountBalanceAsync(Pubkey pubkey, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(pubkey);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTokenAccountBalance", parameters);
        }

        /// <summary>Returns all SPL Token accounts by approved Delegate</summary>
        public async Task<JsonElement> GetTokenAccountsByDelegateAsync(Pubkey delegate, TokenAccountsFilter filter, GetTokenAccountsConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(delegate);
            parameters.Add(filter);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTokenAccountsByDelegate", parameters);
        }

        /// <summary>Returns all SPL Token accounts by token owner</summary>
        public async Task<JsonElement> GetTokenAccountsByOwnerAsync(Pubkey owner, TokenAccountsFilter filter, GetTokenAccountsConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(owner);
            parameters.Add(filter);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTokenAccountsByOwner", parameters);
        }

        /// <summary>Returns the 20 largest accounts of a particular SPL Token type</summary>
        public async Task<JsonElement> GetTokenLargestAccountsAsync(Pubkey mint, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(mint);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTokenLargestAccounts", parameters);
        }

        /// <summary>Returns the total supply of an SPL Token type</summary>
        public async Task<JsonElement> GetTokenSupplyAsync(Pubkey mint, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(mint);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTokenSupply", parameters);
        }

        /// <summary>Returns transaction details for a confirmed transaction</summary>
        public async Task<JsonElement> GetTransactionAsync(Signature signature, GetTransactionConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(signature);
            if (config != default) parameters.Add(config);
            return await CallAsync("getTransaction", parameters);
        }

        /// <summary>Returns the current Transaction count from the ledger</summary>
        public async Task<JsonElement> GetTransactionCountAsync(CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getTransactionCount", parameters);
        }

        /// <summary>Returns the current Solana version running on the node</summary>
        public async Task<JsonElement> GetVersionAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("getVersion", parameters);
        }

        /// <summary>Returns the account info and associated stake for all the voting accounts in the current bank</summary>
        public async Task<JsonElement> GetVoteAccountsAsync(GetVoteAccountsConfig config = default)
        {
            var parameters = new List<object>();
            if (config != default) parameters.Add(config);
            return await CallAsync("getVoteAccounts", parameters);
        }

        /// <summary>Returns whether a blockhash is still valid or not</summary>
        public async Task<JsonElement> IsBlockhashValidAsync(Hash blockhash, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(blockhash);
            if (config != default) parameters.Add(config);
            return await CallAsync("isBlockhashValid", parameters);
        }

        /// <summary>Returns the lowest slot that the node has information about in its ledger</summary>
        public async Task<JsonElement> MinimumLedgerSlotAsync()
        {
            var parameters = new List<object>();
            return await CallAsync("minimumLedgerSlot", parameters);
        }

        /// <summary>Requests an airdrop of lamports to a Pubkey</summary>
        public async Task<JsonElement> RequestAirdropAsync(Pubkey pubkey, long lamports, CommitmentConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(pubkey);
            parameters.Add(lamports);
            if (config != default) parameters.Add(config);
            return await CallAsync("requestAirdrop", parameters);
        }

        /// <summary>Submits a signed transaction to the cluster for processing</summary>
        public async Task<JsonElement> SendTransactionAsync(string transaction, SendTransactionConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(transaction);
            if (config != default) parameters.Add(config);
            return await CallAsync("sendTransaction", parameters);
        }

        /// <summary>Simulate sending a transaction</summary>
        public async Task<JsonElement> SimulateTransactionAsync(string transaction, SimulateTransactionConfig config = default)
        {
            var parameters = new List<object>();
            parameters.Add(transaction);
            if (config != default) parameters.Add(config);
            return await CallAsync("simulateTransaction", parameters);
        }

    }
}