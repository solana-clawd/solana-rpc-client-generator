// Go Example - Solana RPC Client
//
// Run: go run example.go

package main

import (
	"context"
	"fmt"
	"log"

	solana "github.com/solana-rpc/client"
)

func main() {
	ctx := context.Background()
	client := solana.NewClient(solana.Devnet)

	// Get cluster version
	version, err := client.GetVersion(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Solana Version: %v\n", version)

	// Get current slot
	slot, err := client.GetSlot(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Current Slot: %v\n", slot)

	// Get epoch info
	epochInfo, err := client.GetEpochInfo(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Epoch: %v\n", epochInfo)

	// Get account balance
	pubkey := "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
	balance, err := client.GetBalance(ctx, pubkey, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Balance: %v\n", balance)

	// Get recent prioritization fees
	fees, err := client.GetRecentPrioritizationFees(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Recent Fee Samples: %v\n", fees)
}
