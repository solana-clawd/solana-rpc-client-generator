# Ruby Client Tests
# Run: ruby tests/ruby/client_test.rb

require 'minitest/autorun'
require_relative '../../generated/ruby/lib/solana_rpc_client'

class ClientTest < Minitest::Test
  TEST_PUBKEY = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg'

  def setup
    @client = Solana::RpcClient.new(Solana::RpcClient::DEVNET)
  end

  def test_get_version
    result = @client.get_version
    assert result.key?('solana-core')
    assert_kind_of String, result['solana-core']
  end

  def test_get_health
    result = @client.get_health
    assert_includes %w[ok behind unknown], result
  end

  def test_get_slot
    result = @client.get_slot
    assert_kind_of Integer, result
    assert result > 0
  end

  def test_get_block_height
    result = @client.get_block_height
    assert_kind_of Integer, result
    assert result > 0
  end

  def test_get_epoch_info
    result = @client.get_epoch_info
    assert result.key?('epoch')
    assert result.key?('slotIndex')
    assert result['epoch'] > 0
  end

  def test_get_balance
    result = @client.get_balance(TEST_PUBKEY)
    assert result.key?('context')
    assert result.key?('value')
    assert_kind_of Integer, result['value']
  end

  def test_get_account_info
    result = @client.get_account_info(TEST_PUBKEY)
    assert result.key?('value')
    assert result['value'].key?('lamports')
    assert result['value'].key?('owner')
  end

  def test_get_latest_blockhash
    result = @client.get_latest_blockhash
    assert result.key?('value')
    assert result['value'].key?('blockhash')
  end

  def test_get_genesis_hash
    result = @client.get_genesis_hash
    assert_kind_of String, result
    assert result.length > 30
  end

  def test_get_supply
    result = @client.get_supply
    assert result.key?('value')
    assert result['value'].key?('total')
  end

  def test_invalid_pubkey
    assert_raises(RuntimeError) do
      @client.get_balance('invalid')
    end
  end
end
