package solana

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync/atomic"
)

const (
	MainnetBeta = "https://api.mainnet-beta.solana.com"
	Devnet      = "https://api.devnet.solana.com"
	Testnet     = "https://api.testnet.solana.com"
)

type rpcRequest struct {
	JsonRPC string        `json:"jsonrpc"`
	ID      uint64        `json:"id"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
}

type rpcResponse struct {
	JsonRPC string          `json:"jsonrpc"`
	ID      uint64          `json:"id"`
	Result  json.RawMessage `json:"result"`
	Error   *RPCError       `json:"error,omitempty"`
}

type RPCError struct {
	Code    int             `json:"code"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data,omitempty"`
}

func (e *RPCError) Error() string {
	return fmt.Sprintf("RPC error %d: %s", e.Code, e.Message)
}

type Client struct {
	endpoint  string
	httpClient *http.Client
	requestID  uint64
}

func NewClient(endpoint string) *Client {
	return &Client{
		endpoint:   endpoint,
		httpClient: http.DefaultClient,
	}
}

func (c *Client) call(ctx context.Context, method string, params []interface{}, result interface{}) error {
	id := atomic.AddUint64(&c.requestID, 1)

	reqBody := rpcRequest{
		JsonRPC: "2.0",
		ID:      id,
		Method:  method,
		Params:  params,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.endpoint, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("do request: %w", err)
	}
	defer resp.Body.Close()

	var rpcResp rpcResponse
	if err := json.NewDecoder(resp.Body).Decode(&rpcResp); err != nil {
		return fmt.Errorf("decode response: %w", err)
	}

	if rpcResp.Error != nil {
		return rpcResp.Error
	}

	if err := json.Unmarshal(rpcResp.Result, result); err != nil {
		return fmt.Errorf("unmarshal result: %w", err)
	}

	return nil
}

// GetAccountInfo Returns all information associated with the account of provided Pubkey
func (c *Client) GetAccountInfo(ctx context.Context, pubkey Pubkey, config *GetAccountInfoConfig) (AccountInfoResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, pubkey)
	if config != nil {
		params = append(params, *config)
	}

	var result AccountInfoResponse
	err := c.call(ctx, "getAccountInfo", params, &result)
	return result, err
}

// GetBalance Returns the lamport balance of the account of provided Pubkey
func (c *Client) GetBalance(ctx context.Context, pubkey Pubkey, config *CommitmentConfig) (RpcResponseU64, error) {
	params := make([]interface{}, 0)
	params = append(params, pubkey)
	if config != nil {
		params = append(params, *config)
	}

	var result RpcResponseU64
	err := c.call(ctx, "getBalance", params, &result)
	return result, err
}

// GetBlock Returns identity and transaction information about a confirmed block in the ledger
func (c *Client) GetBlock(ctx context.Context, slot Slot, config *GetBlockConfig) (Block, error) {
	params := make([]interface{}, 0)
	params = append(params, slot)
	if config != nil {
		params = append(params, *config)
	}

	var result Block
	err := c.call(ctx, "getBlock", params, &result)
	return result, err
}

// GetBlockCommitment Returns commitment for particular block
func (c *Client) GetBlockCommitment(ctx context.Context, slot Slot) (BlockCommitment, error) {
	params := make([]interface{}, 0)
	params = append(params, slot)

	var result BlockCommitment
	err := c.call(ctx, "getBlockCommitment", params, &result)
	return result, err
}

// GetBlockHeight Returns the current block height of the node
func (c *Client) GetBlockHeight(ctx context.Context, config *CommitmentConfig) (int64, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result int64
	err := c.call(ctx, "getBlockHeight", params, &result)
	return result, err
}

// GetBlockProduction Returns recent block production information from the current or previous epoch
func (c *Client) GetBlockProduction(ctx context.Context, config *GetBlockProductionConfig) (BlockProduction, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result BlockProduction
	err := c.call(ctx, "getBlockProduction", params, &result)
	return result, err
}

// GetBlockTime Returns the estimated production time of a block
func (c *Client) GetBlockTime(ctx context.Context, slot Slot) (int64, error) {
	params := make([]interface{}, 0)
	params = append(params, slot)

	var result int64
	err := c.call(ctx, "getBlockTime", params, &result)
	return result, err
}

