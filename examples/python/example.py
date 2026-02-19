"""
Python Example - Solana RPC Client

Run: python example.py
"""

import sys
sys.path.insert(0, '../../generated/python')

from solana_rpc_client import SolanaRpcClient, Endpoints

def main():
    # Create client
    client = SolanaRpcClient(Endpoints.DEVNET)

    # Get cluster version
    version = client.get_version()
    print(f"Solana Version: {version['solana-core']}")

    # Get current slot
    slot = client.get_slot()
    print(f"Current Slot: {slot}")

    # Get epoch info
    epoch_info = client.get_epoch_info()
    print(f"Epoch: {epoch_info['epoch']}")
    print(f"Progress: {epoch_info['slotIndex']}/{epoch_info['slotsInEpoch']}")

    # Get account balance
    pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
    balance = client.get_balance(pubkey)
    print(f"Balance: {balance['value'] / 1e9} SOL")

    # Get account info
    account = client.get_account_info(pubkey, {"encoding": "base64"})
    print(f"Account Owner: {account['value']['owner']}")

    # Get recent prioritization fees
    fees = client.get_recent_prioritization_fees()
    print(f"Recent Fee Samples: {len(fees)}")

if __name__ == "__main__":
    main()
