/**
 * TypeScript Client Tests
 * Run: npx jest tests/typescript/
 */

import { createSolanaRpcClient, ENDPOINTS, SolanaRpcError } from '../../generated/typescript/index.js';

const client = createSolanaRpcClient(ENDPOINTS.DEVNET);
const TEST_PUBKEY = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';

describe('SolanaRpcClient', () => {
  describe('Cluster Methods', () => {
    test('getVersion returns solana-core version', async () => {
      const result = await client.getVersion();
      expect(result).toHaveProperty('solana-core');
      expect(typeof result['solana-core']).toBe('string');
    });

    test('getHealth returns ok/behind/unknown', async () => {
      const result = await client.getHealth();
      expect(['ok', 'behind', 'unknown']).toContain(result);
    });

    test('getIdentity returns identity pubkey', async () => {
      const result = await client.getIdentity();
      expect(result).toHaveProperty('identity');
      expect(typeof result.identity).toBe('string');
    });

    test('getClusterNodes returns array of nodes', async () => {
      const result = await client.getClusterNodes();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('pubkey');
    });
  });

  describe('Slot & Epoch Methods', () => {
    test('getSlot returns current slot number', async () => {
      const result = await client.getSlot();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('getBlockHeight returns block height', async () => {
      const result = await client.getBlockHeight();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('getEpochInfo returns epoch data', async () => {
      const result = await client.getEpochInfo();
      expect(result).toHaveProperty('epoch');
      expect(result).toHaveProperty('slotIndex');
      expect(result).toHaveProperty('slotsInEpoch');
      expect(result.epoch).toBeGreaterThan(0);
    });

    test('getEpochSchedule returns schedule', async () => {
      const result = await client.getEpochSchedule();
      expect(result).toHaveProperty('slotsPerEpoch');
      expect(result.slotsPerEpoch).toBeGreaterThan(0);
    });

    test('getSlotLeader returns pubkey', async () => {
      const result = await client.getSlotLeader();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(30);
    });
  });

  describe('Account Methods', () => {
    test('getBalance returns balance with context', async () => {
      const result = await client.getBalance(TEST_PUBKEY);
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('value');
      expect(typeof result.value).toBe('number');
    });

    test('getAccountInfo returns account data', async () => {
      const result = await client.getAccountInfo(TEST_PUBKEY);
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('value');
      expect(result.value).toHaveProperty('lamports');
      expect(result.value).toHaveProperty('owner');
    });

    test('getAccountInfo with encoding option', async () => {
      const result = await client.getAccountInfo(TEST_PUBKEY, { encoding: 'base64' });
      expect(result.value).toHaveProperty('data');
    });

    test('getMultipleAccounts returns array', async () => {
      const result = await client.getMultipleAccounts([TEST_PUBKEY]);
      expect(result).toHaveProperty('value');
      expect(Array.isArray(result.value)).toBe(true);
    });

    test('getLargestAccounts returns accounts', async () => {
      const result = await client.getLargestAccounts();
      expect(result).toHaveProperty('value');
      expect(Array.isArray(result.value)).toBe(true);
    });
  });

  describe('Block Methods', () => {
    test('getLatestBlockhash returns blockhash', async () => {
      const result = await client.getLatestBlockhash();
      expect(result).toHaveProperty('value');
      expect(result.value).toHaveProperty('blockhash');
      expect(result.value).toHaveProperty('lastValidBlockHeight');
    });

    test('isBlockhashValid checks validity', async () => {
      const { value: { blockhash } } = await client.getLatestBlockhash();
      const result = await client.isBlockhashValid(blockhash);
      expect(result).toHaveProperty('value');
      expect(typeof result.value).toBe('boolean');
    });

    test('getFirstAvailableBlock returns slot', async () => {
      const result = await client.getFirstAvailableBlock();
      expect(typeof result).toBe('number');
    });

    test('getGenesisHash returns hash', async () => {
      const result = await client.getGenesisHash();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(30);
    });
  });

  describe('Fee Methods', () => {
    test('getRecentPrioritizationFees returns array', async () => {
      const result = await client.getRecentPrioritizationFees();
      expect(Array.isArray(result)).toBe(true);
    });

    test('getMinimumBalanceForRentExemption returns lamports', async () => {
      const result = await client.getMinimumBalanceForRentExemption(100);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Supply & Inflation', () => {
    test('getSupply returns supply info', async () => {
      const result = await client.getSupply();
      expect(result).toHaveProperty('value');
      expect(result.value).toHaveProperty('total');
      expect(result.value).toHaveProperty('circulating');
    });

    test('getInflationRate returns rates', async () => {
      const result = await client.getInflationRate();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('validator');
      expect(result).toHaveProperty('epoch');
    });

    test('getInflationGovernor returns config', async () => {
      const result = await client.getInflationGovernor();
      expect(result).toHaveProperty('initial');
      expect(result).toHaveProperty('terminal');
    });
  });

  describe('Error Handling', () => {
    test('invalid pubkey throws error', async () => {
      await expect(client.getBalance('invalid')).rejects.toThrow();
    });

    test('error has code and message', async () => {
      try {
        await client.getBalance('invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(SolanaRpcError);
        expect((err as SolanaRpcError).code).toBeDefined();
        expect((err as SolanaRpcError).message).toBeDefined();
      }
    });
  });
});