// GetBlocks Returns a list of confirmed blocks between two slots
func (c *Client) GetBlocks(ctx context.Context, startSlot Slot, endSlot *Slot, config *CommitmentConfig) ([]Slot, error) {
	params := make([]interface{}, 0)
	params = append(params, startSlot)
	if endSlot != nil {
		params = append(params, *endSlot)
	}
	if config != nil {
		params = append(params, *config)
	}

	var result []Slot
	err := c.call(ctx, "getBlocks", params, &result)
	return result, err
}

// GetBlocksWithLimit Returns a list of confirmed blocks starting at the given slot
func (c *Client) GetBlocksWithLimit(ctx context.Context, startSlot Slot, limit int64, config *CommitmentConfig) ([]Slot, error) {
	params := make([]interface{}, 0)
	params = append(params, startSlot)
	params = append(params, limit)
	if config != nil {
		params = append(params, *config)
	}

	var result []Slot
	err := c.call(ctx, "getBlocksWithLimit", params, &result)
	return result, err
}

// GetClusterNodes Returns information about all the nodes participating in the cluster
func (c *Client) GetClusterNodes(ctx context.Context) ([]ClusterNode, error) {
	params := make([]interface{}, 0)

	var result []ClusterNode
	err := c.call(ctx, "getClusterNodes", params, &result)
	return result, err
}

// GetEpochInfo Returns information about the current epoch
func (c *Client) GetEpochInfo(ctx context.Context, config *CommitmentConfig) (EpochInfo, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result EpochInfo
	err := c.call(ctx, "getEpochInfo", params, &result)
	return result, err
}

// GetEpochSchedule Returns the epoch schedule information from this cluster's genesis config
func (c *Client) GetEpochSchedule(ctx context.Context) (EpochSchedule, error) {
	params := make([]interface{}, 0)

	var result EpochSchedule
	err := c.call(ctx, "getEpochSchedule", params, &result)
	return result, err
}

// GetFeeForMessage Returns the fee the network will charge for a particular message
func (c *Client) GetFeeForMessage(ctx context.Context, message string, config *CommitmentConfig) (RpcResponseU64, error) {
	params := make([]interface{}, 0)
	params = append(params, message)
	if config != nil {
		params = append(params, *config)
	}

	var result RpcResponseU64
	err := c.call(ctx, "getFeeForMessage", params, &result)
	return result, err
}

// GetFirstAvailableBlock Returns the slot of the lowest confirmed block that has not been purged from the ledger
func (c *Client) GetFirstAvailableBlock(ctx context.Context) (Slot, error) {
	params := make([]interface{}, 0)

	var result Slot
	err := c.call(ctx, "getFirstAvailableBlock", params, &result)
	return result, err
}

// GetGenesisHash Returns the genesis hash
func (c *Client) GetGenesisHash(ctx context.Context) (Hash, error) {
	params := make([]interface{}, 0)

	var result Hash
	err := c.call(ctx, "getGenesisHash", params, &result)
	return result, err
}

// GetHealth Returns the current health of the node
func (c *Client) GetHealth(ctx context.Context) (string, error) {
	params := make([]interface{}, 0)

	var result string
	err := c.call(ctx, "getHealth", params, &result)
	return result, err
}

// GetHighestSnapshotSlot Returns the highest slot information that the node has snapshots for
func (c *Client) GetHighestSnapshotSlot(ctx context.Context) (SnapshotSlotInfo, error) {
	params := make([]interface{}, 0)

	var result SnapshotSlotInfo
	err := c.call(ctx, "getHighestSnapshotSlot", params, &result)
	return result, err
}

// GetIdentity Returns the identity pubkey for the current node
func (c *Client) GetIdentity(ctx context.Context) (map[string]interface{}, error) {
	params := make([]interface{}, 0)

	var result map[string]interface{}
	err := c.call(ctx, "getIdentity", params, &result)
	return result, err
}

// GetInflationGovernor Returns the current inflation governor
func (c *Client) GetInflationGovernor(ctx context.Context, config *CommitmentConfig) (InflationGovernor, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result InflationGovernor
	err := c.call(ctx, "getInflationGovernor", params, &result)
	return result, err
}

