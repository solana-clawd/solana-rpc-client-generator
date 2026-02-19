package com.solana.rpc

import kotlinx.serialization.json.*
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicLong

/**
 * Solana JSON-RPC API v2.0.0
 * Auto-generated Solana RPC Client
 */
class SolanaRpcClient(private val endpoint: String = MAINNET_BETA) {
    companion object {
        const val MAINNET_BETA = "https://api.mainnet-beta.solana.com"
        const val DEVNET = "https://api.devnet.solana.com"
        const val TESTNET = "https://api.testnet.solana.com"
    }

    private val requestId = AtomicLong(0)
    private val json = Json { ignoreUnknownKeys = true }

    private fun call(method: String, params: List<Any?>): JsonElement {
        val id = requestId.incrementAndGet()
        val request = buildJsonObject {
            put("jsonrpc", "2.0")
            put("id", id)
            put("method", method)
            put("params", json.encodeToJsonElement(params))
        }

        val connection = URL(endpoint).openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.setRequestProperty("Content-Type", "application/json")
        connection.doOutput = true
        connection.outputStream.write(request.toString().toByteArray())

        val response = connection.inputStream.bufferedReader().readText()
        val result = json.parseToJsonElement(response).jsonObject

        result["error"]?.let { error ->
            val errorObj = error.jsonObject
            throw RuntimeException("RPC Error ${errorObj["code"]}: ${errorObj["message"]}")
        }

        return result["result"] ?: JsonNull
    }

    /** Returns all information associated with the account of provided Pubkey */
    fun getAccountInfo(pubkey: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(pubkey)
        config?.let { params.add(it) }
        return call("getAccountInfo", params)
    }

    /** Returns the lamport balance of the account of provided Pubkey */
    fun getBalance(pubkey: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(pubkey)
        config?.let { params.add(it) }
        return call("getBalance", params)
    }

    /** Returns identity and transaction information about a confirmed block in the ledger */
    fun getBlock(slot: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(slot)
        config?.let { params.add(it) }
        return call("getBlock", params)
    }

