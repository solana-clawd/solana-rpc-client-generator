<?php
/**
 * Solana JSON-RPC API v2.0.0
 * Auto-generated Solana RPC Client
 */

namespace Solana\Rpc;

class SolanaRpcClient {
    public const MAINNET_BETA = "https://api.mainnet-beta.solana.com";
    public const DEVNET = "https://api.devnet.solana.com";
    public const TESTNET = "https://api.testnet.solana.com";

    private string $endpoint;
    private int $requestId = 0;

    public function __construct(string $endpoint = self::MAINNET_BETA) {
        $this->endpoint = $endpoint;
    }

    private function call(string $method, array $params): mixed {
        $this->requestId++;
        $request = [
            "jsonrpc" => "2.0",
            "id" => $this->requestId,
            "method" => $method,
            "params" => $params,
        ];

        $ch = curl_init($this->endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
            CURLOPT_POSTFIELDS => json_encode($request),
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $result = json_decode($response, true);
        if (isset($result["error"])) {
            throw new \Exception("RPC Error {$result['error']['code']}: {$result['error']['message']}");
        }

        return $result["result"] ?? null;
    }

    /** Returns all information associated with the account of provided Pubkey */
    public function getAccountInfo($pubkey, $config = null): mixed {
        $params = [];
        $params[] = $pubkey;
        if ($config !== null) $params[] = $config;
        return $this->call("getAccountInfo", $params);
    }

    /** Returns the lamport balance of the account of provided Pubkey */
    public function getBalance($pubkey, $config = null): mixed {
        $params = [];
        $params[] = $pubkey;
        if ($config !== null) $params[] = $config;
        return $this->call("getBalance", $params);
    }

    /** Returns identity and transaction information about a confirmed block in the ledger */
    public function getBlock($slot, $config = null): mixed {
        $params = [];
        $params[] = $slot;
        if ($config !== null) $params[] = $config;
        return $this->call("getBlock", $params);
    }

    /** Returns commitment for particular block */
    public function getBlockCommitment($slot): mixed {
        $params = [];
        $params[] = $slot;
        return $this->call("getBlockCommitment", $params);
    }

    /** Returns the current block height of the node */
    public function getBlockHeight($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getBlockHeight", $params);
    }

    /** Returns recent block production information from the current or previous epoch */
    public function getBlockProduction($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getBlockProduction", $params);
    }

    /** Returns the estimated production time of a block */
    public function getBlockTime($slot): mixed {
        $params = [];
        $params[] = $slot;
        return $this->call("getBlockTime", $params);
    }

    /** Returns a list of confirmed blocks between two slots */
    public function getBlocks($startSlot, $endSlot = null, $config = null): mixed {
        $params = [];
        $params[] = $startSlot;
        if ($endSlot !== null) $params[] = $endSlot;
        if ($config !== null) $params[] = $config;
        return $this->call("getBlocks", $params);
    }

    /** Returns a list of confirmed blocks starting at the given slot */
    public function getBlocksWithLimit($startSlot, $limit, $config = null): mixed {
        $params = [];
        $params[] = $startSlot;
        $params[] = $limit;
        if ($config !== null) $params[] = $config;
        return $this->call("getBlocksWithLimit", $params);
    }

    /** Returns information about all the nodes participating in the cluster */
    public function getClusterNodes(): mixed {
        $params = [];
        return $this->call("getClusterNodes", $params);
    }

    /** Returns information about the current epoch */
    public function getEpochInfo($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getEpochInfo", $params);
    }

    /** Returns the epoch schedule information from this cluster's genesis config */
    public function getEpochSchedule(): mixed {
        $params = [];
        return $this->call("getEpochSchedule", $params);
    }

    /** Returns the fee the network will charge for a particular message */
    public function getFeeForMessage($message, $config = null): mixed {
        $params = [];
        $params[] = $message;
        if ($config !== null) $params[] = $config;
        return $this->call("getFeeForMessage", $params);
    }

    /** Returns the slot of the lowest confirmed block that has not been purged from the ledger */
    public function getFirstAvailableBlock(): mixed {
        $params = [];
        return $this->call("getFirstAvailableBlock", $params);
    }

    /** Returns the genesis hash */
    public function getGenesisHash(): mixed {
        $params = [];
        return $this->call("getGenesisHash", $params);
    }

    /** Returns the current health of the node */
    public function getHealth(): mixed {
        $params = [];
        return $this->call("getHealth", $params);
    }

    /** Returns the highest slot information that the node has snapshots for */
    public function getHighestSnapshotSlot(): mixed {
        $params = [];
        return $this->call("getHighestSnapshotSlot", $params);
    }

    /** Returns the identity pubkey for the current node */
    public function getIdentity(): mixed {
        $params = [];
        return $this->call("getIdentity", $params);
    }

    /** Returns the current inflation governor */
    public function getInflationGovernor($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getInflationGovernor", $params);
    }

    /** Returns the specific inflation values for the current epoch */
    public function getInflationRate(): mixed {
        $params = [];
        return $this->call("getInflationRate", $params);
    }

    /** Returns the inflation / staking reward for a list of addresses for an epoch */
    public function getInflationReward($addresses, $config = null): mixed {
        $params = [];
        $params[] = $addresses;
        if ($config !== null) $params[] = $config;
        return $this->call("getInflationReward", $params);
    }

    /** Returns the 20 largest accounts, by lamport balance */
    public function getLargestAccounts($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getLargestAccounts", $params);
    }

    /** Returns the latest blockhash */
    public function getLatestBlockhash($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getLatestBlockhash", $params);
    }

    /** Returns the leader schedule for an epoch */
    public function getLeaderSchedule($slot = null, $config = null): mixed {
        $params = [];
        if ($slot !== null) $params[] = $slot;
        if ($config !== null) $params[] = $config;
        return $this->call("getLeaderSchedule", $params);
    }

    /** Get the max slot seen from retransmit stage */
    public function getMaxRetransmitSlot(): mixed {
        $params = [];
        return $this->call("getMaxRetransmitSlot", $params);
    }

    /** Get the max slot seen from after shred insert */
    public function getMaxShredInsertSlot(): mixed {
        $params = [];
        return $this->call("getMaxShredInsertSlot", $params);
    }

    /** Returns minimum balance required to make account rent exempt */
    public function getMinimumBalanceForRentExemption($dataLength, $config = null): mixed {
        $params = [];
        $params[] = $dataLength;
        if ($config !== null) $params[] = $config;
        return $this->call("getMinimumBalanceForRentExemption", $params);
    }

    /** Returns the account information for a list of Pubkeys */
    public function getMultipleAccounts($pubkeys, $config = null): mixed {
        $params = [];
        $params[] = $pubkeys;
        if ($config !== null) $params[] = $config;
        return $this->call("getMultipleAccounts", $params);
    }

    /** Returns all accounts owned by the provided program Pubkey */
    public function getProgramAccounts($programId, $config = null): mixed {
        $params = [];
        $params[] = $programId;
        if ($config !== null) $params[] = $config;
        return $this->call("getProgramAccounts", $params);
    }

    /** Returns a list of recent performance samples */
    public function getRecentPerformanceSamples($limit = null): mixed {
        $params = [];
        if ($limit !== null) $params[] = $limit;
        return $this->call("getRecentPerformanceSamples", $params);
    }

    /** Returns a list of prioritization fees from recent blocks */
    public function getRecentPrioritizationFees($addresses = null): mixed {
        $params = [];
        if ($addresses !== null) $params[] = $addresses;
        return $this->call("getRecentPrioritizationFees", $params);
    }

    /** Returns the statuses of a list of signatures */
    public function getSignatureStatuses($signatures, $config = null): mixed {
        $params = [];
        $params[] = $signatures;
        if ($config !== null) $params[] = $config;
        return $this->call("getSignatureStatuses", $params);
    }

    /** Returns signatures for confirmed transactions that include the given address */
    public function getSignaturesForAddress($address, $config = null): mixed {
        $params = [];
        $params[] = $address;
        if ($config !== null) $params[] = $config;
        return $this->call("getSignaturesForAddress", $params);
    }

    /** Returns the slot that has reached the given or default commitment level */
    public function getSlot($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getSlot", $params);
    }

    /** Returns the current slot leader */
    public function getSlotLeader($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getSlotLeader", $params);
    }

    /** Returns the slot leaders for a given slot range */
    public function getSlotLeaders($startSlot, $limit): mixed {
        $params = [];
        $params[] = $startSlot;
        $params[] = $limit;
        return $this->call("getSlotLeaders", $params);
    }

    /** Returns the stake minimum delegation, in lamports */
    public function getStakeMinimumDelegation($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getStakeMinimumDelegation", $params);
    }

    /** Returns information about the current supply */
    public function getSupply($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getSupply", $params);
    }

    /** Returns the token balance of an SPL Token account */
    public function getTokenAccountBalance($pubkey, $config = null): mixed {
        $params = [];
        $params[] = $pubkey;
        if ($config !== null) $params[] = $config;
        return $this->call("getTokenAccountBalance", $params);
    }

    /** Returns all SPL Token accounts by approved Delegate */
    public function getTokenAccountsByDelegate($delegate, $filter, $config = null): mixed {
        $params = [];
        $params[] = $delegate;
        $params[] = $filter;
        if ($config !== null) $params[] = $config;
        return $this->call("getTokenAccountsByDelegate", $params);
    }

    /** Returns all SPL Token accounts by token owner */
    public function getTokenAccountsByOwner($owner, $filter, $config = null): mixed {
        $params = [];
        $params[] = $owner;
        $params[] = $filter;
        if ($config !== null) $params[] = $config;
        return $this->call("getTokenAccountsByOwner", $params);
    }

    /** Returns the 20 largest accounts of a particular SPL Token type */
    public function getTokenLargestAccounts($mint, $config = null): mixed {
        $params = [];
        $params[] = $mint;
        if ($config !== null) $params[] = $config;
        return $this->call("getTokenLargestAccounts", $params);
    }

    /** Returns the total supply of an SPL Token type */
    public function getTokenSupply($mint, $config = null): mixed {
        $params = [];
        $params[] = $mint;
        if ($config !== null) $params[] = $config;
        return $this->call("getTokenSupply", $params);
    }

    /** Returns transaction details for a confirmed transaction */
    public function getTransaction($signature, $config = null): mixed {
        $params = [];
        $params[] = $signature;
        if ($config !== null) $params[] = $config;
        return $this->call("getTransaction", $params);
    }

    /** Returns the current Transaction count from the ledger */
    public function getTransactionCount($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getTransactionCount", $params);
    }

    /** Returns the current Solana version running on the node */
    public function getVersion(): mixed {
        $params = [];
        return $this->call("getVersion", $params);
    }

    /** Returns the account info and associated stake for all the voting accounts in the current bank */
    public function getVoteAccounts($config = null): mixed {
        $params = [];
        if ($config !== null) $params[] = $config;
        return $this->call("getVoteAccounts", $params);
    }

    /** Returns whether a blockhash is still valid or not */
    public function isBlockhashValid($blockhash, $config = null): mixed {
        $params = [];
        $params[] = $blockhash;
        if ($config !== null) $params[] = $config;
        return $this->call("isBlockhashValid", $params);
    }

    /** Returns the lowest slot that the node has information about in its ledger */
    public function minimumLedgerSlot(): mixed {
        $params = [];
        return $this->call("minimumLedgerSlot", $params);
    }

    /** Requests an airdrop of lamports to a Pubkey */
    public function requestAirdrop($pubkey, $lamports, $config = null): mixed {
        $params = [];
        $params[] = $pubkey;
        $params[] = $lamports;
        if ($config !== null) $params[] = $config;
        return $this->call("requestAirdrop", $params);
    }

    /** Submits a signed transaction to the cluster for processing */
    public function sendTransaction($transaction, $config = null): mixed {
        $params = [];
        $params[] = $transaction;
        if ($config !== null) $params[] = $config;
        return $this->call("sendTransaction", $params);
    }

    /** Simulate sending a transaction */
    public function simulateTransaction($transaction, $config = null): mixed {
        $params = [];
        $params[] = $transaction;
        if ($config !== null) $params[] = $config;
        return $this->call("simulateTransaction", $params);
    }

}