// GetInflationRate Returns the specific inflation values for the current epoch
func (c *Client) GetInflationRate(ctx context.Context) (InflationRate, error) {
	params := make([]interface{}, 0)

	var result InflationRate
	err := c.call(ctx, "getInflationRate", params, &result)
	return result, err
}

// GetInflationReward Returns the inflation / staking reward for a list of addresses for an epoch
func (c *Client) GetInflationReward(ctx context.Context, addresses []Pubkey, config *GetInflationRewardConfig) ([]InflationReward, error) {
	params := make([]interface{}, 0)
	params = append(params, addresses)
	if config != nil {
		params = append(params, *config)
	}

	var result []InflationReward
	err := c.call(ctx, "getInflationReward", params, &result)
	return result, err
}

// GetLargestAccounts Returns the 20 largest accounts, by lamport balance
func (c *Client) GetLargestAccounts(ctx context.Context, config *GetLargestAccountsConfig) (RpcResponseLargestAccounts, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result RpcResponseLargestAccounts
	err := c.call(ctx, "getLargestAccounts", params, &result)
	return result, err
}

// GetLatestBlockhash Returns the latest blockhash
func (c *Client) GetLatestBlockhash(ctx context.Context, config *CommitmentConfig) (LatestBlockhashResponse, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result LatestBlockhashResponse
	err := c.call(ctx, "getLatestBlockhash", params, &result)
	return result, err
}

// GetLeaderSchedule Returns the leader schedule for an epoch
func (c *Client) GetLeaderSchedule(ctx context.Context, slot *Slot, config *GetLeaderScheduleConfig) (LeaderSchedule, error) {
	params := make([]interface{}, 0)
	if slot != nil {
		params = append(params, *slot)
	}
	if config != nil {
		params = append(params, *config)
	}

	var result LeaderSchedule
	err := c.call(ctx, "getLeaderSchedule", params, &result)
	return result, err
}

// GetMaxRetransmitSlot Get the max slot seen from retransmit stage
func (c *Client) GetMaxRetransmitSlot(ctx context.Context) (Slot, error) {
	params := make([]interface{}, 0)

	var result Slot
	err := c.call(ctx, "getMaxRetransmitSlot", params, &result)
	return result, err
}

// GetMaxShredInsertSlot Get the max slot seen from after shred insert
func (c *Client) GetMaxShredInsertSlot(ctx context.Context) (Slot, error) {
	params := make([]interface{}, 0)

	var result Slot
	err := c.call(ctx, "getMaxShredInsertSlot", params, &result)
	return result, err
}

// GetMinimumBalanceForRentExemption Returns minimum balance required to make account rent exempt
func (c *Client) GetMinimumBalanceForRentExemption(ctx context.Context, dataLength int64, config *CommitmentConfig) (int64, error) {
	params := make([]interface{}, 0)
	params = append(params, dataLength)
	if config != nil {
		params = append(params, *config)
	}

	var result int64
	err := c.call(ctx, "getMinimumBalanceForRentExemption", params, &result)
	return result, err
}

// GetMultipleAccounts Returns the account information for a list of Pubkeys
func (c *Client) GetMultipleAccounts(ctx context.Context, pubkeys []Pubkey, config *GetAccountInfoConfig) (MultipleAccountsResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, pubkeys)
	if config != nil {
		params = append(params, *config)
	}

	var result MultipleAccountsResponse
	err := c.call(ctx, "getMultipleAccounts", params, &result)
	return result, err
}

// GetProgramAccounts Returns all accounts owned by the provided program Pubkey
func (c *Client) GetProgramAccounts(ctx context.Context, programId Pubkey, config *GetProgramAccountsConfig) ([]ProgramAccount, error) {
	params := make([]interface{}, 0)
	params = append(params, programId)
	if config != nil {
		params = append(params, *config)
	}

	var result []ProgramAccount
	err := c.call(ctx, "getProgramAccounts", params, &result)
	return result, err
}

// GetRecentPerformanceSamples Returns a list of recent performance samples
func (c *Client) GetRecentPerformanceSamples(ctx context.Context, limit *int64) ([]PerformanceSample, error) {
	params := make([]interface{}, 0)
	if limit != nil {
		params = append(params, *limit)
	}

	var result []PerformanceSample
	err := c.call(ctx, "getRecentPerformanceSamples", params, &result)
	return result, err
}

