// Rust Example - Solana RPC Client
//
// Run: cargo run --example main

use solana_rpc_client::{SolanaRpcClient, DEVNET};

#[tokio::main]
async fn main() -> Result<(), String> {
    let client = SolanaRpcClient::new(DEVNET);

    // Get cluster version
    let version = client.get_version().await?;
    println!("Solana Version: {:?}", version);

    // Get current slot
    let slot = client.get_slot(None).await?;
    println!("Current Slot: {:?}", slot);

    // Get epoch info
    let epoch_info = client.get_epoch_info(None).await?;
    println!("Epoch Info: {:?}", epoch_info);

    // Get account balance
    let pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
    let balance = client.get_balance(pubkey.to_string(), None).await?;
    println!("Balance: {:?}", balance);

    // Get recent prioritization fees
    let fees = client.get_recent_prioritization_fees(None).await?;
    println!("Recent Fees: {:?}", fees);

    Ok(())
}
