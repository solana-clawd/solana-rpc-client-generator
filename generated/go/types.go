package solana

// Auto-generated Solana RPC Types

type Pubkey = string

type Signature = string

type Hash = string

type Slot = int64

type Commitment string

const (
	CommitmentProcessed Commitment = "processed"
	CommitmentConfirmed Commitment = "confirmed"
	CommitmentFinalized Commitment = "finalized"
)

type Encoding string

const (
	EncodingBase58 Encoding = "base58"
	EncodingBase64 Encoding = "base64"
	EncodingBase64+zstd Encoding = "base64+zstd"
	EncodingJsonParsed Encoding = "jsonParsed"
)

type TransactionEncoding string

const (
	TransactionEncodingJson TransactionEncoding = "json"
	TransactionEncodingJsonParsed TransactionEncoding = "jsonParsed"
	TransactionEncodingBase58 TransactionEncoding = "base58"
	TransactionEncodingBase64 TransactionEncoding = "base64"
)

type CommitmentConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type GetAccountInfoConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Encoding Encoding `json:"encoding,omitempty"`
	DataSlice DataSlice `json:"dataSlice,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type DataSlice struct {
	Offset int64 `json:"offset,omitempty"`
	Length int64 `json:"length,omitempty"`
}

type RpcContext struct {
	ApiVersion string `json:"apiVersion,omitempty"`
	Slot Slot `json:"slot,omitempty"`
}

type AccountInfo struct {
	Lamports int64 `json:"lamports,omitempty"`
	Owner Pubkey `json:"owner,omitempty"`
	Data map[string]interface{} `json:"data,omitempty"`
	Executable bool `json:"executable,omitempty"`
	RentEpoch int64 `json:"rentEpoch,omitempty"`
	Space int64 `json:"space,omitempty"`
}

type AccountInfoResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value AccountInfo `json:"value,omitempty"`
}

type RpcResponseU64 struct {
	Context RpcContext `json:"context,omitempty"`
	Value int64 `json:"value,omitempty"`
}

type RpcResponseBool struct {
	Context RpcContext `json:"context,omitempty"`
	Value bool `json:"value,omitempty"`
}

type GetBlockConfig struct {
	Encoding TransactionEncoding `json:"encoding,omitempty"`
	TransactionDetails string `json:"transactionDetails,omitempty"`
	Rewards bool `json:"rewards,omitempty"`
	Commitment Commitment `json:"commitment,omitempty"`
	MaxSupportedTransactionVersion int64 `json:"maxSupportedTransactionVersion,omitempty"`
}

type Block struct {
	Blockhash Hash `json:"blockhash,omitempty"`
	PreviousBlockhash Hash `json:"previousBlockhash,omitempty"`
	ParentSlot Slot `json:"parentSlot,omitempty"`
	Transactions []interface{} `json:"transactions,omitempty"`
	Signatures []Signature `json:"signatures,omitempty"`
	Rewards []interface{} `json:"rewards,omitempty"`
	BlockTime int64 `json:"blockTime,omitempty"`
	BlockHeight int64 `json:"blockHeight,omitempty"`
}

type BlockCommitment struct {
	Commitment []int64 `json:"commitment,omitempty"`
	TotalStake int64 `json:"totalStake,omitempty"`
}

type GetBlockProductionConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Range map[string]interface{} `json:"range,omitempty"`
	Identity Pubkey `json:"identity,omitempty"`
}

type BlockProduction struct {
	Context RpcContext `json:"context,omitempty"`
	Value map[string]interface{} `json:"value,omitempty"`
}

type ClusterNode struct {
	Pubkey Pubkey `json:"pubkey,omitempty"`
	Gossip string `json:"gossip,omitempty"`
	Tpu string `json:"tpu,omitempty"`
	Rpc string `json:"rpc,omitempty"`
	Version string `json:"version,omitempty"`
	FeatureSet int64 `json:"featureSet,omitempty"`
	ShredVersion int64 `json:"shredVersion,omitempty"`
}

type EpochInfo struct {
	AbsoluteSlot Slot `json:"absoluteSlot,omitempty"`
	BlockHeight int64 `json:"blockHeight,omitempty"`
	Epoch int64 `json:"epoch,omitempty"`
	SlotIndex int64 `json:"slotIndex,omitempty"`
	SlotsInEpoch int64 `json:"slotsInEpoch,omitempty"`
	TransactionCount int64 `json:"transactionCount,omitempty"`
}

type EpochSchedule struct {
	SlotsPerEpoch int64 `json:"slotsPerEpoch,omitempty"`
	LeaderScheduleSlotOffset int64 `json:"leaderScheduleSlotOffset,omitempty"`
	Warmup bool `json:"warmup,omitempty"`
	FirstNormalEpoch int64 `json:"firstNormalEpoch,omitempty"`
	FirstNormalSlot Slot `json:"firstNormalSlot,omitempty"`
}

type SnapshotSlotInfo struct {
	Full Slot `json:"full,omitempty"`
	Incremental Slot `json:"incremental,omitempty"`
}

type InflationGovernor struct {
	Initial float64 `json:"initial,omitempty"`
	Terminal float64 `json:"terminal,omitempty"`
	Taper float64 `json:"taper,omitempty"`
	Foundation float64 `json:"foundation,omitempty"`
	FoundationTerm float64 `json:"foundationTerm,omitempty"`
}

type InflationRate struct {
	Total float64 `json:"total,omitempty"`
	Validator float64 `json:"validator,omitempty"`
	Foundation float64 `json:"foundation,omitempty"`
	Epoch int64 `json:"epoch,omitempty"`
}

type GetInflationRewardConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Epoch int64 `json:"epoch,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type InflationReward struct {
	Epoch int64 `json:"epoch,omitempty"`
	EffectiveSlot Slot `json:"effectiveSlot,omitempty"`
	Amount int64 `json:"amount,omitempty"`
	PostBalance int64 `json:"postBalance,omitempty"`
	Commission int64 `json:"commission,omitempty"`
}

type GetLargestAccountsConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Filter string `json:"filter,omitempty"`
}

type RpcResponseLargestAccounts struct {
	Context RpcContext `json:"context,omitempty"`
	Value []map[string]interface{} `json:"value,omitempty"`
}

type LatestBlockhashResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value map[string]interface{} `json:"value,omitempty"`
}

type GetLeaderScheduleConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Identity Pubkey `json:"identity,omitempty"`
}

type LeaderSchedule = map[string][]int64

type MultipleAccountsResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value []AccountInfo `json:"value,omitempty"`
}

type GetProgramAccountsConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Encoding Encoding `json:"encoding,omitempty"`
	DataSlice DataSlice `json:"dataSlice,omitempty"`
	Filters []AccountFilter `json:"filters,omitempty"`
	WithContext bool `json:"withContext,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type AccountFilter struct {
	Memcmp map[string]interface{} `json:"memcmp,omitempty"`
	DataSize int64 `json:"dataSize,omitempty"`
}

type ProgramAccount struct {
	Pubkey Pubkey `json:"pubkey,omitempty"`
	Account AccountInfo `json:"account,omitempty"`
}

type PerformanceSample struct {
	Slot Slot `json:"slot,omitempty"`
	NumTransactions int64 `json:"numTransactions,omitempty"`
	NumSlots int64 `json:"numSlots,omitempty"`
	SamplePeriodSecs int64 `json:"samplePeriodSecs,omitempty"`
	NumNonVoteTransactions int64 `json:"numNonVoteTransactions,omitempty"`
}

type PrioritizationFee struct {
	Slot Slot `json:"slot,omitempty"`
	PrioritizationFee int64 `json:"prioritizationFee,omitempty"`
}

type GetSignatureStatusesConfig struct {
	SearchTransactionHistory bool `json:"searchTransactionHistory,omitempty"`
}

type SignatureStatusesResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value []SignatureStatus `json:"value,omitempty"`
}

type SignatureStatus struct {
	Slot Slot `json:"slot,omitempty"`
	Confirmations int64 `json:"confirmations,omitempty"`
	Err map[string]interface{} `json:"err,omitempty"`
	ConfirmationStatus Commitment `json:"confirmationStatus,omitempty"`
}

type GetSignaturesForAddressConfig struct {
	Limit int64 `json:"limit,omitempty"`
	Before Signature `json:"before,omitempty"`
	Until Signature `json:"until,omitempty"`
	Commitment Commitment `json:"commitment,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type SignatureInfo struct {
	Signature Signature `json:"signature,omitempty"`
	Slot Slot `json:"slot,omitempty"`
	Err map[string]interface{} `json:"err,omitempty"`
	Memo string `json:"memo,omitempty"`
	BlockTime int64 `json:"blockTime,omitempty"`
	ConfirmationStatus Commitment `json:"confirmationStatus,omitempty"`
}

type GetSupplyConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	ExcludeNonCirculatingAccountsList bool `json:"excludeNonCirculatingAccountsList,omitempty"`
}

type SupplyResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value map[string]interface{} `json:"value,omitempty"`
}

type TokenBalanceResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value TokenAmount `json:"value,omitempty"`
}

type TokenAmount struct {
	Amount string `json:"amount,omitempty"`
	Decimals int64 `json:"decimals,omitempty"`
	UiAmount float64 `json:"uiAmount,omitempty"`
	UiAmountString string `json:"uiAmountString,omitempty"`
}

type TokenAccountsFilter struct {
	Mint Pubkey `json:"mint,omitempty"`
	ProgramId Pubkey `json:"programId,omitempty"`
}

type GetTokenAccountsConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	Encoding Encoding `json:"encoding,omitempty"`
	DataSlice DataSlice `json:"dataSlice,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type TokenAccountsResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value []map[string]interface{} `json:"value,omitempty"`
}

type TokenLargestAccountsResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value []map[string]interface{} `json:"value,omitempty"`
}

type GetTransactionConfig struct {
	Encoding TransactionEncoding `json:"encoding,omitempty"`
	Commitment Commitment `json:"commitment,omitempty"`
	MaxSupportedTransactionVersion int64 `json:"maxSupportedTransactionVersion,omitempty"`
}

type TransactionResponse struct {
	Slot Slot `json:"slot,omitempty"`
	Transaction map[string]interface{} `json:"transaction,omitempty"`
	BlockTime int64 `json:"blockTime,omitempty"`
	Meta TransactionMeta `json:"meta,omitempty"`
	Version map[string]interface{} `json:"version,omitempty"`
}

type TransactionMeta struct {
	Err map[string]interface{} `json:"err,omitempty"`
	Fee int64 `json:"fee,omitempty"`
	PreBalances []int64 `json:"preBalances,omitempty"`
	PostBalances []int64 `json:"postBalances,omitempty"`
	InnerInstructions []interface{} `json:"innerInstructions,omitempty"`
	PreTokenBalances []interface{} `json:"preTokenBalances,omitempty"`
	PostTokenBalances []interface{} `json:"postTokenBalances,omitempty"`
	LogMessages []string `json:"logMessages,omitempty"`
	Rewards []interface{} `json:"rewards,omitempty"`
	LoadedAddresses map[string]interface{} `json:"loadedAddresses,omitempty"`
	ComputeUnitsConsumed int64 `json:"computeUnitsConsumed,omitempty"`
}

type Version struct {
	SolanaCore string `json:"solana-core,omitempty"`
	FeatureSet int64 `json:"feature-set,omitempty"`
}

type GetVoteAccountsConfig struct {
	Commitment Commitment `json:"commitment,omitempty"`
	VotePubkey Pubkey `json:"votePubkey,omitempty"`
	KeepUnstakedDelinquents bool `json:"keepUnstakedDelinquents,omitempty"`
	DelinquentSlotDistance int64 `json:"delinquentSlotDistance,omitempty"`
}

type VoteAccountsResponse struct {
	Current []VoteAccount `json:"current,omitempty"`
	Delinquent []VoteAccount `json:"delinquent,omitempty"`
}

type VoteAccount struct {
	VotePubkey Pubkey `json:"votePubkey,omitempty"`
	NodePubkey Pubkey `json:"nodePubkey,omitempty"`
	ActivatedStake int64 `json:"activatedStake,omitempty"`
	EpochVoteAccount bool `json:"epochVoteAccount,omitempty"`
	Commission int64 `json:"commission,omitempty"`
	LastVote Slot `json:"lastVote,omitempty"`
	EpochCredits []interface{} `json:"epochCredits,omitempty"`
	RootSlot Slot `json:"rootSlot,omitempty"`
}

type SendTransactionConfig struct {
	Encoding string `json:"encoding,omitempty"`
	SkipPreflight bool `json:"skipPreflight,omitempty"`
	PreflightCommitment Commitment `json:"preflightCommitment,omitempty"`
	MaxRetries int64 `json:"maxRetries,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
}

type SimulateTransactionConfig struct {
	SigVerify bool `json:"sigVerify,omitempty"`
	Commitment Commitment `json:"commitment,omitempty"`
	Encoding string `json:"encoding,omitempty"`
	ReplaceRecentBlockhash bool `json:"replaceRecentBlockhash,omitempty"`
	Accounts map[string]interface{} `json:"accounts,omitempty"`
	MinContextSlot int64 `json:"minContextSlot,omitempty"`
	InnerInstructions bool `json:"innerInstructions,omitempty"`
}

type SimulateTransactionResponse struct {
	Context RpcContext `json:"context,omitempty"`
	Value map[string]interface{} `json:"value,omitempty"`
}
