// Rust Client Tests
// Run: cargo test

#[cfg(test)]
mod tests {
    use solana_rpc_client::{SolanaRpcClient, DEVNET};

    const TEST_PUBKEY: &str = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";

    fn client() -> SolanaRpcClient {
        SolanaRpcClient::new(DEVNET)
    }

    #[tokio::test]
    async fn test_get_version() {
        let result = client().get_version().await;
        assert!(result.is_ok(), "get_version failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_health() {
        let result = client().get_health().await;
        assert!(result.is_ok(), "get_health failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_slot() {
        let result = client().get_slot(None).await;
        assert!(result.is_ok(), "get_slot failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_block_height() {
        let result = client().get_block_height(None).await;
        assert!(result.is_ok(), "get_block_height failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_epoch_info() {
        let result = client().get_epoch_info(None).await;
        assert!(result.is_ok(), "get_epoch_info failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_balance() {
        let result = client().get_balance(TEST_PUBKEY.to_string(), None).await;
        assert!(result.is_ok(), "get_balance failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_account_info() {
        let result = client().get_account_info(TEST_PUBKEY.to_string(), None).await;
        assert!(result.is_ok(), "get_account_info failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_latest_blockhash() {
        let result = client().get_latest_blockhash(None).await;
        assert!(result.is_ok(), "get_latest_blockhash failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_genesis_hash() {
        let result = client().get_genesis_hash().await;
        assert!(result.is_ok(), "get_genesis_hash failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_supply() {
        let result = client().get_supply(None).await;
        assert!(result.is_ok(), "get_supply failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_get_recent_prioritization_fees() {
        let result = client().get_recent_prioritization_fees(None).await;
        assert!(result.is_ok(), "get_recent_prioritization_fees failed: {:?}", result.err());
    }

    #[tokio::test]
    async fn test_invalid_pubkey() {
        let result = client().get_balance("invalid".to_string(), None).await;
        assert!(result.is_err(), "Expected error for invalid pubkey");
    }
}
