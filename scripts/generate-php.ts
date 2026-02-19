#!/usr/bin/env ts-node
/**
 * Custom PHP client generator for Solana RPC
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
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('<?php');
  lines.push('/**');
  lines.push(` * ${spec.info.title} v${spec.info.version}`);
  lines.push(' * Auto-generated Solana RPC Client');
  lines.push(' */');
  lines.push('');
  lines.push('namespace Solana\\Rpc;');
  lines.push('');
  lines.push('class SolanaRpcClient {');
  lines.push('    public const MAINNET_BETA = "https://api.mainnet-beta.solana.com";');
  lines.push('    public const DEVNET = "https://api.devnet.solana.com";');
  lines.push('    public const TESTNET = "https://api.testnet.solana.com";');
  lines.push('');
  lines.push('    private string $endpoint;');
  lines.push('    private int $requestId = 0;');
  lines.push('');
  lines.push('    public function __construct(string $endpoint = self::MAINNET_BETA) {');
  lines.push('        $this->endpoint = $endpoint;');
  lines.push('    }');
  lines.push('');
  lines.push('    private function call(string $method, array $params): mixed {');
  lines.push('        $this->requestId++;');
  lines.push('        $request = [');
  lines.push('            "jsonrpc" => "2.0",');
  lines.push('            "id" => $this->requestId,');
  lines.push('            "method" => $method,');
  lines.push('            "params" => $params,');
  lines.push('        ];');
  lines.push('');
  lines.push('        $ch = curl_init($this->endpoint);');
  lines.push('        curl_setopt_array($ch, [');
  lines.push('            CURLOPT_RETURNTRANSFER => true,');
  lines.push('            CURLOPT_POST => true,');
  lines.push('            CURLOPT_HTTPHEADER => ["Content-Type: application/json"],');
  lines.push('            CURLOPT_POSTFIELDS => json_encode($request),');
  lines.push('        ]);');
  lines.push('');
  lines.push('        $response = curl_exec($ch);');
  lines.push('        curl_close($ch);');
  lines.push('');
  lines.push('        $result = json_decode($response, true);');
  lines.push('        if (isset($result["error"])) {');
  lines.push('            throw new \\Exception("RPC Error {$result[\'error\'][\'code\']}: {$result[\'error\'][\'message\']}");');
  lines.push('        }');
  lines.push('');
  lines.push('        return $result["result"] ?? null;');
  lines.push('    }');
  lines.push('');

  for (const method of spec.methods) {
    const params = method.params;
    const phpParams = params.map(p => p.required ? `$${p.name}` : `$${p.name} = null`).join(', ');

    lines.push(`    /** ${method.summary} */`);
    lines.push(`    public function ${method.name}(${phpParams}): mixed {`);
    lines.push('        $params = [];');
    for (const p of params) {
      if (p.required) {
        lines.push(`        $params[] = $${p.name};`);
      } else {
        lines.push(`        if ($${p.name} !== null) $params[] = $${p.name};`);
      }
    }
    lines.push(`        return $this->call("${method.name}", $params);`);
    lines.push('    }');
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'php', 'src');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating PHP client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'SolanaRpcClient.php'), generateClient(spec));

  const composerJson = `{
  "name": "solana/rpc-client",
  "version": "${spec.info.version}",
  "autoload": { "psr-4": { "Solana\\\\Rpc\\\\": "src/" } },
  "require": { "php": ">=8.0" }
}`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'php', 'composer.json'), composerJson);

  console.log('✅ Generated PHP client');
}

main().catch(console.error);
