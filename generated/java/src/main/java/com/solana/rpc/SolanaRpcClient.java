package com.solana.rpc;

import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import com.google.gson.*;

/**
 * Solana JSON-RPC API v2.0.0
 * Auto-generated Solana RPC Client
 */
public class SolanaRpcClient {
    public static final String MAINNET_BETA = "https://api.mainnet-beta.solana.com";
    public static final String DEVNET = "https://api.devnet.solana.com";
    public static final String TESTNET = "https://api.testnet.solana.com";

    private final String endpoint;
    private final HttpClient httpClient;
    private final Gson gson;
    private final AtomicLong requestId;

    public SolanaRpcClient(String endpoint) {
        this.endpoint = endpoint;
        this.httpClient = HttpClient.newHttpClient();
        this.gson = new Gson();
        this.requestId = new AtomicLong(0);
    }

    private JsonObject call(String method, List<Object> params) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("jsonrpc", "2.0");
        request.put("id", requestId.incrementAndGet());
        request.put("method", method);
        request.put("params", params);

        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(request)))
            .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);

        if (result.has("error") && !result.get("error").isJsonNull()) {
            JsonObject error = result.getAsJsonObject("error");
            throw new RuntimeException("RPC Error " + error.get("code") + ": " + error.get("message"));
        }

        return result.has("result") ? result.get("result").getAsJsonObject() : new JsonObject();
    }

    /** Returns all information associated with the account of provided Pubkey */
    public JsonElement getAccountInfo(Pubkey pubkey, GetAccountInfoConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(pubkey);
        if (config != null) params.add(config);
        return call("getAccountInfo", params);
    }

    /** Returns the lamport balance of the account of provided Pubkey */
    public JsonElement getBalance(Pubkey pubkey, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(pubkey);
        if (config != null) params.add(config);
        return call("getBalance", params);
    }

    /** Returns identity and transaction information about a confirmed block in the ledger */
    public JsonElement getBlock(Slot slot, GetBlockConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(slot);
        if (config != null) params.add(config);
        return call("getBlock", params);
    }

    /** Returns commitment for particular block */
    public JsonElement getBlockCommitment(Slot slot) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(slot);
        return call("getBlockCommitment", params);
    }

    /** Returns the current block height of the node */
    public JsonElement getBlockHeight(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getBlockHeight", params);
    }

    /** Returns recent block production information from the current or previous epoch */
    public JsonElement getBlockProduction(GetBlockProductionConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getBlockProduction", params);
    }

    /** Returns the estimated production time of a block */
    public JsonElement getBlockTime(Slot slot) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(slot);
        return call("getBlockTime", params);
    }

    /** Returns a list of confirmed blocks between two slots */
    public JsonElement getBlocks(Slot startSlot, Slot endSlot, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(startSlot);
        if (endSlot != null) params.add(endSlot);
        if (config != null) params.add(config);
        return call("getBlocks", params);
    }

    /** Returns a list of confirmed blocks starting at the given slot */
    public JsonElement getBlocksWithLimit(Slot startSlot, Long limit, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(startSlot);
        params.add(limit);
        if (config != null) params.add(config);
        return call("getBlocksWithLimit", params);
    }

    /** Returns information about all the nodes participating in the cluster */
    public JsonElement getClusterNodes() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getClusterNodes", params);
    }

    /** Returns information about the current epoch */
    public JsonElement getEpochInfo(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getEpochInfo", params);
    }

    /** Returns the epoch schedule information from this cluster's genesis config */
    public JsonElement getEpochSchedule() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getEpochSchedule", params);
    }

    /** Returns the fee the network will charge for a particular message */
    public JsonElement getFeeForMessage(String message, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(message);
        if (config != null) params.add(config);
        return call("getFeeForMessage", params);
    }

    /** Returns the slot of the lowest confirmed block that has not been purged from the ledger */
    public JsonElement getFirstAvailableBlock() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getFirstAvailableBlock", params);
    }

    /** Returns the genesis hash */
    public JsonElement getGenesisHash() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getGenesisHash", params);
    }

    /** Returns the current health of the node */
    public JsonElement getHealth() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getHealth", params);
    }

    /** Returns the highest slot information that the node has snapshots for */
    public JsonElement getHighestSnapshotSlot() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getHighestSnapshotSlot", params);
    }

    /** Returns the identity pubkey for the current node */
    public JsonElement getIdentity() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getIdentity", params);
    }

    /** Returns the current inflation governor */
    public JsonElement getInflationGovernor(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getInflationGovernor", params);
    }

    /** Returns the specific inflation values for the current epoch */
    public JsonElement getInflationRate() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getInflationRate", params);
    }

    /** Returns the inflation / staking reward for a list of addresses for an epoch */
    public JsonElement getInflationReward(List<Pubkey> addresses, GetInflationRewardConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(addresses);
        if (config != null) params.add(config);
        return call("getInflationReward", params);
    }

    /** Returns the 20 largest accounts, by lamport balance */
    public JsonElement getLargestAccounts(GetLargestAccountsConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getLargestAccounts", params);
    }

    /** Returns the latest blockhash */
    public JsonElement getLatestBlockhash(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getLatestBlockhash", params);
    }

    /** Returns the leader schedule for an epoch */
    public JsonElement getLeaderSchedule(Slot slot, GetLeaderScheduleConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (slot != null) params.add(slot);
        if (config != null) params.add(config);
        return call("getLeaderSchedule", params);
    }

    /** Get the max slot seen from retransmit stage */
    public JsonElement getMaxRetransmitSlot() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getMaxRetransmitSlot", params);
    }

    /** Get the max slot seen from after shred insert */
    public JsonElement getMaxShredInsertSlot() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getMaxShredInsertSlot", params);
    }

    /** Returns minimum balance required to make account rent exempt */
    public JsonElement getMinimumBalanceForRentExemption(Long dataLength, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(dataLength);
        if (config != null) params.add(config);
        return call("getMinimumBalanceForRentExemption", params);
    }

    /** Returns the account information for a list of Pubkeys */
    public JsonElement getMultipleAccounts(List<Pubkey> pubkeys, GetAccountInfoConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(pubkeys);
        if (config != null) params.add(config);
        return call("getMultipleAccounts", params);
    }

    /** Returns all accounts owned by the provided program Pubkey */
    public JsonElement getProgramAccounts(Pubkey programId, GetProgramAccountsConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(programId);
        if (config != null) params.add(config);
        return call("getProgramAccounts", params);
    }

    /** Returns a list of recent performance samples */
    public JsonElement getRecentPerformanceSamples(Long limit) throws Exception {
        List<Object> params = new ArrayList<>();
        if (limit != null) params.add(limit);
        return call("getRecentPerformanceSamples", params);
    }

    /** Returns a list of prioritization fees from recent blocks */
    public JsonElement getRecentPrioritizationFees(List<Pubkey> addresses) throws Exception {
        List<Object> params = new ArrayList<>();
        if (addresses != null) params.add(addresses);
        return call("getRecentPrioritizationFees", params);
    }

    /** Returns the statuses of a list of signatures */
    public JsonElement getSignatureStatuses(List<Signature> signatures, GetSignatureStatusesConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(signatures);
        if (config != null) params.add(config);
        return call("getSignatureStatuses", params);
    }

    /** Returns signatures for confirmed transactions that include the given address */
    public JsonElement getSignaturesForAddress(Pubkey address, GetSignaturesForAddressConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(address);
        if (config != null) params.add(config);
        return call("getSignaturesForAddress", params);
    }

    /** Returns the slot that has reached the given or default commitment level */
    public JsonElement getSlot(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getSlot", params);
    }

    /** Returns the current slot leader */
    public JsonElement getSlotLeader(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getSlotLeader", params);
    }

    /** Returns the slot leaders for a given slot range */
    public JsonElement getSlotLeaders(Slot startSlot, Long limit) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(startSlot);
        params.add(limit);
        return call("getSlotLeaders", params);
    }

    /** Returns the stake minimum delegation, in lamports */
    public JsonElement getStakeMinimumDelegation(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getStakeMinimumDelegation", params);
    }

    /** Returns information about the current supply */
    public JsonElement getSupply(GetSupplyConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getSupply", params);
    }

    /** Returns the token balance of an SPL Token account */
    public JsonElement getTokenAccountBalance(Pubkey pubkey, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(pubkey);
        if (config != null) params.add(config);
        return call("getTokenAccountBalance", params);
    }

    /** Returns all SPL Token accounts by approved Delegate */
    public JsonElement getTokenAccountsByDelegate(Pubkey delegate, TokenAccountsFilter filter, GetTokenAccountsConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(delegate);
        params.add(filter);
        if (config != null) params.add(config);
        return call("getTokenAccountsByDelegate", params);
    }

    /** Returns all SPL Token accounts by token owner */
    public JsonElement getTokenAccountsByOwner(Pubkey owner, TokenAccountsFilter filter, GetTokenAccountsConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(owner);
        params.add(filter);
        if (config != null) params.add(config);
        return call("getTokenAccountsByOwner", params);
    }

    /** Returns the 20 largest accounts of a particular SPL Token type */
    public JsonElement getTokenLargestAccounts(Pubkey mint, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(mint);
        if (config != null) params.add(config);
        return call("getTokenLargestAccounts", params);
    }

    /** Returns the total supply of an SPL Token type */
    public JsonElement getTokenSupply(Pubkey mint, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(mint);
        if (config != null) params.add(config);
        return call("getTokenSupply", params);
    }

    /** Returns transaction details for a confirmed transaction */
    public JsonElement getTransaction(Signature signature, GetTransactionConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(signature);
        if (config != null) params.add(config);
        return call("getTransaction", params);
    }

    /** Returns the current Transaction count from the ledger */
    public JsonElement getTransactionCount(CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getTransactionCount", params);
    }

    /** Returns the current Solana version running on the node */
    public JsonElement getVersion() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("getVersion", params);
    }

    /** Returns the account info and associated stake for all the voting accounts in the current bank */
    public JsonElement getVoteAccounts(GetVoteAccountsConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        if (config != null) params.add(config);
        return call("getVoteAccounts", params);
    }

    /** Returns whether a blockhash is still valid or not */
    public JsonElement isBlockhashValid(Hash blockhash, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(blockhash);
        if (config != null) params.add(config);
        return call("isBlockhashValid", params);
    }

    /** Returns the lowest slot that the node has information about in its ledger */
    public JsonElement minimumLedgerSlot() throws Exception {
        List<Object> params = new ArrayList<>();
        return call("minimumLedgerSlot", params);
    }

    /** Requests an airdrop of lamports to a Pubkey */
    public JsonElement requestAirdrop(Pubkey pubkey, Long lamports, CommitmentConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(pubkey);
        params.add(lamports);
        if (config != null) params.add(config);
        return call("requestAirdrop", params);
    }

    /** Submits a signed transaction to the cluster for processing */
    public JsonElement sendTransaction(String transaction, SendTransactionConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(transaction);
        if (config != null) params.add(config);
        return call("sendTransaction", params);
    }

    /** Simulate sending a transaction */
    public JsonElement simulateTransaction(String transaction, SimulateTransactionConfig config) throws Exception {
        List<Object> params = new ArrayList<>();
        params.add(transaction);
        if (config != null) params.add(config);
        return call("simulateTransaction", params);
    }

}