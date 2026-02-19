#!/usr/bin/env ts-node
/**
 * Test the generated Solana RPC client
 */

import { createSolanaRpcClient, ENDPOINTS } from '../generated/typescript/index.js';

async function main() {
  console.log('Testing Solana RPC Client...\n');

  const client = createSolanaRpcClient(ENDPOINTS.DEVNET);

  // Test getVersion
  console.log('1. Testing getVersion...');
  const version = await client.getVersion();
  console.log('   Solana version:', version['solana-core']);

  // Test getSlot
  console.log('\n2. Testing getSlot...');
  const slot = await client.getSlot();
  console.log('   Current slot:', slot);

  // Test getEpochInfo
  console.log('\n3. Testing getEpochInfo...');
  const epochInfo = await client.getEpochInfo();
  console.log('   Epoch:', epochInfo.epoch);
  console.log('   Slot index:', epochInfo.slotIndex, '/', epochInfo.slotsInEpoch);

  // Test getBalance
  console.log('\n4. Testing getBalance...');
  const testPubkey = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';
  const balance = await client.getBalance(testPubkey);
  console.log('   Balance:', balance.value / 1e9, 'SOL');

  // Test getAccountInfo
  console.log('\n5. Testing getAccountInfo...');
  const accountInfo = await client.getAccountInfo(testPubkey, {
    encoding: 'base64'
  });
  console.log('   Owner:', accountInfo.value?.owner);
  console.log('   Lamports:', accountInfo.value?.lamports);

  // Test getRecentPrioritizationFees
  console.log('\n6. Testing getRecentPrioritizationFees...');
  const fees = await client.getRecentPrioritizationFees();
  console.log('   Got', fees.length, 'fee samples');
  if (fees.length > 0) {
    console.log('   Latest fee:', fees[0].prioritizationFee, 'micro-lamports');
  }

  // Test getHealth
  console.log('\n7. Testing getHealth...');
  const health = await client.getHealth();
  console.log('   Health status:', health);

  console.log('\n✅ All tests passed!');
}

main().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
