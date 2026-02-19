// Swift Example - Solana RPC Client
//
// Run: swift Example.swift

import Foundation

// Note: In a real project, import the package:
// import SolanaRpcClient

@main
struct Example {
    static func main() async throws {
        let client = SolanaRpcClient(endpoint: SolanaRpcClient.devnet)

        // Get cluster version
        let version = try await client.getVersion()
        print("Solana Version: \(version)")

        // Get current slot
        let slot = try await client.getSlot()
        print("Current Slot: \(slot)")

        // Get epoch info
        let epochInfo = try await client.getEpochInfo()
        print("Epoch Info: \(epochInfo)")

        // Get account balance
        let pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
        let balance = try await client.getBalance(pubkey: pubkey)
        print("Balance: \(balance)")

        // Get recent prioritization fees
        let fees = try await client.getRecentPrioritizationFees()
        print("Recent Fees: \(fees)")
    }
}
