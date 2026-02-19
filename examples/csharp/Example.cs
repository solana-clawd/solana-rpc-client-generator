// C# Example - Solana RPC Client
//
// Run: dotnet run

using Solana.Rpc;
using System.Text.Json;

class Example
{
    static async Task Main()
    {
        var client = new SolanaRpcClient(SolanaRpcClient.Devnet);

        // Get cluster version
        var version = await client.GetVersionAsync();
        Console.WriteLine($"Solana Version: {version}");

        // Get current slot
        var slot = await client.GetSlotAsync();
        Console.WriteLine($"Current Slot: {slot}");

        // Get epoch info
        var epochInfo = await client.GetEpochInfoAsync();
        Console.WriteLine($"Epoch Info: {epochInfo}");

        // Get account balance
        var pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
        var balance = await client.GetBalanceAsync(pubkey);
        Console.WriteLine($"Balance: {balance}");

        // Get recent prioritization fees
        var fees = await client.GetRecentPrioritizationFeesAsync();
        Console.WriteLine($"Recent Fees: {fees}");
    }
}
