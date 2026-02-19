from setuptools import setup, find_packages

setup(
    name="solana-rpc-client",
    version="2.0.0",
    description="Solana JSON-RPC API specification for interacting with Solana nodes",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[],
    extras_require={
        "httpx": ["httpx>=0.24.0"],
    },
)
