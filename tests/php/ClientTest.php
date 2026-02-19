<?php
/**
 * PHP Client Tests
 * Run: phpunit tests/php/ClientTest.php
 */

require_once __DIR__ . '/../../generated/php/src/SolanaRpcClient.php';

use PHPUnit\Framework\TestCase;
use Solana\Rpc\SolanaRpcClient;

class ClientTest extends TestCase
{
    private SolanaRpcClient $client;
    private string $testPubkey = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';

    protected function setUp(): void
    {
        $this->client = new SolanaRpcClient(SolanaRpcClient::DEVNET);
    }

    public function testGetVersion(): void
    {
        $result = $this->client->getVersion();
        $this->assertArrayHasKey('solana-core', $result);
        $this->assertIsString($result['solana-core']);
    }

    public function testGetHealth(): void
    {
        $result = $this->client->getHealth();
        $this->assertContains($result, ['ok', 'behind', 'unknown']);
    }

    public function testGetSlot(): void
    {
        $result = $this->client->getSlot();
        $this->assertIsInt($result);
        $this->assertGreaterThan(0, $result);
    }

    public function testGetBlockHeight(): void
    {
        $result = $this->client->getBlockHeight();
        $this->assertIsInt($result);
        $this->assertGreaterThan(0, $result);
    }

    public function testGetEpochInfo(): void
    {
        $result = $this->client->getEpochInfo();
        $this->assertArrayHasKey('epoch', $result);
        $this->assertArrayHasKey('slotIndex', $result);
        $this->assertGreaterThan(0, $result['epoch']);
    }

    public function testGetBalance(): void
    {
        $result = $this->client->getBalance($this->testPubkey);
        $this->assertArrayHasKey('context', $result);
        $this->assertArrayHasKey('value', $result);
        $this->assertIsInt($result['value']);
    }

    public function testGetAccountInfo(): void
    {
        $result = $this->client->getAccountInfo($this->testPubkey);
        $this->assertArrayHasKey('value', $result);
        $this->assertArrayHasKey('lamports', $result['value']);
        $this->assertArrayHasKey('owner', $result['value']);
    }

    public function testGetLatestBlockhash(): void
    {
        $result = $this->client->getLatestBlockhash();
        $this->assertArrayHasKey('value', $result);
        $this->assertArrayHasKey('blockhash', $result['value']);
    }

    public function testGetGenesisHash(): void
    {
        $result = $this->client->getGenesisHash();
        $this->assertIsString($result);
        $this->assertGreaterThan(30, strlen($result));
    }

    public function testGetSupply(): void
    {
        $result = $this->client->getSupply();
        $this->assertArrayHasKey('value', $result);
        $this->assertArrayHasKey('total', $result['value']);
    }

    public function testInvalidPubkey(): void
    {
        $this->expectException(\Exception::class);
        $this->client->getBalance('invalid');
    }
}
