import Foundation

/// Auto-generated Solana RPC Client
public class SolanaRpcClient {
    public static let mainnetBeta = "https://api.mainnet-beta.solana.com"
    public static let devnet = "https://api.devnet.solana.com"
    public static let testnet = "https://api.testnet.solana.com"

    private let endpoint: URL
    private var requestId: Int64 = 0

    public init(endpoint: String = mainnetBeta) {
        self.endpoint = URL(string: endpoint)!
    }

    private func call(_ method: String, params: [Any]) async throws -> Any {
        requestId += 1
        let request: [String: Any] = [
            "jsonrpc": "2.0",
            "id": requestId,
            "method": method,
            "params": params
        ]

        var urlRequest = URLRequest(url: endpoint)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONSerialization.data(withJSONObject: request)

        let (data, _) = try await URLSession.shared.data(for: urlRequest)
        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]

        if let error = json["error"] as? [String: Any] {
            throw NSError(domain: "SolanaRPC", code: error["code"] as? Int ?? -1,
                         userInfo: [NSLocalizedDescriptionKey: error["message"] as? String ?? "Unknown error"])
        }

        return json["result"] ?? NSNull()
    }

    /// Returns all information associated with the account of provided Pubkey
    public func getAccountInfo(pubkey: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(pubkey)
        if let v = config { params.append(v) }
        return try await call("getAccountInfo", params: params)
    }

    /// Returns the lamport balance of the account of provided Pubkey
    public func getBalance(pubkey: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(pubkey)
        if let v = config { params.append(v) }
        return try await call("getBalance", params: params)
    }

    /// Returns identity and transaction information about a confirmed block in the ledger
    public func getBlock(slot: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(slot)
        if let v = config { params.append(v) }
        return try await call("getBlock", params: params)
    }

    /// Returns commitment for particular block
    public func getBlockCommitment(slot: Any) async throws -> Any {
        var params: [Any] = []
        params.append(slot)
        return try await call("getBlockCommitment", params: params)
    }

    /// Returns the current block height of the node
    public func getBlockHeight(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getBlockHeight", params: params)
    }

    /// Returns recent block production information from the current or previous epoch
    public func getBlockProduction(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getBlockProduction", params: params)
    }

    /// Returns the estimated production time of a block
    public func getBlockTime(slot: Any) async throws -> Any {
        var params: [Any] = []
        params.append(slot)
        return try await call("getBlockTime", params: params)
    }

    /// Returns a list of confirmed blocks between two slots
    public func getBlocks(startSlot: Any, endSlot: Any? = nil, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(startSlot)
        if let v = endSlot { params.append(v) }
        if let v = config { params.append(v) }
        return try await call("getBlocks", params: params)
    }

    /// Returns a list of confirmed blocks starting at the given slot
    public func getBlocksWithLimit(startSlot: Any, limit: Int64, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(startSlot)
        params.append(limit)
        if let v = config { params.append(v) }
        return try await call("getBlocksWithLimit", params: params)
    }

    /// Returns information about all the nodes participating in the cluster
    public func getClusterNodes() async throws -> Any {
        var params: [Any] = []
        return try await call("getClusterNodes", params: params)
    }

    /// Returns information about the current epoch
    public func getEpochInfo(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getEpochInfo", params: params)
    }

    /// Returns the epoch schedule information from this cluster's genesis config
    public func getEpochSchedule() async throws -> Any {
        var params: [Any] = []
        return try await call("getEpochSchedule", params: params)
    }

    /// Returns the fee the network will charge for a particular message
    public func getFeeForMessage(message: String, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(message)
        if let v = config { params.append(v) }
        return try await call("getFeeForMessage", params: params)
    }

    /// Returns the slot of the lowest confirmed block that has not been purged from the ledger
    public func getFirstAvailableBlock() async throws -> Any {
        var params: [Any] = []
        return try await call("getFirstAvailableBlock", params: params)
    }

    /// Returns the genesis hash
    public func getGenesisHash() async throws -> Any {
        var params: [Any] = []
        return try await call("getGenesisHash", params: params)
    }

    /// Returns the current health of the node
    public func getHealth() async throws -> Any {
        var params: [Any] = []
        return try await call("getHealth", params: params)
    }

    /// Returns the highest slot information that the node has snapshots for
    public func getHighestSnapshotSlot() async throws -> Any {
        var params: [Any] = []
        return try await call("getHighestSnapshotSlot", params: params)
    }

    /// Returns the identity pubkey for the current node
    public func getIdentity() async throws -> Any {
        var params: [Any] = []
        return try await call("getIdentity", params: params)
    }

    /// Returns the current inflation governor
    public func getInflationGovernor(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getInflationGovernor", params: params)
    }

    /// Returns the specific inflation values for the current epoch
    public func getInflationRate() async throws -> Any {
        var params: [Any] = []
        return try await call("getInflationRate", params: params)
    }

    /// Returns the inflation / staking reward for a list of addresses for an epoch
    public func getInflationReward(addresses: [Any], config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(addresses)
        if let v = config { params.append(v) }
        return try await call("getInflationReward", params: params)
    }

    /// Returns the 20 largest accounts, by lamport balance
    public func getLargestAccounts(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getLargestAccounts", params: params)
    }

    /// Returns the latest blockhash
    public func getLatestBlockhash(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getLatestBlockhash", params: params)
    }

    /// Returns the leader schedule for an epoch
    public func getLeaderSchedule(slot: Any? = nil, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = slot { params.append(v) }
        if let v = config { params.append(v) }
        return try await call("getLeaderSchedule", params: params)
    }

    /// Get the max slot seen from retransmit stage
    public func getMaxRetransmitSlot() async throws -> Any {
        var params: [Any] = []
        return try await call("getMaxRetransmitSlot", params: params)
    }

    /// Get the max slot seen from after shred insert
    public func getMaxShredInsertSlot() async throws -> Any {
        var params: [Any] = []
        return try await call("getMaxShredInsertSlot", params: params)
    }

    /// Returns minimum balance required to make account rent exempt
    public func getMinimumBalanceForRentExemption(dataLength: Int64, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(dataLength)
        if let v = config { params.append(v) }
        return try await call("getMinimumBalanceForRentExemption", params: params)
    }

    /// Returns the account information for a list of Pubkeys
    public func getMultipleAccounts(pubkeys: [Any], config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(pubkeys)
        if let v = config { params.append(v) }
        return try await call("getMultipleAccounts", params: params)
    }

    /// Returns all accounts owned by the provided program Pubkey
    public func getProgramAccounts(programId: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(programId)
        if let v = config { params.append(v) }
        return try await call("getProgramAccounts", params: params)
    }

    /// Returns a list of recent performance samples
    public func getRecentPerformanceSamples(limit: Int64? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = limit { params.append(v) }
        return try await call("getRecentPerformanceSamples", params: params)
    }

    /// Returns a list of prioritization fees from recent blocks
    public func getRecentPrioritizationFees(addresses: [Any]? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = addresses { params.append(v) }
        return try await call("getRecentPrioritizationFees", params: params)
    }

    /// Returns the statuses of a list of signatures
    public func getSignatureStatuses(signatures: [Any], config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(signatures)
        if let v = config { params.append(v) }
        return try await call("getSignatureStatuses", params: params)
    }

    /// Returns signatures for confirmed transactions that include the given address
    public func getSignaturesForAddress(address: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(address)
        if let v = config { params.append(v) }
        return try await call("getSignaturesForAddress", params: params)
    }

    /// Returns the slot that has reached the given or default commitment level
    public func getSlot(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getSlot", params: params)
    }

    /// Returns the current slot leader
    public func getSlotLeader(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getSlotLeader", params: params)
    }

    /// Returns the slot leaders for a given slot range
    public func getSlotLeaders(startSlot: Any, limit: Int64) async throws -> Any {
        var params: [Any] = []
        params.append(startSlot)
        params.append(limit)
        return try await call("getSlotLeaders", params: params)
    }

    /// Returns the stake minimum delegation, in lamports
    public func getStakeMinimumDelegation(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getStakeMinimumDelegation", params: params)
    }

    /// Returns information about the current supply
    public func getSupply(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getSupply", params: params)
    }

    /// Returns the token balance of an SPL Token account
    public func getTokenAccountBalance(pubkey: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(pubkey)
        if let v = config { params.append(v) }
        return try await call("getTokenAccountBalance", params: params)
    }

    /// Returns all SPL Token accounts by approved Delegate
    public func getTokenAccountsByDelegate(delegate: Any, filter: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(delegate)
        params.append(filter)
        if let v = config { params.append(v) }
        return try await call("getTokenAccountsByDelegate", params: params)
    }

    /// Returns all SPL Token accounts by token owner
    public func getTokenAccountsByOwner(owner: Any, filter: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(owner)
        params.append(filter)
        if let v = config { params.append(v) }
        return try await call("getTokenAccountsByOwner", params: params)
    }

    /// Returns the 20 largest accounts of a particular SPL Token type
    public func getTokenLargestAccounts(mint: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(mint)
        if let v = config { params.append(v) }
        return try await call("getTokenLargestAccounts", params: params)
    }

    /// Returns the total supply of an SPL Token type
    public func getTokenSupply(mint: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(mint)
        if let v = config { params.append(v) }
        return try await call("getTokenSupply", params: params)
    }

    /// Returns transaction details for a confirmed transaction
    public func getTransaction(signature: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(signature)
        if let v = config { params.append(v) }
        return try await call("getTransaction", params: params)
    }

    /// Returns the current Transaction count from the ledger
    public func getTransactionCount(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getTransactionCount", params: params)
    }

    /// Returns the current Solana version running on the node
    public func getVersion() async throws -> Any {
        var params: [Any] = []
        return try await call("getVersion", params: params)
    }

    /// Returns the account info and associated stake for all the voting accounts in the current bank
    public func getVoteAccounts(config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        if let v = config { params.append(v) }
        return try await call("getVoteAccounts", params: params)
    }

    /// Returns whether a blockhash is still valid or not
    public func isBlockhashValid(blockhash: Any, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(blockhash)
        if let v = config { params.append(v) }
        return try await call("isBlockhashValid", params: params)
    }

    /// Returns the lowest slot that the node has information about in its ledger
    public func minimumLedgerSlot() async throws -> Any {
        var params: [Any] = []
        return try await call("minimumLedgerSlot", params: params)
    }

    /// Requests an airdrop of lamports to a Pubkey
    public func requestAirdrop(pubkey: Any, lamports: Int64, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(pubkey)
        params.append(lamports)
        if let v = config { params.append(v) }
        return try await call("requestAirdrop", params: params)
    }

    /// Submits a signed transaction to the cluster for processing
    public func sendTransaction(transaction: String, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(transaction)
        if let v = config { params.append(v) }
        return try await call("sendTransaction", params: params)
    }

    /// Simulate sending a transaction
    public func simulateTransaction(transaction: String, config: Any? = nil) async throws -> Any {
        var params: [Any] = []
        params.append(transaction)
        if let v = config { params.append(v) }
        return try await call("simulateTransaction", params: params)
    }

}