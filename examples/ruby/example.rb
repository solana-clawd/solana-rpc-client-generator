# Ruby Example - Solana RPC Client
#
# Run: ruby example.rb

$LOAD_PATH.unshift(File.join(__dir__, '../../generated/ruby/lib'))
require 'solana_rpc_client'

client = Solana::RpcClient.new(Solana::RpcClient::DEVNET)

# Get cluster version
version = client.get_version
puts "Solana Version: #{version['solana-core']}"

# Get current slot
slot = client.get_slot
puts "Current Slot: #{slot}"

# Get epoch info
epoch_info = client.get_epoch_info
puts "Epoch: #{epoch_info['epoch']}"
puts "Progress: #{epoch_info['slotIndex']}/#{epoch_info['slotsInEpoch']}"

# Get account balance
pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
balance = client.get_balance(pubkey)
puts "Balance: #{balance['value'] / 1e9} SOL"

# Get recent prioritization fees
fees = client.get_recent_prioritization_fees
puts "Recent Fee Samples: #{fees.length}"
