#!/usr/bin/env ts-node
/**
 * Custom Ruby client generator for Solana RPC
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
}

function toSnakeCase(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('# frozen_string_literal: true');
  lines.push('');
  lines.push('require "net/http"');
  lines.push('require "json"');
  lines.push('require "uri"');
  lines.push('');
  lines.push('module Solana');
  lines.push('  # Auto-generated Solana RPC Client');
  lines.push('  class RpcClient');
  lines.push('    MAINNET_BETA = "https://api.mainnet-beta.solana.com"');
  lines.push('    DEVNET = "https://api.devnet.solana.com"');
  lines.push('    TESTNET = "https://api.testnet.solana.com"');
  lines.push('');
  lines.push('    def initialize(endpoint = MAINNET_BETA)');
  lines.push('      @endpoint = URI.parse(endpoint)');
  lines.push('      @request_id = 0');
  lines.push('    end');
  lines.push('');
  lines.push('    private');
  lines.push('');
  lines.push('    def call(method, params)');
  lines.push('      @request_id += 1');
  lines.push('      request = {');
  lines.push('        jsonrpc: "2.0",');
  lines.push('        id: @request_id,');
  lines.push('        method: method,');
  lines.push('        params: params');
  lines.push('      }');
  lines.push('');
  lines.push('      http = Net::HTTP.new(@endpoint.host, @endpoint.port)');
  lines.push('      http.use_ssl = @endpoint.scheme == "https"');
  lines.push('');
  lines.push('      req = Net::HTTP::Post.new(@endpoint.path.empty? ? "/" : @endpoint.path)');
  lines.push('      req["Content-Type"] = "application/json"');
  lines.push('      req.body = request.to_json');
  lines.push('');
  lines.push('      response = http.request(req)');
  lines.push('      result = JSON.parse(response.body)');
  lines.push('');
  lines.push('      if result["error"]');
  lines.push('        raise "RPC Error #{result[\'error\'][\'code\']}: #{result[\'error\'][\'message\']}"');
  lines.push('      end');
  lines.push('');
  lines.push('      result["result"]');
  lines.push('    end');
  lines.push('');
  lines.push('    public');
  lines.push('');

  for (const method of spec.methods) {
    const rubyName = toSnakeCase(method.name);
    const params = method.params;
    const rubyParams = params.map(p => p.required ? p.name : `${p.name}: nil`).join(', ');

    lines.push(`    # ${method.summary}`);
    lines.push(`    def ${rubyName}(${rubyParams})`);
    lines.push('      params = []');
    for (const p of params) {
      if (p.required) {
        lines.push(`      params << ${p.name}`);
      } else {
        lines.push(`      params << ${p.name} unless ${p.name}.nil?`);
      }
    }
    lines.push(`      call("${method.name}", params)`);
    lines.push('    end');
    lines.push('');
  }

  lines.push('  end');
  lines.push('end');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'ruby', 'lib');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating Ruby client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'solana_rpc_client.rb'), generateClient(spec));

  const gemspec = `Gem::Specification.new do |s|
  s.name = "solana_rpc_client"
  s.version = "${spec.info.version}"
  s.summary = "Solana RPC Client"
  s.authors = ["Auto-generated"]
  s.files = Dir["lib/**/*.rb"]
  s.require_paths = ["lib"]
end`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'ruby', 'solana_rpc_client.gemspec'), gemspec);

  console.log('✅ Generated Ruby client');
}

main().catch(console.error);