// GetRecentPrioritizationFees Returns a list of prioritization fees from recent blocks
func (c *Client) GetRecentPrioritizationFees(ctx context.Context, addresses *[]Pubkey) ([]PrioritizationFee, error) {
	params := make([]interface{}, 0)
	if addresses != nil {
		params = append(params, *addresses)
	}

	var result []PrioritizationFee
	err := c.call(ctx, "getRecentPrioritizationFees", params, &result)
	return result, err
}

// GetSignatureStatuses Returns the statuses of a list of signatures
func (c *Client) GetSignatureStatuses(ctx context.Context, signatures []Signature, config *GetSignatureStatusesConfig) (SignatureStatusesResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, signatures)
	if config != nil {
		params = append(params, *config)
	}

	var result SignatureStatusesResponse
	err := c.call(ctx, "getSignatureStatuses", params, &result)
	return result, err
}

// GetSignaturesForAddress Returns signatures for confirmed transactions that include the given address
func (c *Client) GetSignaturesForAddress(ctx context.Context, address Pubkey, config *GetSignaturesForAddressConfig) ([]SignatureInfo, error) {
	params := make([]interface{}, 0)
	params = append(params, address)
	if config != nil {
		params = append(params, *config)
	}

	var result []SignatureInfo
	err := c.call(ctx, "getSignaturesForAddress", params, &result)
	return result, err
}

// GetSlot Returns the slot that has reached the given or default commitment level
func (c *Client) GetSlot(ctx context.Context, config *CommitmentConfig) (Slot, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result Slot
	err := c.call(ctx, "getSlot", params, &result)
	return result, err
}

// GetSlotLeader Returns the current slot leader
func (c *Client) GetSlotLeader(ctx context.Context, config *CommitmentConfig) (Pubkey, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result Pubkey
	err := c.call(ctx, "getSlotLeader", params, &result)
	return result, err
}

// GetSlotLeaders Returns the slot leaders for a given slot range
func (c *Client) GetSlotLeaders(ctx context.Context, startSlot Slot, limit int64) ([]Pubkey, error) {
	params := make([]interface{}, 0)
	params = append(params, startSlot)
	params = append(params, limit)

	var result []Pubkey
	err := c.call(ctx, "getSlotLeaders", params, &result)
	return result, err
}

// GetStakeMinimumDelegation Returns the stake minimum delegation, in lamports
func (c *Client) GetStakeMinimumDelegation(ctx context.Context, config *CommitmentConfig) (RpcResponseU64, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result RpcResponseU64
	err := c.call(ctx, "getStakeMinimumDelegation", params, &result)
	return result, err
}

// GetSupply Returns information about the current supply
func (c *Client) GetSupply(ctx context.Context, config *GetSupplyConfig) (SupplyResponse, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result SupplyResponse
	err := c.call(ctx, "getSupply", params, &result)
	return result, err
}

// GetTokenAccountBalance Returns the token balance of an SPL Token account
func (c *Client) GetTokenAccountBalance(ctx context.Context, pubkey Pubkey, config *CommitmentConfig) (TokenBalanceResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, pubkey)
	if config != nil {
		params = append(params, *config)
	}

	var result TokenBalanceResponse
	err := c.call(ctx, "getTokenAccountBalance", params, &result)
	return result, err
}

// GetTokenAccountsByDelegate Returns all SPL Token accounts by approved Delegate
func (c *Client) GetTokenAccountsByDelegate(ctx context.Context, delegate Pubkey, filter TokenAccountsFilter, config *GetTokenAccountsConfig) (TokenAccountsResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, delegate)
	params = append(params, filter)
	if config != nil {
		params = append(params, *config)
	}

	var result TokenAccountsResponse
	err := c.call(ctx, "getTokenAccountsByDelegate", params, &result)
	return result, err
}

// GetTokenAccountsByOwner Returns all SPL Token accounts by token owner
func (c *Client) GetTokenAccountsByOwner(ctx context.Context, owner Pubkey, filter TokenAccountsFilter, config *GetTokenAccountsConfig) (TokenAccountsResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, owner)
	params = append(params, filter)
	if config != nil {
		params = append(params, *config)
	}

	var result TokenAccountsResponse
	err := c.call(ctx, "getTokenAccountsByOwner", params, &result)
	return result, err
}

