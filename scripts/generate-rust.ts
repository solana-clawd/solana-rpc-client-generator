#!/usr/bin/env ts-node
/**
 * Custom Rust client generator for Solana RPC
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenRpcSpec {
  info: { title: string; version: string };
  methods: Method[];
  components: { schemas: Record<string, Schema> };
}

interface Method {
  name: string;
  summary: string;
  params: Param[];
  result: { schema: Schema };
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
  properties?: Record<string, Schema>;
  enum?: string[];
}

function toSnakeCase(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function toRustType(schema: Schema): string {
  if (schema.$ref) return schema.$ref.split('/').pop()!;
  if (schema.enum) return 'String';
  switch (schema.type) {
    case 'string': return 'String';
    case 'integer': return 'i64';
    case 'number': return 'f64';
    case 'boolean': return 'bool';
    case 'array': return schema.items ? `Vec<${toRustType(schema.items)}>` : 'Vec<serde_json::Value>';
    case 'object': return 'serde_json::Value';
    default: return 'serde_json::Value';
  }
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('//! Auto-generated Solana RPC Client');
  lines.push('');
  lines.push('use reqwest::Client;');
  lines.push('use serde::{Deserialize, Serialize};');
  lines.push('use serde_json::{json, Value};');
  lines.push('use std::sync::atomic::{AtomicU64, Ordering};');
  lines.push('');
  lines.push('pub const MAINNET_BETA: &str = "https://api.mainnet-beta.solana.com";');
  lines.push('pub const DEVNET: &str = "https://api.devnet.solana.com";');
  lines.push('pub const TESTNET: &str = "https://api.testnet.solana.com";');
  lines.push('');
  lines.push('#[derive(Debug, Deserialize)]');
  lines.push('struct RpcResponse {');
  lines.push('    result: Option<Value>,');
  lines.push('    error: Option<RpcError>,');
  lines.push('}');
  lines.push('');
  lines.push('#[derive(Debug, Deserialize)]');
  lines.push('pub struct RpcError {');
  lines.push('    pub code: i64,');
  lines.push('    pub message: String,');
  lines.push('}');
  lines.push('');
  lines.push('pub struct SolanaRpcClient {');
  lines.push('    endpoint: String,');
  lines.push('    client: Client,');
  lines.push('    request_id: AtomicU64,');
  lines.push('}');
  lines.push('');
  lines.push('impl SolanaRpcClient {');
  lines.push('    pub fn new(endpoint: &str) -> Self {');
  lines.push('        Self {');
  lines.push('            endpoint: endpoint.to_string(),');
  lines.push('            client: Client::new(),');
  lines.push('            request_id: AtomicU64::new(0),');
  lines.push('        }');
  lines.push('    }');
  lines.push('');
  lines.push('    async fn call(&self, method: &str, params: Vec<Value>) -> Result<Value, String> {');
  lines.push('        let id = self.request_id.fetch_add(1, Ordering::SeqCst);');
  lines.push('        let request = json!({');
  lines.push('            "jsonrpc": "2.0",');
  lines.push('            "id": id,');
  lines.push('            "method": method,');
  lines.push('            "params": params,');
  lines.push('        });');
  lines.push('');
  lines.push('        let response: RpcResponse = self.client');
  lines.push('            .post(&self.endpoint)');
  lines.push('            .json(&request)');
  lines.push('            .send()');
  lines.push('            .await');
  lines.push('            .map_err(|e| e.to_string())?');
  lines.push('            .json()');
  lines.push('            .await');
  lines.push('            .map_err(|e| e.to_string())?;');
  lines.push('');
  lines.push('        if let Some(error) = response.error {');
  lines.push('            return Err(format!("RPC error {}: {}", error.code, error.message));');
  lines.push('        }');
  lines.push('');
  lines.push('        Ok(response.result.unwrap_or(Value::Null))');
  lines.push('    }');
  lines.push('');

  for (const method of spec.methods) {
    const rustName = toSnakeCase(method.name);
    const params = method.params;
    const rustParams = params.map(p => {
      const type = toRustType(p.schema);
      return p.required ? `${toSnakeCase(p.name)}: ${type}` : `${toSnakeCase(p.name)}: Option<${type}>`;
    }).join(', ');

    lines.push(`    /// ${method.summary}`);
    lines.push(`    pub async fn ${rustName}(&self${params.length ? ', ' + rustParams : ''}) -> Result<Value, String> {`);
    lines.push('        let mut params = Vec::new();');
    for (const p of params) {
      const name = toSnakeCase(p.name);
      if (p.required) {
        lines.push(`        params.push(json!(${name}));`);
      } else {
        lines.push(`        if let Some(v) = ${name} { params.push(json!(v)); }`);
      }
    }
    lines.push(`        self.call("${method.name}", params).await`);
    lines.push('    }');
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'rust', 'src');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating Rust client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'lib.rs'), generateClient(spec));

  const cargoToml = `[package]
name = "solana-rpc-client"
version = "${spec.info.version}"
edition = "2021"

[dependencies]
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'rust', 'Cargo.toml'), cargoToml);

  console.log('✅ Generated Rust client');
}

main().catch(console.error);