    /** Returns commitment for particular block */
    fun getBlockCommitment(slot: Any): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(slot)
        return call("getBlockCommitment", params)
    }

    /** Returns the current block height of the node */
    fun getBlockHeight(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getBlockHeight", params)
    }

    /** Returns recent block production information from the current or previous epoch */
    fun getBlockProduction(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getBlockProduction", params)
    }

    /** Returns the estimated production time of a block */
    fun getBlockTime(slot: Any): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(slot)
        return call("getBlockTime", params)
    }

    /** Returns a list of confirmed blocks between two slots */
    fun getBlocks(startSlot: Any, endSlot: Any? = null, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(startSlot)
        endSlot?.let { params.add(it) }
        config?.let { params.add(it) }
        return call("getBlocks", params)
    }

    /** Returns a list of confirmed blocks starting at the given slot */
    fun getBlocksWithLimit(startSlot: Any, limit: Long, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(startSlot)
        params.add(limit)
        config?.let { params.add(it) }
        return call("getBlocksWithLimit", params)
    }

    /** Returns information about all the nodes participating in the cluster */
    fun getClusterNodes(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getClusterNodes", params)
    }

    /** Returns information about the current epoch */
    fun getEpochInfo(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getEpochInfo", params)
    }

    /** Returns the epoch schedule information from this cluster's genesis config */
    fun getEpochSchedule(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getEpochSchedule", params)
    }

    /** Returns the fee the network will charge for a particular message */
    fun getFeeForMessage(message: String, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(message)
        config?.let { params.add(it) }
        return call("getFeeForMessage", params)
    }

    /** Returns the slot of the lowest confirmed block that has not been purged from the ledger */
    fun getFirstAvailableBlock(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getFirstAvailableBlock", params)
    }

    /** Returns the genesis hash */
    fun getGenesisHash(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getGenesisHash", params)
    }

    /** Returns the current health of the node */
    fun getHealth(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getHealth", params)
    }

    /** Returns the highest slot information that the node has snapshots for */
    fun getHighestSnapshotSlot(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getHighestSnapshotSlot", params)
    }

    /** Returns the identity pubkey for the current node */
    fun getIdentity(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getIdentity", params)
    }

    /** Returns the current inflation governor */
    fun getInflationGovernor(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getInflationGovernor", params)
    }

    /** Returns the specific inflation values for the current epoch */
    fun getInflationRate(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getInflationRate", params)
    }

    /** Returns the inflation / staking reward for a list of addresses for an epoch */
    fun getInflationReward(addresses: List<Any>, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(addresses)
        config?.let { params.add(it) }
        return call("getInflationReward", params)
    }

    /** Returns the 20 largest accounts, by lamport balance */
    fun getLargestAccounts(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getLargestAccounts", params)
    }

    /** Returns the latest blockhash */
    fun getLatestBlockhash(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getLatestBlockhash", params)
    }

    /** Returns the leader schedule for an epoch */
    fun getLeaderSchedule(slot: Any? = null, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        slot?.let { params.add(it) }
        config?.let { params.add(it) }
        return call("getLeaderSchedule", params)
    }

    /** Get the max slot seen from retransmit stage */
    fun getMaxRetransmitSlot(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getMaxRetransmitSlot", params)
    }

    /** Get the max slot seen from after shred insert */
    fun getMaxShredInsertSlot(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getMaxShredInsertSlot", params)
    }

    /** Returns minimum balance required to make account rent exempt */
    fun getMinimumBalanceForRentExemption(dataLength: Long, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(dataLength)
        config?.let { params.add(it) }
        return call("getMinimumBalanceForRentExemption", params)
    }

    /** Returns the account information for a list of Pubkeys */
    fun getMultipleAccounts(pubkeys: List<Any>, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(pubkeys)
        config?.let { params.add(it) }
        return call("getMultipleAccounts", params)
    }

    /** Returns all accounts owned by the provided program Pubkey */
    fun getProgramAccounts(programId: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(programId)
        config?.let { params.add(it) }
        return call("getProgramAccounts", params)
    }

    /** Returns a list of recent performance samples */
    fun getRecentPerformanceSamples(limit: Long? = null): JsonElement {
        val params = mutableListOf<Any?>()
        limit?.let { params.add(it) }
        return call("getRecentPerformanceSamples", params)
    }

    /** Returns a list of prioritization fees from recent blocks */
    fun getRecentPrioritizationFees(addresses: List<Any>? = null): JsonElement {
        val params = mutableListOf<Any?>()
        addresses?.let { params.add(it) }
        return call("getRecentPrioritizationFees", params)
    }

    /** Returns the statuses of a list of signatures */
    fun getSignatureStatuses(signatures: List<Any>, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(signatures)
        config?.let { params.add(it) }
        return call("getSignatureStatuses", params)
    }

    /** Returns signatures for confirmed transactions that include the given address */
    fun getSignaturesForAddress(address: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(address)
        config?.let { params.add(it) }
        return call("getSignaturesForAddress", params)
    }

    /** Returns the slot that has reached the given or default commitment level */
    fun getSlot(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getSlot", params)
    }

    /** Returns the current slot leader */
    fun getSlotLeader(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getSlotLeader", params)
    }

    /** Returns the slot leaders for a given slot range */
    fun getSlotLeaders(startSlot: Any, limit: Long): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(startSlot)
        params.add(limit)
        return call("getSlotLeaders", params)
    }

    /** Returns the stake minimum delegation, in lamports */
    fun getStakeMinimumDelegation(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getStakeMinimumDelegation", params)
    }

    /** Returns information about the current supply */
    fun getSupply(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getSupply", params)
    }

    /** Returns the token balance of an SPL Token account */
    fun getTokenAccountBalance(pubkey: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(pubkey)
        config?.let { params.add(it) }
        return call("getTokenAccountBalance", params)
    }

    /** Returns all SPL Token accounts by approved Delegate */
    fun getTokenAccountsByDelegate(delegate: Any, filter: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(delegate)
        params.add(filter)
        config?.let { params.add(it) }
        return call("getTokenAccountsByDelegate", params)
    }

    /** Returns all SPL Token accounts by token owner */
    fun getTokenAccountsByOwner(owner: Any, filter: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(owner)
        params.add(filter)
        config?.let { params.add(it) }
        return call("getTokenAccountsByOwner", params)
    }

    /** Returns the 20 largest accounts of a particular SPL Token type */
    fun getTokenLargestAccounts(mint: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(mint)
        config?.let { params.add(it) }
        return call("getTokenLargestAccounts", params)
    }

    /** Returns the total supply of an SPL Token type */
    fun getTokenSupply(mint: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(mint)
        config?.let { params.add(it) }
        return call("getTokenSupply", params)
    }

    /** Returns transaction details for a confirmed transaction */
    fun getTransaction(signature: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(signature)
        config?.let { params.add(it) }
        return call("getTransaction", params)
    }

    /** Returns the current Transaction count from the ledger */
    fun getTransactionCount(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getTransactionCount", params)
    }

    /** Returns the current Solana version running on the node */
    fun getVersion(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("getVersion", params)
    }

    /** Returns the account info and associated stake for all the voting accounts in the current bank */
    fun getVoteAccounts(config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        config?.let { params.add(it) }
        return call("getVoteAccounts", params)
    }

    /** Returns whether a blockhash is still valid or not */
    fun isBlockhashValid(blockhash: Any, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(blockhash)
        config?.let { params.add(it) }
        return call("isBlockhashValid", params)
    }

    /** Returns the lowest slot that the node has information about in its ledger */
    fun minimumLedgerSlot(): JsonElement {
        val params = mutableListOf<Any?>()
        return call("minimumLedgerSlot", params)
    }

    /** Requests an airdrop of lamports to a Pubkey */
    fun requestAirdrop(pubkey: Any, lamports: Long, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(pubkey)
        params.add(lamports)
        config?.let { params.add(it) }
        return call("requestAirdrop", params)
    }

    /** Submits a signed transaction to the cluster for processing */
    fun sendTransaction(transaction: String, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(transaction)
        config?.let { params.add(it) }
        return call("sendTransaction", params)
    }

    /** Simulate sending a transaction */
    fun simulateTransaction(transaction: String, config: Any? = null): JsonElement {
        val params = mutableListOf<Any?>()
        params.add(transaction)
        config?.let { params.add(it) }
        return call("simulateTransaction", params)
    }

}