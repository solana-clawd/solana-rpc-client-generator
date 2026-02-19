<?php
/**
 * PHP Example - Solana RPC Client
 * 
 * Run: php example.php
 */

require_once __DIR__ . '/../../generated/php/src/SolanaRpcClient.php';

use Solana\Rpc\SolanaRpcClient;

$client = new SolanaRpcClient(SolanaRpcClient::DEVNET);

// Get cluster version
$version = $client->getVersion();
echo "Solana Version: " . $version['solana-core'] . "\n";

// Get current slot
$slot = $client->getSlot();
echo "Current Slot: $slot\n";

// Get epoch info
$epochInfo = $client->getEpochInfo();
echo "Epoch: " . $epochInfo['epoch'] . "\n";
echo "Progress: " . $epochInfo['slotIndex'] . "/" . $epochInfo['slotsInEpoch'] . "\n";

// Get account balance
$pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
$balance = $client->getBalance($pubkey);
echo "Balance: " . ($balance['value'] / 1e9) . " SOL\n";

// Get recent prioritization fees
$fees = $client->getRecentPrioritizationFees();
echo "Recent Fee Samples: " . count($fees) . "\n";
