# Solana RPC Client Generator

Generate type-safe TypeScript/JavaScript clients for the Solana JSON-RPC API from an OpenRPC specification.

## Features

- 🔧 **OpenRPC Specification** - Complete Solana RPC spec with 52 methods and 62 type definitions
- 📦 **TypeScript Client** - Fully typed, auto-generated client
- 🚀 **Zero Dependencies** - Uses native `fetch` API
- 🔄 **Easy to Update** - Regenerate when the spec changes
- 📝 **Extensible** - Add custom methods or generators

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/solana-rpc-client-generator
cd solana-rpc-client-generator

# Install dependencies
npm install

# Generate the client
npm run generate

# Build the generated client
cd generated/typescript && npm run build
```

## Using the Generated Client

### Installation

```bash
# Copy to your project or publish to npm
cp -r generated/typescript your-project/solana-rpc-client
```

### Basic Usage

```typescript
import { createSolanaRpcClient, ENDPOINTS } from '@solana-rpc/client';

// Create a client for mainnet
const client = createSolanaRpcClient(ENDPOINTS.MAINNET_BETA);

// Or use a custom endpoint (like Helius)
const heliusClient = createSolanaRpcClient('https://mainnet.helius-rpc.com/?api-key=YOUR_KEY');

// Get account balance
const balance = await client.getBalance('vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg');
console.log('Balance:', balance.value / 1e9, 'SOL');

// Get account info with encoding
const account = await client.getAccountInfo('YourPubkey...', {
  encoding: 'base64',
  commitment: 'confirmed'
});

// Get current slot
const slot = await client.getSlot();

// Get epoch info
const epochInfo = await client.getEpochInfo();
console.log('Epoch:', epochInfo.epoch);
console.log('Progress:', epochInfo.slotIndex, '/', epochInfo.slotsInEpoch);

// Send transaction
const signature = await client.sendTransaction(serializedTx, {
  skipPreflight: false,
  preflightCommitment: 'confirmed'
});

// Get transaction status
const statuses = await client.getSignatureStatuses([signature]);
```

### Available Endpoints

```typescript
import { ENDPOINTS } from '@solana-rpc/client';

ENDPOINTS.MAINNET_BETA  // 'https://api.mainnet-beta.solana.com'
ENDPOINTS.DEVNET        // 'https://api.devnet.solana.com'
ENDPOINTS.TESTNET       // 'https://api.testnet.solana.com'
```

### Custom Configuration

```typescript
import { SolanaRpcClient } from '@solana-rpc/client';

const client = new SolanaRpcClient({
  endpoint: 'https://your-rpc.example.com',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  fetch: customFetchImplementation // Optional: for Node.js < 18 or custom fetch
});
```

### Error Handling

```typescript
import { SolanaRpcError } from '@solana-rpc/client';

