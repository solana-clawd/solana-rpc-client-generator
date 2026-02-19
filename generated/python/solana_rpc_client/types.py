"""Auto-generated Solana RPC Types"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Union
from enum import Enum

class Commitment(str, Enum):
    PROCESSED = "processed"
    CONFIRMED = "confirmed"
    FINALIZED = "finalized"

class Encoding(str, Enum):
    BASE58 = "base58"
    BASE64 = "base64"
    BASE64_ZSTD = "base64+zstd"
    JSONPARSED = "jsonParsed"

class TransactionEncoding(str, Enum):
    JSON = "json"
    JSONPARSED = "jsonParsed"
    BASE58 = "base58"
    BASE64 = "base64"

@dataclass
class CommitmentConfig:
    """CommitmentConfig type"""
    commitment: Optional["Commitment"] = None
    min_context_slot: Optional[int] = None

@dataclass
class GetAccountInfoConfig:
    """GetAccountInfoConfig type"""
    commitment: Optional["Commitment"] = None
    encoding: Optional["Encoding"] = None
    data_slice: Optional["DataSlice"] = None
    min_context_slot: Optional[int] = None

@dataclass
class DataSlice:
    """DataSlice type"""
    offset: Optional[int] = None
    length: Optional[int] = None

@dataclass
class RpcContext:
    """RpcContext type"""
    api_version: Optional[str] = None
    slot: Optional["Slot"] = None

@dataclass
class AccountInfo:
    """AccountInfo type"""
    lamports: Optional[int] = None
    owner: Optional["Pubkey"] = None
    data: Optional[Dict[str, Any]] = None
    executable: Optional[bool] = None
    rent_epoch: Optional[int] = None
    space: Optional[int] = None

@dataclass
class AccountInfoResponse:
    """AccountInfoResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional["AccountInfo"] = None

@dataclass
class RpcResponseU64:
    """RpcResponseU64 type"""
    context: Optional["RpcContext"] = None
    value: Optional[int] = None

@dataclass
class RpcResponseBool:
    """RpcResponseBool type"""
    context: Optional["RpcContext"] = None
    value: Optional[bool] = None

@dataclass
class GetBlockConfig:
    """GetBlockConfig type"""
    encoding: Optional["TransactionEncoding"] = None
    transaction_details: Optional[str] = None
    rewards: Optional[bool] = None
    commitment: Optional["Commitment"] = None
    max_supported_transaction_version: Optional[int] = None

@dataclass
class Block:
    """Block type"""
    blockhash: Optional["Hash"] = None
    previous_blockhash: Optional["Hash"] = None
    parent_slot: Optional["Slot"] = None
    transactions: Optional[List[Any]] = None
    signatures: Optional[List["Signature"]] = None
    rewards: Optional[List[Any]] = None
    block_time: Optional[int] = None
    block_height: Optional[int] = None

@dataclass
class BlockCommitment:
    """BlockCommitment type"""
    commitment: Optional[List[int]] = None
    total_stake: Optional[int] = None

@dataclass
class GetBlockProductionConfig:
    """GetBlockProductionConfig type"""
    commitment: Optional["Commitment"] = None
    range: Optional[Dict[str, Any]] = None
    identity: Optional["Pubkey"] = None

@dataclass
class BlockProduction:
    """BlockProduction type"""
    context: Optional["RpcContext"] = None
    value: Optional[Dict[str, Any]] = None

@dataclass
class ClusterNode:
    """ClusterNode type"""
    pubkey: Optional["Pubkey"] = None
    gossip: Optional[str] = None
    tpu: Optional[str] = None
    rpc: Optional[str] = None
    version: Optional[str] = None
    feature_set: Optional[int] = None
    shred_version: Optional[int] = None

@dataclass
class EpochInfo:
    """EpochInfo type"""
    absolute_slot: Optional["Slot"] = None
    block_height: Optional[int] = None
    epoch: Optional[int] = None
    slot_index: Optional[int] = None
    slots_in_epoch: Optional[int] = None
    transaction_count: Optional[int] = None

@dataclass
class EpochSchedule:
    """EpochSchedule type"""
    slots_per_epoch: Optional[int] = None
    leader_schedule_slot_offset: Optional[int] = None
    warmup: Optional[bool] = None
    first_normal_epoch: Optional[int] = None
    first_normal_slot: Optional["Slot"] = None

