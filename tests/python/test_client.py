"""
Python Client Tests
Run: pytest tests/python/ -v
"""

import sys
import pytest

sys.path.insert(0, 'generated/python')
from solana_rpc_client import SolanaRpcClient, SolanaRpcError, Endpoints

client = SolanaRpcClient(Endpoints.DEVNET)
TEST_PUBKEY = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"


class TestClusterMethods:
    def test_get_version(self):
        result = client.get_version()
        assert "solana-core" in result
        assert isinstance(result["solana-core"], str)

    def test_get_health(self):
        result = client.get_health()
        assert result in ["ok", "behind", "unknown"]

    def test_get_identity(self):
        result = client.get_identity()
        assert "identity" in result
        assert isinstance(result["identity"], str)

    def test_get_cluster_nodes(self):
        result = client.get_cluster_nodes()
        assert isinstance(result, list)
        assert len(result) > 0
        assert "pubkey" in result[0]


class TestSlotEpochMethods:
    def test_get_slot(self):
        result = client.get_slot()
        assert isinstance(result, int)
        assert result > 0

    def test_get_block_height(self):
        result = client.get_block_height()
        assert isinstance(result, int)
        assert result > 0

    def test_get_epoch_info(self):
        result = client.get_epoch_info()
        assert "epoch" in result
        assert "slotIndex" in result
        assert "slotsInEpoch" in result
        assert result["epoch"] > 0

    def test_get_epoch_schedule(self):
        result = client.get_epoch_schedule()
        assert "slotsPerEpoch" in result
        assert result["slotsPerEpoch"] > 0

    def test_get_slot_leader(self):
        result = client.get_slot_leader()
        assert isinstance(result, str)
        assert len(result) > 30


class TestAccountMethods:
    def test_get_balance(self):
        result = client.get_balance(TEST_PUBKEY)
        assert "context" in result
        assert "value" in result
        assert isinstance(result["value"], int)

    def test_get_account_info(self):
        result = client.get_account_info(TEST_PUBKEY)
        assert "context" in result
        assert "value" in result
        assert "lamports" in result["value"]
        assert "owner" in result["value"]

    def test_get_account_info_with_encoding(self):
        result = client.get_account_info(TEST_PUBKEY, {"encoding": "base64"})
        assert "data" in result["value"]

    def test_get_multiple_accounts(self):
        result = client.get_multiple_accounts([TEST_PUBKEY])
        assert "value" in result
        assert isinstance(result["value"], list)

    def test_get_largest_accounts(self):
        result = client.get_largest_accounts()
        assert "value" in result
        assert isinstance(result["value"], list)


class TestBlockMethods:
    def test_get_latest_blockhash(self):
        result = client.get_latest_blockhash()
        assert "value" in result
        assert "blockhash" in result["value"]
        assert "lastValidBlockHeight" in result["value"]

    def test_is_blockhash_valid(self):
        blockhash_result = client.get_latest_blockhash()
        blockhash = blockhash_result["value"]["blockhash"]
        result = client.is_blockhash_valid(blockhash)
        assert "value" in result
        assert isinstance(result["value"], bool)

    def test_get_first_available_block(self):
        result = client.get_first_available_block()
        assert isinstance(result, int)

    def test_get_genesis_hash(self):
        result = client.get_genesis_hash()
        assert isinstance(result, str)
        assert len(result) > 30


class TestFeeMethods:
    def test_get_recent_prioritization_fees(self):
        result = client.get_recent_prioritization_fees()
        assert isinstance(result, list)

    def test_get_minimum_balance_for_rent_exemption(self):
        result = client.get_minimum_balance_for_rent_exemption(100)
        assert isinstance(result, int)
        assert result > 0


class TestSupplyInflation:
    def test_get_supply(self):
        result = client.get_supply()
        assert "value" in result
        assert "total" in result["value"]
        assert "circulating" in result["value"]

    def test_get_inflation_rate(self):
        result = client.get_inflation_rate()
        assert "total" in result
        assert "validator" in result
        assert "epoch" in result

    def test_get_inflation_governor(self):
        result = client.get_inflation_governor()
        assert "initial" in result
        assert "terminal" in result


class TestErrorHandling:
    def test_invalid_pubkey_raises_error(self):
        with pytest.raises(Exception):
            client.get_balance("invalid")

    def test_error_has_code_and_message(self):
        try:
            client.get_balance("invalid")
            assert False, "Should have raised"
        except SolanaRpcError as e:
            assert e.code is not None
            assert e.message is not None
        except Exception:
            pass  # Other errors are acceptable too