// GetTokenLargestAccounts Returns the 20 largest accounts of a particular SPL Token type
func (c *Client) GetTokenLargestAccounts(ctx context.Context, mint Pubkey, config *CommitmentConfig) (TokenLargestAccountsResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, mint)
	if config != nil {
		params = append(params, *config)
	}

	var result TokenLargestAccountsResponse
	err := c.call(ctx, "getTokenLargestAccounts", params, &result)
	return result, err
}

// GetTokenSupply Returns the total supply of an SPL Token type
func (c *Client) GetTokenSupply(ctx context.Context, mint Pubkey, config *CommitmentConfig) (TokenBalanceResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, mint)
	if config != nil {
		params = append(params, *config)
	}

	var result TokenBalanceResponse
	err := c.call(ctx, "getTokenSupply", params, &result)
	return result, err
}

// GetTransaction Returns transaction details for a confirmed transaction
func (c *Client) GetTransaction(ctx context.Context, signature Signature, config *GetTransactionConfig) (TransactionResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, signature)
	if config != nil {
		params = append(params, *config)
	}

	var result TransactionResponse
	err := c.call(ctx, "getTransaction", params, &result)
	return result, err
}

// GetTransactionCount Returns the current Transaction count from the ledger
func (c *Client) GetTransactionCount(ctx context.Context, config *CommitmentConfig) (int64, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result int64
	err := c.call(ctx, "getTransactionCount", params, &result)
	return result, err
}

// GetVersion Returns the current Solana version running on the node
func (c *Client) GetVersion(ctx context.Context) (Version, error) {
	params := make([]interface{}, 0)

	var result Version
	err := c.call(ctx, "getVersion", params, &result)
	return result, err
}

// GetVoteAccounts Returns the account info and associated stake for all the voting accounts in the current bank
func (c *Client) GetVoteAccounts(ctx context.Context, config *GetVoteAccountsConfig) (VoteAccountsResponse, error) {
	params := make([]interface{}, 0)
	if config != nil {
		params = append(params, *config)
	}

	var result VoteAccountsResponse
	err := c.call(ctx, "getVoteAccounts", params, &result)
	return result, err
}

// IsBlockhashValid Returns whether a blockhash is still valid or not
func (c *Client) IsBlockhashValid(ctx context.Context, blockhash Hash, config *CommitmentConfig) (RpcResponseBool, error) {
	params := make([]interface{}, 0)
	params = append(params, blockhash)
	if config != nil {
		params = append(params, *config)
	}

	var result RpcResponseBool
	err := c.call(ctx, "isBlockhashValid", params, &result)
	return result, err
}

// MinimumLedgerSlot Returns the lowest slot that the node has information about in its ledger
func (c *Client) MinimumLedgerSlot(ctx context.Context) (Slot, error) {
	params := make([]interface{}, 0)

	var result Slot
	err := c.call(ctx, "minimumLedgerSlot", params, &result)
	return result, err
}

// RequestAirdrop Requests an airdrop of lamports to a Pubkey
func (c *Client) RequestAirdrop(ctx context.Context, pubkey Pubkey, lamports int64, config *CommitmentConfig) (Signature, error) {
	params := make([]interface{}, 0)
	params = append(params, pubkey)
	params = append(params, lamports)
	if config != nil {
		params = append(params, *config)
	}

	var result Signature
	err := c.call(ctx, "requestAirdrop", params, &result)
	return result, err
}

// SendTransaction Submits a signed transaction to the cluster for processing
func (c *Client) SendTransaction(ctx context.Context, transaction string, config *SendTransactionConfig) (Signature, error) {
	params := make([]interface{}, 0)
	params = append(params, transaction)
	if config != nil {
		params = append(params, *config)
	}

	var result Signature
	err := c.call(ctx, "sendTransaction", params, &result)
	return result, err
}

// SimulateTransaction Simulate sending a transaction
func (c *Client) SimulateTransaction(ctx context.Context, transaction string, config *SimulateTransactionConfig) (SimulateTransactionResponse, error) {
	params := make([]interface{}, 0)
	params = append(params, transaction)
	if config != nil {
		params = append(params, *config)
	}

	var result SimulateTransactionResponse
	err := c.call(ctx, "simulateTransaction", params, &result)
	return result, err
}
