#!/usr/bin/env ts-node
/**
 * Custom Swift client generator for Solana RPC
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenRpcSpec {
  info: { title: string; version: string };
  methods: Method[];
}

interface Method {
  name: string;
  summary: string;
  params: Param[];
}

interface Param {
  name: string;
  required: boolean;
  schema: Schema;
}

interface Schema {
  type?: string;
  $ref?: string;
  items?: Schema;
}

function toSwiftType(schema: Schema): string {
  if (schema.$ref) return 'Any';
  switch (schema.type) {
    case 'string': return 'String';
    case 'integer': return 'Int64';
    case 'number': return 'Double';
    case 'boolean': return 'Bool';
    case 'array': return '[Any]';
    case 'object': return '[String: Any]';
    default: return 'Any';
  }
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('import Foundation');
  lines.push('');
  lines.push('/// Auto-generated Solana RPC Client');
  lines.push('public class SolanaRpcClient {');
  lines.push('    public static let mainnetBeta = "https://api.mainnet-beta.solana.com"');
  lines.push('    public static let devnet = "https://api.devnet.solana.com"');
  lines.push('    public static let testnet = "https://api.testnet.solana.com"');
  lines.push('');
  lines.push('    private let endpoint: URL');
  lines.push('    private var requestId: Int64 = 0');
  lines.push('');
  lines.push('    public init(endpoint: String = mainnetBeta) {');
  lines.push('        self.endpoint = URL(string: endpoint)!');
  lines.push('    }');
  lines.push('');
  lines.push('    private func call(_ method: String, params: [Any]) async throws -> Any {');
  lines.push('        requestId += 1');
  lines.push('        let request: [String: Any] = [');
  lines.push('            "jsonrpc": "2.0",');
  lines.push('            "id": requestId,');
  lines.push('            "method": method,');
  lines.push('            "params": params');
  lines.push('        ]');
  lines.push('');
  lines.push('        var urlRequest = URLRequest(url: endpoint)');
  lines.push('        urlRequest.httpMethod = "POST"');
  lines.push('        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")');
  lines.push('        urlRequest.httpBody = try JSONSerialization.data(withJSONObject: request)');
  lines.push('');
  lines.push('        let (data, _) = try await URLSession.shared.data(for: urlRequest)');
  lines.push('        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]');
  lines.push('');
  lines.push('        if let error = json["error"] as? [String: Any] {');
  lines.push('            throw NSError(domain: "SolanaRPC", code: error["code"] as? Int ?? -1,');
  lines.push('                         userInfo: [NSLocalizedDescriptionKey: error["message"] as? String ?? "Unknown error"])');
  lines.push('        }');
  lines.push('');
  lines.push('        return json["result"] ?? NSNull()');
  lines.push('    }');
  lines.push('');

  for (const method of spec.methods) {
    const params = method.params;
    const swiftParams = params.map(p => {
      const type = toSwiftType(p.schema);
      return p.required ? `${p.name}: ${type}` : `${p.name}: ${type}? = nil`;
    }).join(', ');

    lines.push(`    /// ${method.summary}`);
    lines.push(`    public func ${method.name}(${swiftParams}) async throws -> Any {`);
    lines.push('        var params: [Any] = []');
    for (const p of params) {
      if (p.required) {
        lines.push(`        params.append(${p.name})`);
      } else {
        lines.push(`        if let v = ${p.name} { params.append(v) }`);
      }
    }
    lines.push(`        return try await call("${method.name}", params: params)`);
    lines.push('    }');
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'swift', 'Sources', 'SolanaRpcClient');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating Swift client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'SolanaRpcClient.swift'), generateClient(spec));

  const packageSwift = `// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "SolanaRpcClient",
    platforms: [.macOS(.v12), .iOS(.v15)],
    products: [.library(name: "SolanaRpcClient", targets: ["SolanaRpcClient"])],
    targets: [.target(name: "SolanaRpcClient")]
)`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'swift', 'Package.swift'), packageSwift);

  console.log('✅ Generated Swift client');
}

main().catch(console.error);
