#!/usr/bin/env ts-node
/**
 * Custom C# client generator for Solana RPC
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
  enum?: string[];
}

function toCSharpType(schema: Schema): string {
  if (schema.$ref) return schema.$ref.split('/').pop()!;
  if (schema.enum) return 'string';
  switch (schema.type) {
    case 'string': return 'string';
    case 'integer': return 'long';
    case 'number': return 'double';
    case 'boolean': return 'bool';
    case 'array': return schema.items ? `List<${toCSharpType(schema.items)}>` : 'List<object>';
    case 'object': return 'Dictionary<string, object>';
    default: return 'object';
  }
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('using System;');
  lines.push('using System.Collections.Generic;');
  lines.push('using System.Net.Http;');
  lines.push('using System.Text;');
  lines.push('using System.Text.Json;');
  lines.push('using System.Threading.Tasks;');
  lines.push('');
  lines.push('namespace Solana.Rpc');
  lines.push('{');
  lines.push('    /// <summary>Auto-generated Solana RPC Client</summary>');
  lines.push('    public class SolanaRpcClient');
  lines.push('    {');
  lines.push('        public static readonly string MainnetBeta = "https://api.mainnet-beta.solana.com";');
  lines.push('        public static readonly string Devnet = "https://api.devnet.solana.com";');
  lines.push('        public static readonly string Testnet = "https://api.testnet.solana.com";');
  lines.push('');
  lines.push('        private readonly string _endpoint;');
  lines.push('        private readonly HttpClient _httpClient;');
  lines.push('        private long _requestId;');
  lines.push('');
  lines.push('        public SolanaRpcClient(string endpoint)');
  lines.push('        {');
  lines.push('            _endpoint = endpoint;');
  lines.push('            _httpClient = new HttpClient();');
  lines.push('        }');
  lines.push('');
  lines.push('        private async Task<JsonElement> CallAsync(string method, List<object> parameters)');
  lines.push('        {');
  lines.push('            var request = new { jsonrpc = "2.0", id = ++_requestId, method, @params = parameters };');
  lines.push('            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");');
  lines.push('            var response = await _httpClient.PostAsync(_endpoint, content);');
  lines.push('            var json = await response.Content.ReadAsStringAsync();');
  lines.push('            var result = JsonSerializer.Deserialize<JsonElement>(json);');
  lines.push('            if (result.TryGetProperty("error", out var error) && error.ValueKind != JsonValueKind.Null)');
  lines.push('                throw new Exception($"RPC Error: {error}");');
  lines.push('            return result.GetProperty("result");');
  lines.push('        }');
  lines.push('');

  for (const method of spec.methods) {
    const params = method.params;
    const csParams = params.map(p => {
      const type = toCSharpType(p.schema);
      return p.required ? `${type} ${p.name}` : `${type} ${p.name} = default`;
    }).join(', ');

    lines.push(`        /// <summary>${method.summary}</summary>`);
    lines.push(`        public async Task<JsonElement> ${method.name.charAt(0).toUpperCase() + method.name.slice(1)}Async(${csParams})`);
    lines.push('        {');
    lines.push('            var parameters = new List<object>();');
    for (const p of params) {
      if (p.required) {
        lines.push(`            parameters.Add(${p.name});`);
      } else {
        lines.push(`            if (${p.name} != default) parameters.Add(${p.name});`);
      }
    }
    lines.push(`            return await CallAsync("${method.name}", parameters);`);
    lines.push('        }');
    lines.push('');
  }

  lines.push('    }');
  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'csharp');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating C# client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'SolanaRpcClient.cs'), generateClient(spec));

  const csproj = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <PackageId>Solana.Rpc.Client</PackageId>
    <Version>${spec.info.version}</Version>
  </PropertyGroup>
</Project>`;
  fs.writeFileSync(path.join(outDir, 'Solana.Rpc.Client.csproj'), csproj);

  console.log('✅ Generated C# client');
}

main().catch(console.error);
