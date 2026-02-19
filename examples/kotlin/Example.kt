// Kotlin Example - Solana RPC Client
//
// Run: kotlinc Example.kt -include-runtime -d example.jar && java -jar example.jar

import com.solana.rpc.SolanaRpcClient

fun main() {
    val client = SolanaRpcClient(SolanaRpcClient.DEVNET)

    // Get cluster version
    val version = client.getVersion()
    println("Solana Version: $version")

    // Get current slot
    val slot = client.getSlot()
    println("Current Slot: $slot")

    // Get epoch info
    val epochInfo = client.getEpochInfo()
    println("Epoch Info: $epochInfo")

    // Get account balance
    val pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
    val balance = client.getBalance(pubkey)
    println("Balance: $balance")

    // Get recent prioritization fees
    val fees = client.getRecentPrioritizationFees()
    println("Recent Fees: $fees")
}
