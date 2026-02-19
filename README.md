# Solana RPC Client Generator

[![Generate & Test](https://github.com/solana-clawd/solana-rpc-client-generator/actions/workflows/generate.yml/badge.svg)](https://github.com/solana-clawd/solana-rpc-client-generator/actions)

Generate type-safe Solana RPC clients from an OpenRPC specification. Supports **10 programming languages** out of the box.

## Supported Languages

| Language | Package Manager | Status |
|----------|-----------------|--------|
| TypeScript/JavaScript | npm | ✅ Tested |
| Python | pip | ✅ Tested |
| Go | go mod | ✅ Compiles |
| Rust | cargo | ✅ Compiles |
| Java | maven | ✅ Compiles |
| C# | nuget | ✅ Compiles |
| Kotlin | gradle | ✅ Generated |
| Swift | SPM | ✅ Generated |
| PHP | composer | ✅ Generated |
| Ruby | gem | ✅ Generated |

## Quick Start

### Generate All Languages

```bash
git clone https://github.com/solana-clawd/solana-rpc-client-generator
cd solana-rpc-client-generator
npm install
npm run generate
```

### Generate Specific Languages

```bash
# Using npm scripts
npm run generate:typescript
npm run generate:python
npm run generate:go

# Or using the CLI
npx ts-node --esm bin/cli.ts --lang typescript,python,go
npx ts-node --esm bin/cli.ts --all
```

## Usage Examples

### TypeScript

```typescript
import { createSolanaRpcClient, ENDPOINTS } from '@solana-rpc/client';

const client = createSolanaRpcClient(ENDPOINTS.DEVNET);

// Get account balance
const balance = await client.getBalance('YourPubkey...');
console.log('Balance:', balance.value / 1e9, 'SOL');

// Get current slot
const slot = await client.getSlot();

// Send transaction
const signature = await client.sendTransaction(serializedTx, {
  skipPreflight: false,
  preflightCommitment: 'confirmed'
});
```

### Python

```python
from solana_rpc_client import SolanaRpcClient, Endpoints

client = SolanaRpcClient(Endpoints.DEVNET)

# Get account balance
balance = client.get_balance("YourPubkey...")
print(f"Balance: {balance['value'] / 1e9} SOL")

# Get current slot
slot = client.get_slot()

# Get epoch info
epoch = client.get_epoch_info()
print(f"Epoch: {epoch['epoch']}")
```

### Go

```go
package main

import (
    "context"
    solana "github.com/solana-rpc/client"
)

func main() {
    client := solana.NewClient(solana.Devnet)
    ctx := context.Background()

    // Get account balance
    balance, _ := client.GetBalance(ctx, "YourPubkey...", nil)

    // Get current slot
    slot, _ := client.GetSlot(ctx, nil)

    // Get epoch info
    epoch, _ := client.GetEpochInfo(ctx, nil)
}
```

### Rust

```rust
use solana_rpc_client::{SolanaRpcClient, DEVNET};

#[tokio::main]
async fn main() -> Result<(), String> {
    let client = SolanaRpcClient::new(DEVNET);

    // Get account balance
    let balance = client.get_balance("YourPubkey...".to_string(), None).await?;

    // Get current slot
    let slot = client.get_slot(None).await?;

    Ok(())
}
```

### Java

```java
import com.solana.rpc.SolanaRpcClient;

public class Example {
    public static void main(String[] args) throws Exception {
        SolanaRpcClient client = new SolanaRpcClient(SolanaRpcClient.DEVNET);

        // Get account balance
        var balance = client.getBalance("YourPubkey...", null);

        // Get current slot
        var slot = client.getSlot(null);
    }
}
```

### C#

```csharp
using Solana.Rpc;

var client = new SolanaRpcClient(SolanaRpcClient.Devnet);

// Get account balance
var balance = await client.GetBalanceAsync("YourPubkey...");

// Get current slot
var slot = await client.GetSlotAsync();
```

### PHP

```php
<?php
use Solana\Rpc\SolanaRpcClient;

$client = new SolanaRpcClient(SolanaRpcClient::DEVNET);

// Get account balance
$balance = $client->getBalance("YourPubkey...");

// Get current slot
$slot = $client->getSlot();
```

### Ruby

```ruby
require 'solana_rpc_client'

client = Solana::RpcClient.new(Solana::RpcClient::DEVNET)

# Get account balance
balance = client.get_balance("YourPubkey...")

# Get current slot
slot = client.get_slot
```

### Swift

```swift
let client = SolanaRpcClient(endpoint: SolanaRpcClient.devnet)

// Get account balance
let balance = try await client.getBalance(pubkey: "YourPubkey...")

// Get current slot
let slot = try await client.getSlot()
```

### Kotlin

```kotlin
val client = SolanaRpcClient(SolanaRpcClient.DEVNET)

// Get account balance
val balance = client.getBalance("YourPubkey...")

// Get current slot
val slot = client.getSlot()
```

## Available RPC Methods (52)

<details>
<summary>Account Methods</summary>

- `getAccountInfo` - Get all account information
- `getBalance` - Get account balance in lamports
- `getMultipleAccounts` - Get multiple accounts at once
- `getProgramAccounts` - Get all accounts owned by a program
- `getLargestAccounts` - Get largest accounts by balance
</details>

<details>
<summary>Block Methods</summary>

- `getBlock` - Get block information
- `getBlockCommitment` - Get block commitment
- `getBlockHeight` - Get current block height
- `getBlockProduction` - Get block production stats
- `getBlockTime` - Get block timestamp
- `getBlocks` - Get confirmed blocks in range
- `getBlocksWithLimit` - Get blocks with limit
</details>

<details>
<summary>Transaction Methods</summary>

- `getTransaction` - Get transaction details
- `getSignatureStatuses` - Get signature statuses
- `getSignaturesForAddress` - Get signatures for address
- `getRecentPrioritizationFees` - Get recent priority fees
- `sendTransaction` - Submit a transaction
- `simulateTransaction` - Simulate a transaction
</details>

<details>
<summary>Epoch & Slot Methods</summary>

- `getEpochInfo` - Get current epoch info
- `getEpochSchedule` - Get epoch schedule
- `getSlot` - Get current slot
- `getSlotLeader` - Get current slot leader
- `getSlotLeaders` - Get slot leaders for range
</details>

<details>
<summary>Token Methods</summary>

- `getTokenAccountBalance` - Get SPL token balance
- `getTokenAccountsByDelegate` - Get token accounts by delegate
- `getTokenAccountsByOwner` - Get token accounts by owner
- `getTokenLargestAccounts` - Get largest token accounts
- `getTokenSupply` - Get token total supply
</details>

<details>
<summary>Cluster Methods</summary>

- `getClusterNodes` - Get cluster node info
- `getVoteAccounts` - Get vote accounts
- `getHealth` - Get node health
- `getVersion` - Get Solana version
- `getIdentity` - Get node identity
</details>

<details>
<summary>Other Methods</summary>

- `getFeeForMessage` - Get fee for message
- `getMinimumBalanceForRentExemption` - Get rent exempt minimum
- `getSupply` - Get supply info
- `getStakeMinimumDelegation` - Get minimum stake
- `getInflationGovernor` - Get inflation config
- `getInflationRate` - Get current inflation rate
- `getInflationReward` - Get staking rewards
- `getLatestBlockhash` - Get latest blockhash
- `getLeaderSchedule` - Get leader schedule
- `isBlockhashValid` - Check blockhash validity
- `requestAirdrop` - Request devnet/testnet airdrop
- And more...
</details>

## Project Structure

```
solana-rpc-client-generator/
├── spec/
│   └── solana-rpc.openrpc.json     # OpenRPC specification
├── scripts/
│   ├── generate-client.ts          # TypeScript generator
│   ├── generate-python.ts          # Python generator
│   ├── generate-go.ts              # Go generator
│   ├── generate-rust.ts            # Rust generator
│   ├── generate-java.ts            # Java generator
│   ├── generate-csharp.ts          # C# generator
│   ├── generate-php.ts             # PHP generator
│   ├── generate-ruby.ts            # Ruby generator
│   ├── generate-swift.ts           # Swift generator
│   └── generate-kotlin.ts          # Kotlin generator
├── bin/
│   └── cli.ts                      # CLI tool
├── examples/                       # Working examples for each language
├── generated/                      # Generated clients
│   ├── typescript/
│   ├── python/
│   ├── go/
│   ├── rust/
│   ├── java/
│   ├── csharp/
│   ├── php/
│   ├── ruby/
│   ├── swift/
│   └── kotlin/
└── .github/workflows/              # CI/CD
```

## Customization

### Adding New Methods

1. Edit `spec/solana-rpc.openrpc.json`
2. Add the method definition following the OpenRPC spec
3. Run `npm run generate` to regenerate all clients

### Creating a New Language Generator

1. Create `scripts/generate-yourlang.ts`
2. Follow the pattern of existing generators
3. Add to `package.json` scripts
4. Add example in `examples/yourlang/`

## OpenRPC Specification

The specification follows [OpenRPC 1.2.6](https://spec.open-rpc.org/) and is based on the official [Solana RPC documentation](https://solana.com/docs/rpc).

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Update the spec if adding methods
4. Regenerate clients
5. Test your changes
6. Submit a PR

## License

MIT

## Links

- [Solana RPC Documentation](https://solana.com/docs/rpc)
- [OpenRPC Specification](https://spec.open-rpc.org/)
- [GitHub Repository](https://github.com/solana-clawd/solana-rpc-client-generator)