try {
  const result = await client.getAccountInfo('invalid-pubkey');
} catch (err) {
  if (err instanceof SolanaRpcError) {
    console.error('RPC Error:', err.code, err.message, err.data);
  } else {
    console.error('HTTP Error:', err.message);
  }
}
```

## Available Methods (52)

### Account Methods
- `getAccountInfo` - Returns all information associated with the account of provided Pubkey
- `getBalance` - Returns the lamport balance of the account of provided Pubkey
- `getMultipleAccounts` - Returns the account information for a list of Pubkeys
- `getProgramAccounts` - Returns all accounts owned by the provided program Pubkey
- `getLargestAccounts` - Returns the 20 largest accounts, by lamport balance

### Block Methods
- `getBlock` - Returns identity and transaction information about a confirmed block
- `getBlockCommitment` - Returns commitment for particular block
- `getBlockHeight` - Returns the current block height of the node
- `getBlockProduction` - Returns recent block production information
- `getBlockTime` - Returns the estimated production time of a block
- `getBlocks` - Returns a list of confirmed blocks between two slots
- `getBlocksWithLimit` - Returns a list of confirmed blocks starting at the given slot

### Transaction Methods
- `getTransaction` - Returns transaction details for a confirmed transaction
- `getSignatureStatuses` - Returns the statuses of a list of signatures
- `getSignaturesForAddress` - Returns signatures for confirmed transactions
- `getRecentPrioritizationFees` - Returns prioritization fees from recent blocks
- `sendTransaction` - Submits a signed transaction to the cluster
- `simulateTransaction` - Simulate sending a transaction

### Epoch & Slot Methods
- `getEpochInfo` - Returns information about the current epoch
- `getEpochSchedule` - Returns the epoch schedule information
- `getSlot` - Returns the slot that has reached the commitment level
- `getSlotLeader` - Returns the current slot leader
- `getSlotLeaders` - Returns the slot leaders for a given slot range

### Token Methods
- `getTokenAccountBalance` - Returns the token balance of an SPL Token account
- `getTokenAccountsByDelegate` - Returns all SPL Token accounts by approved Delegate
- `getTokenAccountsByOwner` - Returns all SPL Token accounts by token owner
- `getTokenLargestAccounts` - Returns the 20 largest accounts of a particular SPL Token
- `getTokenSupply` - Returns the total supply of an SPL Token type

### Cluster Methods
- `getClusterNodes` - Returns information about all the nodes in the cluster
- `getVoteAccounts` - Returns the account info and stake for all voting accounts
- `getHealth` - Returns the current health of the node
- `getVersion` - Returns the current Solana version running on the node
- `getIdentity` - Returns the identity pubkey for the current node

### Fee & Supply Methods
- `getFeeForMessage` - Returns the fee for a particular message
- `getMinimumBalanceForRentExemption` - Returns minimum balance for rent exemption
- `getSupply` - Returns information about the current supply
- `getStakeMinimumDelegation` - Returns the stake minimum delegation

### Inflation Methods
- `getInflationGovernor` - Returns the current inflation governor
- `getInflationRate` - Returns the specific inflation values for the current epoch
- `getInflationReward` - Returns the inflation/staking reward for addresses

### Other Methods
- `getFirstAvailableBlock` - Returns the slot of the lowest confirmed block
- `getGenesisHash` - Returns the genesis hash
- `getHighestSnapshotSlot` - Returns highest slot info for snapshots
- `getLatestBlockhash` - Returns the latest blockhash
- `getLeaderSchedule` - Returns the leader schedule for an epoch
- `getMaxRetransmitSlot` - Get the max slot seen from retransmit stage
- `getMaxShredInsertSlot` - Get the max slot seen after shred insert
- `getRecentPerformanceSamples` - Returns a list of recent performance samples
- `getTransactionCount` - Returns the current Transaction count
- `isBlockhashValid` - Returns whether a blockhash is still valid
- `minimumLedgerSlot` - Returns the lowest slot with information
- `requestAirdrop` - Requests an airdrop of lamports to a Pubkey

## OpenRPC Specification

The specification file is located at `spec/solana-rpc.openrpc.json` and follows the [OpenRPC 1.2.6](https://spec.open-rpc.org/) standard.

### Updating the Spec

1. Edit `spec/solana-rpc.openrpc.json`
2. Run `npm run generate` to regenerate the client
3. Build with `cd generated/typescript && npm run build`

### Using the Official OpenRPC Generator

You can also use the official `@open-rpc/generator`:

```bash
npm run generate:openrpc
```

This will generate clients based on the `open-rpc-generator-config.json` configuration.

## Project Structure

```
solana-rpc-client-generator/
├── spec/
│   └── solana-rpc.openrpc.json    # OpenRPC specification
├── scripts/
│   ├── generate-client.ts          # Custom TypeScript generator
│   ├── fetch-docs.ts               # Tool to fetch RPC docs
│   └── test-client.ts              # Test script
├── generated/
│   └── typescript/                 # Generated TypeScript client
│       ├── types.ts                # Type definitions
│       ├── client.ts               # RPC client class
│       ├── index.ts                # Exports
│       └── package.json
├── open-rpc-generator-config.json  # Config for @open-rpc/generator
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Fetch latest RPC documentation (optional)
npm run fetch-docs

# Generate the TypeScript client
npm run generate

# Test the generated client
npm test

# Build the generated client
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Update the OpenRPC spec if adding new methods
4. Run the generator to update the client
5. Test your changes
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## References

- [Solana RPC Documentation](https://solana.com/docs/rpc)
- [OpenRPC Specification](https://spec.open-rpc.org/)
- [OpenRPC Generator](https://github.com/open-rpc/generator)
