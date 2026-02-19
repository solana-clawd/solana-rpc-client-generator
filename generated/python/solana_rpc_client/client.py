"""
Auto-generated Solana RPC Client
Solana JSON-RPC API v2.0.0
"""
from __future__ import annotations
import json
from typing import Any, Dict, List, Optional, Union
from dataclasses import asdict

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    import urllib.request
    HAS_HTTPX = False

from .types import *

class Endpoints:
    MAINNET_BETA = "https://api.mainnet-beta.solana.com"
    DEVNET = "https://api.devnet.solana.com"
    TESTNET = "https://api.testnet.solana.com"

class SolanaRpcError(Exception):
    """RPC Error from Solana node"""
    def __init__(self, code: int, message: str, data: Any = None):
        self.code = code
        self.message = message
        self.data = data
        super().__init__(f"RPC error {code}: {message}")

class SolanaRpcClient:
    """Solana JSON-RPC Client"""

    def __init__(self, endpoint: str = Endpoints.MAINNET_BETA, headers: Optional[Dict[str, str]] = None):
        self.endpoint = endpoint
        self.headers = {"Content-Type": "application/json", **(headers or {})}
        self._request_id = 0
        if HAS_HTTPX:
            self._client = httpx.Client(headers=self.headers)
        else:
            self._client = None

    def _call(self, method: str, params: List[Any]) -> Any:
        self._request_id += 1
        payload = {
            "jsonrpc": "2.0",
            "id": self._request_id,
            "method": method,
            "params": params,
        }

        if HAS_HTTPX:
            response = self._client.post(self.endpoint, json=payload)
            result = response.json()
        else:
            req = urllib.request.Request(
                self.endpoint,
                data=json.dumps(payload).encode(),
                headers=self.headers,
                method="POST"
            )
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode())

        if "error" in result and result["error"]:
            err = result["error"]
            raise SolanaRpcError(err.get("code", -1), err.get("message", "Unknown error"), err.get("data"))

        return result.get("result")

    def get_account_info(self, pubkey: Pubkey, config: Optional[GetAccountInfoConfig] = None) -> Any:
        """Returns all information associated with the account of provided Pubkey"""
        params = []
        params.append(pubkey)
        if config is not None:
            params.append(config)
        return self._call("getAccountInfo", params)

    def get_balance(self, pubkey: Pubkey, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the lamport balance of the account of provided Pubkey"""
        params = []
        params.append(pubkey)
        if config is not None:
            params.append(config)
        return self._call("getBalance", params)

    def get_block(self, slot: Slot, config: Optional[GetBlockConfig] = None) -> Any:
        """Returns identity and transaction information about a confirmed block in the ledger"""
        params = []
        params.append(slot)
        if config is not None:
            params.append(config)
        return self._call("getBlock", params)

    def get_block_commitment(self, slot: Slot) -> Any:
        """Returns commitment for particular block"""
        params = []
        params.append(slot)
        return self._call("getBlockCommitment", params)

    def get_block_height(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the current block height of the node"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getBlockHeight", params)

    def get_block_production(self, config: Optional[GetBlockProductionConfig] = None) -> Any:
        """Returns recent block production information from the current or previous epoch"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getBlockProduction", params)

    def get_block_time(self, slot: Slot) -> Any:
        """Returns the estimated production time of a block"""
        params = []
        params.append(slot)
        return self._call("getBlockTime", params)

    def get_blocks(self, start_slot: Slot, end_slot: Optional[Slot] = None, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns a list of confirmed blocks between two slots"""
        params = []
        params.append(start_slot)
        if end_slot is not None:
            params.append(end_slot)
        if config is not None:
            params.append(config)
        return self._call("getBlocks", params)

    def get_blocks_with_limit(self, start_slot: Slot, limit: int, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns a list of confirmed blocks starting at the given slot"""
        params = []
        params.append(start_slot)
        params.append(limit)
        if config is not None:
            params.append(config)
        return self._call("getBlocksWithLimit", params)

    def get_cluster_nodes(self) -> Any:
        """Returns information about all the nodes participating in the cluster"""
        params = []
        return self._call("getClusterNodes", params)

    def get_epoch_info(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns information about the current epoch"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getEpochInfo", params)

    def get_epoch_schedule(self) -> Any:
        """Returns the epoch schedule information from this cluster's genesis config"""
        params = []
        return self._call("getEpochSchedule", params)

    def get_fee_for_message(self, message: str, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the fee the network will charge for a particular message"""
        params = []
        params.append(message)
        if config is not None:
            params.append(config)
        return self._call("getFeeForMessage", params)

    def get_first_available_block(self) -> Any:
        """Returns the slot of the lowest confirmed block that has not been purged from the ledger"""
        params = []
        return self._call("getFirstAvailableBlock", params)

    def get_genesis_hash(self) -> Any:
        """Returns the genesis hash"""
        params = []
        return self._call("getGenesisHash", params)

    def get_health(self) -> Any:
        """Returns the current health of the node"""
        params = []
        return self._call("getHealth", params)

    def get_highest_snapshot_slot(self) -> Any:
        """Returns the highest slot information that the node has snapshots for"""
        params = []
        return self._call("getHighestSnapshotSlot", params)

    def get_identity(self) -> Any:
        """Returns the identity pubkey for the current node"""
        params = []
        return self._call("getIdentity", params)

    def get_inflation_governor(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the current inflation governor"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getInflationGovernor", params)

    def get_inflation_rate(self) -> Any:
        """Returns the specific inflation values for the current epoch"""
        params = []
        return self._call("getInflationRate", params)

    def get_inflation_reward(self, addresses: List[Pubkey], config: Optional[GetInflationRewardConfig] = None) -> Any:
        """Returns the inflation / staking reward for a list of addresses for an epoch"""
        params = []
        params.append(addresses)
        if config is not None:
            params.append(config)
        return self._call("getInflationReward", params)

    def get_largest_accounts(self, config: Optional[GetLargestAccountsConfig] = None) -> Any:
        """Returns the 20 largest accounts, by lamport balance"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getLargestAccounts", params)

    def get_latest_blockhash(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the latest blockhash"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getLatestBlockhash", params)

    def get_leader_schedule(self, slot: Optional[Slot] = None, config: Optional[GetLeaderScheduleConfig] = None) -> Any:
        """Returns the leader schedule for an epoch"""
        params = []
        if slot is not None:
            params.append(slot)
        if config is not None:
            params.append(config)
        return self._call("getLeaderSchedule", params)

    def get_max_retransmit_slot(self) -> Any:
        """Get the max slot seen from retransmit stage"""
        params = []
        return self._call("getMaxRetransmitSlot", params)

    def get_max_shred_insert_slot(self) -> Any:
        """Get the max slot seen from after shred insert"""
        params = []
        return self._call("getMaxShredInsertSlot", params)

    def get_minimum_balance_for_rent_exemption(self, data_length: int, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns minimum balance required to make account rent exempt"""
        params = []
        params.append(data_length)
        if config is not None:
            params.append(config)
        return self._call("getMinimumBalanceForRentExemption", params)

    def get_multiple_accounts(self, pubkeys: List[Pubkey], config: Optional[GetAccountInfoConfig] = None) -> Any:
        """Returns the account information for a list of Pubkeys"""
        params = []
        params.append(pubkeys)
        if config is not None:
            params.append(config)
        return self._call("getMultipleAccounts", params)

    def get_program_accounts(self, program_id: Pubkey, config: Optional[GetProgramAccountsConfig] = None) -> Any:
        """Returns all accounts owned by the provided program Pubkey"""
        params = []
        params.append(program_id)
        if config is not None:
            params.append(config)
        return self._call("getProgramAccounts", params)

    def get_recent_performance_samples(self, limit: Optional[int] = None) -> Any:
        """Returns a list of recent performance samples"""
        params = []
        if limit is not None:
            params.append(limit)
        return self._call("getRecentPerformanceSamples", params)

    def get_recent_prioritization_fees(self, addresses: Optional[List[Pubkey]] = None) -> Any:
        """Returns a list of prioritization fees from recent blocks"""
        params = []
        if addresses is not None:
            params.append(addresses)
        return self._call("getRecentPrioritizationFees", params)

    def get_signature_statuses(self, signatures: List[Signature], config: Optional[GetSignatureStatusesConfig] = None) -> Any:
        """Returns the statuses of a list of signatures"""
        params = []
        params.append(signatures)
        if config is not None:
            params.append(config)
        return self._call("getSignatureStatuses", params)

    def get_signatures_for_address(self, address: Pubkey, config: Optional[GetSignaturesForAddressConfig] = None) -> Any:
        """Returns signatures for confirmed transactions that include the given address"""
        params = []
        params.append(address)
        if config is not None:
            params.append(config)
        return self._call("getSignaturesForAddress", params)

    def get_slot(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the slot that has reached the given or default commitment level"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getSlot", params)

    def get_slot_leader(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the current slot leader"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getSlotLeader", params)

    def get_slot_leaders(self, start_slot: Slot, limit: int) -> Any:
        """Returns the slot leaders for a given slot range"""
        params = []
        params.append(start_slot)
        params.append(limit)
        return self._call("getSlotLeaders", params)

    def get_stake_minimum_delegation(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the stake minimum delegation, in lamports"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getStakeMinimumDelegation", params)

    def get_supply(self, config: Optional[GetSupplyConfig] = None) -> Any:
        """Returns information about the current supply"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getSupply", params)

    def get_token_account_balance(self, pubkey: Pubkey, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the token balance of an SPL Token account"""
        params = []
        params.append(pubkey)
        if config is not None:
            params.append(config)
        return self._call("getTokenAccountBalance", params)

    def get_token_accounts_by_delegate(self, delegate: Pubkey, filter: TokenAccountsFilter, config: Optional[GetTokenAccountsConfig] = None) -> Any:
        """Returns all SPL Token accounts by approved Delegate"""
        params = []
        params.append(delegate)
        params.append(filter)
        if config is not None:
            params.append(config)
        return self._call("getTokenAccountsByDelegate", params)

    def get_token_accounts_by_owner(self, owner: Pubkey, filter: TokenAccountsFilter, config: Optional[GetTokenAccountsConfig] = None) -> Any:
        """Returns all SPL Token accounts by token owner"""
        params = []
        params.append(owner)
        params.append(filter)
        if config is not None:
            params.append(config)
        return self._call("getTokenAccountsByOwner", params)

    def get_token_largest_accounts(self, mint: Pubkey, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the 20 largest accounts of a particular SPL Token type"""
        params = []
        params.append(mint)
        if config is not None:
            params.append(config)
        return self._call("getTokenLargestAccounts", params)

    def get_token_supply(self, mint: Pubkey, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the total supply of an SPL Token type"""
        params = []
        params.append(mint)
        if config is not None:
            params.append(config)
        return self._call("getTokenSupply", params)

    def get_transaction(self, signature: Signature, config: Optional[GetTransactionConfig] = None) -> Any:
        """Returns transaction details for a confirmed transaction"""
        params = []
        params.append(signature)
        if config is not None:
            params.append(config)
        return self._call("getTransaction", params)

    def get_transaction_count(self, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns the current Transaction count from the ledger"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getTransactionCount", params)

    def get_version(self) -> Any:
        """Returns the current Solana version running on the node"""
        params = []
        return self._call("getVersion", params)

    def get_vote_accounts(self, config: Optional[GetVoteAccountsConfig] = None) -> Any:
        """Returns the account info and associated stake for all the voting accounts in the current bank"""
        params = []
        if config is not None:
            params.append(config)
        return self._call("getVoteAccounts", params)

    def is_blockhash_valid(self, blockhash: Hash, config: Optional[CommitmentConfig] = None) -> Any:
        """Returns whether a blockhash is still valid or not"""
        params = []
        params.append(blockhash)
        if config is not None:
            params.append(config)
        return self._call("isBlockhashValid", params)

    def minimum_ledger_slot(self) -> Any:
        """Returns the lowest slot that the node has information about in its ledger"""
        params = []
        return self._call("minimumLedgerSlot", params)

    def request_airdrop(self, pubkey: Pubkey, lamports: int, config: Optional[CommitmentConfig] = None) -> Any:
        """Requests an airdrop of lamports to a Pubkey"""
        params = []
        params.append(pubkey)
        params.append(lamports)
        if config is not None:
            params.append(config)
        return self._call("requestAirdrop", params)

    def send_transaction(self, transaction: str, config: Optional[SendTransactionConfig] = None) -> Any:
        """Submits a signed transaction to the cluster for processing"""
        params = []
        params.append(transaction)
        if config is not None:
            params.append(config)
        return self._call("sendTransaction", params)

    def simulate_transaction(self, transaction: str, config: Optional[SimulateTransactionConfig] = None) -> Any:
        """Simulate sending a transaction"""
        params = []
        params.append(transaction)
        if config is not None:
            params.append(config)
        return self._call("simulateTransaction", params)
