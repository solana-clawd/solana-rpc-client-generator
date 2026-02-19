// Go Client Tests
// Run: go test ./tests/go/ -v

package solana_test

import (
	"context"
	"testing"

	solana "github.com/solana-rpc/client"
)

var (
	client     = solana.NewClient(solana.Devnet)
	ctx        = context.Background()
	testPubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
)

func TestGetVersion(t *testing.T) {
	result, err := client.GetVersion(ctx)
	if err != nil {
		t.Fatalf("GetVersion failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetVersion returned nil")
	}
}

func TestGetHealth(t *testing.T) {
	result, err := client.GetHealth(ctx)
	if err != nil {
		t.Fatalf("GetHealth failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetHealth returned nil")
	}
}

func TestGetSlot(t *testing.T) {
	result, err := client.GetSlot(ctx, nil)
	if err != nil {
		t.Fatalf("GetSlot failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetSlot returned nil")
	}
}

func TestGetBlockHeight(t *testing.T) {
	result, err := client.GetBlockHeight(ctx, nil)
	if err != nil {
		t.Fatalf("GetBlockHeight failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetBlockHeight returned nil")
	}
}

func TestGetEpochInfo(t *testing.T) {
	result, err := client.GetEpochInfo(ctx, nil)
	if err != nil {
		t.Fatalf("GetEpochInfo failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetEpochInfo returned nil")
	}
}

func TestGetBalance(t *testing.T) {
	result, err := client.GetBalance(ctx, testPubkey, nil)
	if err != nil {
		t.Fatalf("GetBalance failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetBalance returned nil")
	}
}

func TestGetAccountInfo(t *testing.T) {
	result, err := client.GetAccountInfo(ctx, testPubkey, nil)
	if err != nil {
		t.Fatalf("GetAccountInfo failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetAccountInfo returned nil")
	}
}

func TestGetLatestBlockhash(t *testing.T) {
	result, err := client.GetLatestBlockhash(ctx, nil)
	if err != nil {
		t.Fatalf("GetLatestBlockhash failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetLatestBlockhash returned nil")
	}
}

func TestGetGenesisHash(t *testing.T) {
	result, err := client.GetGenesisHash(ctx)
	if err != nil {
		t.Fatalf("GetGenesisHash failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetGenesisHash returned nil")
	}
}

func TestGetSupply(t *testing.T) {
	result, err := client.GetSupply(ctx, nil)
	if err != nil {
		t.Fatalf("GetSupply failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetSupply returned nil")
	}
}

func TestGetRecentPrioritizationFees(t *testing.T) {
	result, err := client.GetRecentPrioritizationFees(ctx, nil)
	if err != nil {
		t.Fatalf("GetRecentPrioritizationFees failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetRecentPrioritizationFees returned nil")
	}
}

func TestGetMinimumBalanceForRentExemption(t *testing.T) {
	result, err := client.GetMinimumBalanceForRentExemption(ctx, 100, nil)
	if err != nil {
		t.Fatalf("GetMinimumBalanceForRentExemption failed: %v", err)
	}
	if result == nil {
		t.Fatal("GetMinimumBalanceForRentExemption returned nil")
	}
}

func TestInvalidPubkey(t *testing.T) {
	_, err := client.GetBalance(ctx, "invalid", nil)
	if err == nil {
		t.Fatal("Expected error for invalid pubkey")
	}
}