@dataclass
class SnapshotSlotInfo:
    """SnapshotSlotInfo type"""
    full: Optional["Slot"] = None
    incremental: Optional["Slot"] = None

@dataclass
class InflationGovernor:
    """InflationGovernor type"""
    initial: Optional[float] = None
    terminal: Optional[float] = None
    taper: Optional[float] = None
    foundation: Optional[float] = None
    foundation_term: Optional[float] = None

@dataclass
class InflationRate:
    """InflationRate type"""
    total: Optional[float] = None
    validator: Optional[float] = None
    foundation: Optional[float] = None
    epoch: Optional[int] = None

@dataclass
class GetInflationRewardConfig:
    """GetInflationRewardConfig type"""
    commitment: Optional["Commitment"] = None
    epoch: Optional[int] = None
    min_context_slot: Optional[int] = None

@dataclass
class InflationReward:
    """InflationReward type"""
    epoch: Optional[int] = None
    effective_slot: Optional["Slot"] = None
    amount: Optional[int] = None
    post_balance: Optional[int] = None
    commission: Optional[int] = None

@dataclass
class GetLargestAccountsConfig:
    """GetLargestAccountsConfig type"""
    commitment: Optional["Commitment"] = None
    filter: Optional[str] = None

@dataclass
class RpcResponseLargestAccounts:
    """RpcResponseLargestAccounts type"""
    context: Optional["RpcContext"] = None
    value: Optional[List[Dict[str, Any]]] = None

@dataclass
class LatestBlockhashResponse:
    """LatestBlockhashResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[Dict[str, Any]] = None

@dataclass
class GetLeaderScheduleConfig:
    """GetLeaderScheduleConfig type"""
    commitment: Optional["Commitment"] = None
    identity: Optional["Pubkey"] = None

@dataclass
class MultipleAccountsResponse:
    """MultipleAccountsResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[List["AccountInfo"]] = None

@dataclass
class GetProgramAccountsConfig:
    """GetProgramAccountsConfig type"""
    commitment: Optional["Commitment"] = None
    encoding: Optional["Encoding"] = None
    data_slice: Optional["DataSlice"] = None
    filters: Optional[List["AccountFilter"]] = None
    with_context: Optional[bool] = None
    min_context_slot: Optional[int] = None

@dataclass
class AccountFilter:
    """AccountFilter type"""
    memcmp: Optional[Dict[str, Any]] = None
    data_size: Optional[int] = None

@dataclass
class ProgramAccount:
    """ProgramAccount type"""
    pubkey: Optional["Pubkey"] = None
    account: Optional["AccountInfo"] = None

@dataclass
class PerformanceSample:
    """PerformanceSample type"""
    slot: Optional["Slot"] = None
    num_transactions: Optional[int] = None
    num_slots: Optional[int] = None
    sample_period_secs: Optional[int] = None
    num_non_vote_transactions: Optional[int] = None

@dataclass
class PrioritizationFee:
    """PrioritizationFee type"""
    slot: Optional["Slot"] = None
    prioritization_fee: Optional[int] = None

@dataclass
class GetSignatureStatusesConfig:
    """GetSignatureStatusesConfig type"""
    search_transaction_history: Optional[bool] = None

@dataclass
class SignatureStatusesResponse:
    """SignatureStatusesResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[List["SignatureStatus"]] = None

@dataclass
class SignatureStatus:
    """SignatureStatus type"""
    slot: Optional["Slot"] = None
    confirmations: Optional[int] = None
    err: Optional[Dict[str, Any]] = None
    confirmation_status: Optional["Commitment"] = None

@dataclass
class GetSignaturesForAddressConfig:
    """GetSignaturesForAddressConfig type"""
    limit: Optional[int] = None
    before: Optional["Signature"] = None
    until: Optional["Signature"] = None
    commitment: Optional["Commitment"] = None
    min_context_slot: Optional[int] = None

@dataclass
class SignatureInfo:
    """SignatureInfo type"""
    signature: Optional["Signature"] = None
    slot: Optional["Slot"] = None
    err: Optional[Dict[str, Any]] = None
    memo: Optional[str] = None
    block_time: Optional[int] = None
    confirmation_status: Optional["Commitment"] = None

@dataclass
class GetSupplyConfig:
    """GetSupplyConfig type"""
    commitment: Optional["Commitment"] = None
    exclude_non_circulating_accounts_list: Optional[bool] = None

@dataclass
class SupplyResponse:
    """SupplyResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[Dict[str, Any]] = None

