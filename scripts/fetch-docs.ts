#!/usr/bin/env ts-node
/**
 * Fetches Solana RPC docs from GitHub and parses them into OpenRPC format
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/solana-foundation/developer-content/main/docs/rpc/http';

const HTTP_METHODS = [
  'getAccountInfo',
  'getBalance',
  'getBlock',
  'getBlockCommitment',
  'getBlockHeight',
  'getBlockProduction',
  'getBlockTime',
  'getBlocks',
  'getBlocksWithLimit',
  'getClusterNodes',
  'getEpochInfo',
  'getEpochSchedule',
  'getFeeForMessage',
  'getFirstAvailableBlock',
  'getGenesisHash',
  'getHealth',
  'getHighestSnapshotSlot',
  'getIdentity',
  'getInflationGovernor',
  'getInflationRate',
  'getInflationReward',
  'getLargestAccounts',
  'getLatestBlockhash',
  'getLeaderSchedule',
  'getMaxRetransmitSlot',
  'getMaxShredInsertSlot',
  'getMinimumBalanceForRentExemption',
  'getMultipleAccounts',
  'getProgramAccounts',
  'getRecentPerformanceSamples',
  'getRecentPrioritizationFees',
  'getSignatureStatuses',
  'getSignaturesForAddress',
  'getSlot',
  'getSlotLeader',
  'getSlotLeaders',
  'getStakeMinimumDelegation',
  'getSupply',
  'getTokenAccountBalance',
  'getTokenAccountsByDelegate',
  'getTokenAccountsByOwner',
  'getTokenLargestAccounts',
  'getTokenSupply',
  'getTransaction',
  'getTransactionCount',
  'getVersion',
  'getVoteAccounts',
  'isBlockhashValid',
  'minimumLedgerSlot',
  'requestAirdrop',
  'sendTransaction',
  'simulateTransaction',
];

interface RpcDoc {
  method: string;
  description: string;
  params: ParamInfo[];
  result: ResultInfo;
}

interface ParamInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
  fields?: FieldInfo[];
}

interface FieldInfo {
  name: string;
  type: string;
  optional: boolean;
  description: string;
}

interface ResultInfo {
  description: string;
  type: string;
}

async function fetchDoc(method: string): Promise<string | null> {
  const url = `${BASE_URL}/${method}.mdx`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    console.error(`Failed to fetch ${method}: ${e}`);
    return null;
  }
}

function extractDescription(mdx: string): string {
  // Get the first line after the frontmatter
  const lines = mdx.split('\n');
  let inFrontmatter = false;
  for (const line of lines) {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (!inFrontmatter && line.trim() && !line.startsWith('<')) {
      return line.trim();
    }
  }
  return '';
}

function parseType(typeStr: string): any {
  const typeMap: Record<string, any> = {
    'string': { type: 'string' },
    'bool': { type: 'boolean' },
    'boolean': { type: 'boolean' },
    'number': { type: 'number' },
    'u64': { type: 'integer' },
    'usize': { type: 'integer' },
    'i64': { type: 'integer' },
    'object': { type: 'object' },
    'array': { type: 'array' },
  };
  return typeMap[typeStr.toLowerCase()] || { type: 'string' };
}

async function main() {
  const docs: RpcDoc[] = [];
  
  console.log('Fetching Solana RPC documentation...\n');
  
  for (const method of HTTP_METHODS) {
    process.stdout.write(`  Fetching ${method}... `);
    const content = await fetchDoc(method);
    if (content) {
      const description = extractDescription(content);
      docs.push({
        method,
        description,
        params: [], // We'll use a simplified approach for now
        result: { description: '', type: 'object' }
      });
      console.log('✓');
    } else {
      console.log('✗');
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }
  
  // Save raw docs for reference
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(docsDir, 'methods.json'),
    JSON.stringify(docs, null, 2)
  );
  
  console.log(`\nFetched ${docs.length} methods`);
  console.log(`Saved to docs/methods.json`);
}

main().catch(console.error);
