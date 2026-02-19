/**
 * TypeScript Example - Solana RPC Client
 * 
 * Run: npx ts-node example.ts
 */

import { createSolanaRpcClient, ENDPOINTS } from '../../generated/typescript/index.js';

async function main() {
  // Create client (defaults to mainnet)
  const client = createSolanaRpcClient(ENDPOINTS.DEVNET);

  // Get cluster version
  const version = await client.getVersion();
  console.log('Solana Version:', version['solana-core']);

  // Get current slot
  const slot = await client.getSlot();
  console.log('Current Slot:', slot);

  // Get epoch info
  const epochInfo = await client.getEpochInfo();
  console.log('Epoch:', epochInfo.epoch);
  console.log('Progress:', `${epochInfo.slotIndex}/${epochInfo.slotsInEpoch}`);

  // Get account balance
  const pubkey = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';
  const balance = await client.getBalance(pubkey);
  console.log('Balance:', balance.value / 1e9, 'SOL');

  // Get account info
  const account = await client.getAccountInfo(pubkey, { encoding: 'base64' });
  console.log('Account Owner:', account.value?.owner);

  // Get recent prioritization fees
  const fees = await client.getRecentPrioritizationFees();
  console.log('Recent Fee Samples:', fees.length);
}

main().catch(console.error);