@dataclass
class TokenBalanceResponse:
    """TokenBalanceResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional["TokenAmount"] = None

@dataclass
class TokenAmount:
    """TokenAmount type"""
    amount: Optional[str] = None
    decimals: Optional[int] = None
    ui_amount: Optional[float] = None
    ui_amount_string: Optional[str] = None

@dataclass
class TokenAccountsFilter:
    """TokenAccountsFilter type"""
    mint: Optional["Pubkey"] = None
    program_id: Optional["Pubkey"] = None

@dataclass
class GetTokenAccountsConfig:
    """GetTokenAccountsConfig type"""
    commitment: Optional["Commitment"] = None
    encoding: Optional["Encoding"] = None
    data_slice: Optional["DataSlice"] = None
    min_context_slot: Optional[int] = None

@dataclass
class TokenAccountsResponse:
    """TokenAccountsResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[List[Dict[str, Any]]] = None

@dataclass
class TokenLargestAccountsResponse:
    """TokenLargestAccountsResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[List[Dict[str, Any]]] = None

@dataclass
class GetTransactionConfig:
    """GetTransactionConfig type"""
    encoding: Optional["TransactionEncoding"] = None
    commitment: Optional["Commitment"] = None
    max_supported_transaction_version: Optional[int] = None

@dataclass
class TransactionResponse:
    """TransactionResponse type"""
    slot: Optional["Slot"] = None
    transaction: Optional[Dict[str, Any]] = None
    block_time: Optional[int] = None
    meta: Optional["TransactionMeta"] = None
    version: Optional[Dict[str, Any]] = None

@dataclass
class TransactionMeta:
    """TransactionMeta type"""
    err: Optional[Dict[str, Any]] = None
    fee: Optional[int] = None
    pre_balances: Optional[List[int]] = None
    post_balances: Optional[List[int]] = None
    inner_instructions: Optional[List[Any]] = None
    pre_token_balances: Optional[List[Any]] = None
    post_token_balances: Optional[List[Any]] = None
    log_messages: Optional[List[str]] = None
    rewards: Optional[List[Any]] = None
    loaded_addresses: Optional[Dict[str, Any]] = None
    compute_units_consumed: Optional[int] = None

@dataclass
class Version:
    """Version type"""
    solana_core: Optional[str] = None
    feature_set: Optional[int] = None

@dataclass
class GetVoteAccountsConfig:
    """GetVoteAccountsConfig type"""
    commitment: Optional["Commitment"] = None
    vote_pubkey: Optional["Pubkey"] = None
    keep_unstaked_delinquents: Optional[bool] = None
    delinquent_slot_distance: Optional[int] = None

@dataclass
class VoteAccountsResponse:
    """VoteAccountsResponse type"""
    current: Optional[List["VoteAccount"]] = None
    delinquent: Optional[List["VoteAccount"]] = None

@dataclass
class VoteAccount:
    """VoteAccount type"""
    vote_pubkey: Optional["Pubkey"] = None
    node_pubkey: Optional["Pubkey"] = None
    activated_stake: Optional[int] = None
    epoch_vote_account: Optional[bool] = None
    commission: Optional[int] = None
    last_vote: Optional["Slot"] = None
    epoch_credits: Optional[List[Any]] = None
    root_slot: Optional["Slot"] = None

@dataclass
class SendTransactionConfig:
    """SendTransactionConfig type"""
    encoding: Optional[str] = None
    skip_preflight: Optional[bool] = None
    preflight_commitment: Optional["Commitment"] = None
    max_retries: Optional[int] = None
    min_context_slot: Optional[int] = None

@dataclass
class SimulateTransactionConfig:
    """SimulateTransactionConfig type"""
    sig_verify: Optional[bool] = None
    commitment: Optional["Commitment"] = None
    encoding: Optional[str] = None
    replace_recent_blockhash: Optional[bool] = None
    accounts: Optional[Dict[str, Any]] = None
    min_context_slot: Optional[int] = None
    inner_instructions: Optional[bool] = None

@dataclass
class SimulateTransactionResponse:
    """SimulateTransactionResponse type"""
    context: Optional["RpcContext"] = None
    value: Optional[Dict[str, Any]] = None

Pubkey = str
Signature = str
Hash = str
Slot = int
LeaderSchedule = Dict[str, List[int]]