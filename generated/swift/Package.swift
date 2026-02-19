// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "SolanaRpcClient",
    platforms: [.macOS(.v12), .iOS(.v15)],
    products: [.library(name: "SolanaRpcClient", targets: ["SolanaRpcClient"])],
    targets: [.target(name: "SolanaRpcClient")]
)