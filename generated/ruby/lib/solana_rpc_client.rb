# frozen_string_literal: true

require "net/http"
require "json"
require "uri"

module Solana
  # Auto-generated Solana RPC Client
  class RpcClient
    MAINNET_BETA = "https://api.mainnet-beta.solana.com"
    DEVNET = "https://api.devnet.solana.com"
    TESTNET = "https://api.testnet.solana.com"

    def initialize(endpoint = MAINNET_BETA)
      @endpoint = URI.parse(endpoint)
      @request_id = 0
    end

    private

    def call(method, params)
      @request_id += 1
      request = {
        jsonrpc: "2.0",
        id: @request_id,
        method: method,
        params: params
      }

      http = Net::HTTP.new(@endpoint.host, @endpoint.port)
      http.use_ssl = @endpoint.scheme == "https"

      req = Net::HTTP::Post.new(@endpoint.path.empty? ? "/" : @endpoint.path)
      req["Content-Type"] = "application/json"
      req.body = request.to_json

      response = http.request(req)
      result = JSON.parse(response.body)

      if result["error"]
        raise "RPC Error #{result['error']['code']}: #{result['error']['message']}"
      end

      result["result"]
    end

    public

    # Returns all information associated with the account of provided Pubkey
    def get_account_info(pubkey, config: nil)
      params = []
      params << pubkey
      params << config unless config.nil?
      call("getAccountInfo", params)
    end

    # Returns the lamport balance of the account of provided Pubkey
    def get_balance(pubkey, config: nil)
      params = []
      params << pubkey
      params << config unless config.nil?
      call("getBalance", params)
    end

    # Returns identity and transaction information about a confirmed block in the ledger
    def get_block(slot, config: nil)
      params = []
      params << slot
      params << config unless config.nil?
      call("getBlock", params)
    end

    # Returns commitment for particular block
    def get_block_commitment(slot)
      params = []
      params << slot
      call("getBlockCommitment", params)
    end

    # Returns the current block height of the node
    def get_block_height(config: nil)
      params = []
      params << config unless config.nil?
      call("getBlockHeight", params)
    end

    # Returns recent block production information from the current or previous epoch
    def get_block_production(config: nil)
      params = []
      params << config unless config.nil?
      call("getBlockProduction", params)
    end

    # Returns the estimated production time of a block
    def get_block_time(slot)
      params = []
      params << slot
      call("getBlockTime", params)
    end

    # Returns a list of confirmed blocks between two slots
    def get_blocks(startSlot, endSlot: nil, config: nil)
      params = []
      params << startSlot
      params << endSlot unless endSlot.nil?
      params << config unless config.nil?
      call("getBlocks", params)
    end

    # Returns a list of confirmed blocks starting at the given slot
    def get_blocks_with_limit(startSlot, limit, config: nil)
      params = []
      params << startSlot
      params << limit
      params << config unless config.nil?
      call("getBlocksWithLimit", params)
    end

    # Returns information about all the nodes participating in the cluster
    def get_cluster_nodes()
      params = []
      call("getClusterNodes", params)
    end

    # Returns information about the current epoch
    def get_epoch_info(config: nil)
      params = []
      params << config unless config.nil?
      call("getEpochInfo", params)
    end

    # Returns the epoch schedule information from this cluster's genesis config
    def get_epoch_schedule()
      params = []
      call("getEpochSchedule", params)
    end

    # Returns the fee the network will charge for a particular message
    def get_fee_for_message(message, config: nil)
      params = []
      params << message
      params << config unless config.nil?
      call("getFeeForMessage", params)
    end

    # Returns the slot of the lowest confirmed block that has not been purged from the ledger
    def get_first_available_block()
      params = []
      call("getFirstAvailableBlock", params)
    end

    # Returns the genesis hash
    def get_genesis_hash()
      params = []
      call("getGenesisHash", params)
    end

    # Returns the current health of the node
    def get_health()
      params = []
      call("getHealth", params)
    end

    # Returns the highest slot information that the node has snapshots for
    def get_highest_snapshot_slot()
      params = []
      call("getHighestSnapshotSlot", params)
    end

    # Returns the identity pubkey for the current node
    def get_identity()
      params = []
      call("getIdentity", params)
    end

    # Returns the current inflation governor
    def get_inflation_governor(config: nil)
      params = []
      params << config unless config.nil?
      call("getInflationGovernor", params)
    end

    # Returns the specific inflation values for the current epoch
    def get_inflation_rate()
      params = []
      call("getInflationRate", params)
    end

    # Returns the inflation / staking reward for a list of addresses for an epoch
    def get_inflation_reward(addresses, config: nil)
      params = []
      params << addresses
      params << config unless config.nil?
      call("getInflationReward", params)
    end

    # Returns the 20 largest accounts, by lamport balance
    def get_largest_accounts(config: nil)
      params = []
      params << config unless config.nil?
      call("getLargestAccounts", params)
    end

    # Returns the latest blockhash
    def get_latest_blockhash(config: nil)
      params = []
      params << config unless config.nil?
      call("getLatestBlockhash", params)
    end

    # Returns the leader schedule for an epoch
    def get_leader_schedule(slot: nil, config: nil)
      params = []
      params << slot unless slot.nil?
      params << config unless config.nil?
      call("getLeaderSchedule", params)
    end

    # Get the max slot seen from retransmit stage
    def get_max_retransmit_slot()
      params = []
      call("getMaxRetransmitSlot", params)
    end

    # Get the max slot seen from after shred insert
    def get_max_shred_insert_slot()
      params = []
      call("getMaxShredInsertSlot", params)
    end

    # Returns minimum balance required to make account rent exempt
    def get_minimum_balance_for_rent_exemption(dataLength, config: nil)
      params = []
      params << dataLength
      params << config unless config.nil?
      call("getMinimumBalanceForRentExemption", params)
    end

    # Returns the account information for a list of Pubkeys
    def get_multiple_accounts(pubkeys, config: nil)
      params = []
      params << pubkeys
      params << config unless config.nil?
      call("getMultipleAccounts", params)
    end

    # Returns all accounts owned by the provided program Pubkey
    def get_program_accounts(programId, config: nil)
      params = []
      params << programId
      params << config unless config.nil?
      call("getProgramAccounts", params)
    end

    # Returns a list of recent performance samples
    def get_recent_performance_samples(limit: nil)
      params = []
      params << limit unless limit.nil?
      call("getRecentPerformanceSamples", params)
    end

    # Returns a list of prioritization fees from recent blocks
    def get_recent_prioritization_fees(addresses: nil)
      params = []
      params << addresses unless addresses.nil?
      call("getRecentPrioritizationFees", params)
    end

    # Returns the statuses of a list of signatures
    def get_signature_statuses(signatures, config: nil)
      params = []
      params << signatures
      params << config unless config.nil?
      call("getSignatureStatuses", params)
    end

    # Returns signatures for confirmed transactions that include the given address
    def get_signatures_for_address(address, config: nil)
      params = []
      params << address
      params << config unless config.nil?
      call("getSignaturesForAddress", params)
    end

    # Returns the slot that has reached the given or default commitment level
    def get_slot(config: nil)
      params = []
      params << config unless config.nil?
      call("getSlot", params)
    end

    # Returns the current slot leader
    def get_slot_leader(config: nil)
      params = []
      params << config unless config.nil?
      call("getSlotLeader", params)
    end

    # Returns the slot leaders for a given slot range
    def get_slot_leaders(startSlot, limit)
      params = []
      params << startSlot
      params << limit
      call("getSlotLeaders", params)
    end

    # Returns the stake minimum delegation, in lamports
    def get_stake_minimum_delegation(config: nil)
      params = []
      params << config unless config.nil?
      call("getStakeMinimumDelegation", params)
    end

    # Returns information about the current supply
    def get_supply(config: nil)
      params = []
      params << config unless config.nil?
      call("getSupply", params)
    end

    # Returns the token balance of an SPL Token account
    def get_token_account_balance(pubkey, config: nil)
      params = []
      params << pubkey
      params << config unless config.nil?
      call("getTokenAccountBalance", params)
    end

    # Returns all SPL Token accounts by approved Delegate
    def get_token_accounts_by_delegate(delegate, filter, config: nil)
      params = []
      params << delegate
      params << filter
      params << config unless config.nil?
      call("getTokenAccountsByDelegate", params)
    end

    # Returns all SPL Token accounts by token owner
    def get_token_accounts_by_owner(owner, filter, config: nil)
      params = []
      params << owner
      params << filter
      params << config unless config.nil?
      call("getTokenAccountsByOwner", params)
    end

    # Returns the 20 largest accounts of a particular SPL Token type
    def get_token_largest_accounts(mint, config: nil)
      params = []
      params << mint
      params << config unless config.nil?
      call("getTokenLargestAccounts", params)
    end

    # Returns the total supply of an SPL Token type
    def get_token_supply(mint, config: nil)
      params = []
      params << mint
      params << config unless config.nil?
      call("getTokenSupply", params)
    end

    # Returns transaction details for a confirmed transaction
    def get_transaction(signature, config: nil)
      params = []
      params << signature
      params << config unless config.nil?
      call("getTransaction", params)
    end

    # Returns the current Transaction count from the ledger
    def get_transaction_count(config: nil)
      params = []
      params << config unless config.nil?
      call("getTransactionCount", params)
    end

    # Returns the current Solana version running on the node
    def get_version()
      params = []
      call("getVersion", params)
    end

    # Returns the account info and associated stake for all the voting accounts in the current bank
    def get_vote_accounts(config: nil)
      params = []
      params << config unless config.nil?
      call("getVoteAccounts", params)
    end

    # Returns whether a blockhash is still valid or not
    def is_blockhash_valid(blockhash, config: nil)
      params = []
      params << blockhash
      params << config unless config.nil?
      call("isBlockhashValid", params)
    end

    # Returns the lowest slot that the node has information about in its ledger
    def minimum_ledger_slot()
      params = []
      call("minimumLedgerSlot", params)
    end

    # Requests an airdrop of lamports to a Pubkey
    def request_airdrop(pubkey, lamports, config: nil)
      params = []
      params << pubkey
      params << lamports
      params << config unless config.nil?
      call("requestAirdrop", params)
    end

    # Submits a signed transaction to the cluster for processing
    def send_transaction(transaction, config: nil)
      params = []
      params << transaction
      params << config unless config.nil?
      call("sendTransaction", params)
    end

    # Simulate sending a transaction
    def simulate_transaction(transaction, config: nil)
      params = []
      params << transaction
      params << config unless config.nil?
      call("simulateTransaction", params)
    end

  end
end