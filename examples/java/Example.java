/**
 * Java Example - Solana RPC Client
 * 
 * Compile & Run:
 *   javac -cp .:gson-2.10.1.jar Example.java
 *   java -cp .:gson-2.10.1.jar Example
 */

import com.solana.rpc.SolanaRpcClient;
import com.google.gson.JsonElement;

public class Example {
    public static void main(String[] args) throws Exception {
        SolanaRpcClient client = new SolanaRpcClient(SolanaRpcClient.DEVNET);

        // Get cluster version
        JsonElement version = client.getVersion();
        System.out.println("Solana Version: " + version);

        // Get current slot
        JsonElement slot = client.getSlot(null);
        System.out.println("Current Slot: " + slot);

        // Get epoch info
        JsonElement epochInfo = client.getEpochInfo(null);
        System.out.println("Epoch Info: " + epochInfo);

        // Get account balance
        String pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
        JsonElement balance = client.getBalance(pubkey, null);
        System.out.println("Balance: " + balance);

        // Get recent prioritization fees
        JsonElement fees = client.getRecentPrioritizationFees(null);
        System.out.println("Recent Fees: " + fees);
    }
}
