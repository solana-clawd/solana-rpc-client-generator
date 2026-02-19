#!/usr/bin/env ts-node
/**
 * Custom Java client generator for Solana RPC
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenRpcSpec {
  info: { title: string; version: string; description: string };
  methods: Method[];
  components: { schemas: Record<string, Schema> };
}

interface Method {
  name: string;
  summary: string;
  params: Param[];
  result: { name: string; schema: Schema };
}

interface Param {
  name: string;
  required: boolean;
  schema: Schema;
}

interface Schema {
  type?: string;
  $ref?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  enum?: string[];
  additionalProperties?: Schema;
}

function toJavaType(schema: Schema): string {
  if (schema.$ref) return schema.$ref.split('/').pop()!;
  if (schema.enum) return 'String';
  switch (schema.type) {
    case 'string': return 'String';
    case 'integer': return 'Long';
    case 'number': return 'Double';
    case 'boolean': return 'Boolean';
    case 'array': return schema.items ? `List<${toJavaType(schema.items)}>` : 'List<Object>';
    case 'object': return 'Map<String, Object>';
    default: return 'Object';
  }
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('package com.solana.rpc;');
  lines.push('');
  lines.push('import java.net.URI;');
  lines.push('import java.net.http.*;');
  lines.push('import java.util.*;');
  lines.push('import java.util.concurrent.atomic.AtomicLong;');
  lines.push('import com.google.gson.*;');
  lines.push('');
  lines.push('/**');
  lines.push(` * ${spec.info.title} v${spec.info.version}`);
  lines.push(' * Auto-generated Solana RPC Client');
  lines.push(' */');
  lines.push('public class SolanaRpcClient {');
  lines.push('    public static final String MAINNET_BETA = "https://api.mainnet-beta.solana.com";');
  lines.push('    public static final String DEVNET = "https://api.devnet.solana.com";');
  lines.push('    public static final String TESTNET = "https://api.testnet.solana.com";');
  lines.push('');
  lines.push('    private final String endpoint;');
  lines.push('    private final HttpClient httpClient;');
  lines.push('    private final Gson gson;');
  lines.push('    private final AtomicLong requestId;');
  lines.push('');
  lines.push('    public SolanaRpcClient(String endpoint) {');
  lines.push('        this.endpoint = endpoint;');
  lines.push('        this.httpClient = HttpClient.newHttpClient();');
  lines.push('        this.gson = new Gson();');
  lines.push('        this.requestId = new AtomicLong(0);');
  lines.push('    }');
  lines.push('');
  lines.push('    private JsonObject call(String method, List<Object> params) throws Exception {');
  lines.push('        Map<String, Object> request = new HashMap<>();');
  lines.push('        request.put("jsonrpc", "2.0");');
  lines.push('        request.put("id", requestId.incrementAndGet());');
  lines.push('        request.put("method", method);');
  lines.push('        request.put("params", params);');
  lines.push('');
  lines.push('        HttpRequest httpRequest = HttpRequest.newBuilder()');
  lines.push('            .uri(URI.create(endpoint))');
  lines.push('            .header("Content-Type", "application/json")');
  lines.push('            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(request)))');
  lines.push('            .build();');
  lines.push('');
  lines.push('        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());');
  lines.push('        JsonObject result = gson.fromJson(response.body(), JsonObject.class);');
  lines.push('');
  lines.push('        if (result.has("error") && !result.get("error").isJsonNull()) {');
  lines.push('            JsonObject error = result.getAsJsonObject("error");');
  lines.push('            throw new RuntimeException("RPC Error " + error.get("code") + ": " + error.get("message"));');
  lines.push('        }');
  lines.push('');
  lines.push('        return result.has("result") ? result.get("result").getAsJsonObject() : new JsonObject();');
  lines.push('    }');
  lines.push('');

  for (const method of spec.methods) {
    const params = method.params;
    const javaParams = params.map(p => `${toJavaType(p.schema)} ${p.name}`).join(', ');
    
    lines.push(`    /** ${method.summary} */`);
    lines.push(`    public JsonElement ${method.name}(${javaParams}) throws Exception {`);
    lines.push('        List<Object> params = new ArrayList<>();');
    for (const p of params) {
      if (p.required) {
        lines.push(`        params.add(${p.name});`);
      } else {
        lines.push(`        if (${p.name} != null) params.add(${p.name});`);
      }
    }
    lines.push(`        return call("${method.name}", params);`);
    lines.push('    }');
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'java', 'src', 'main', 'java', 'com', 'solana', 'rpc');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating Java client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'SolanaRpcClient.java'), generateClient(spec));

  // pom.xml
  const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.solana</groupId>
    <artifactId>solana-rpc-client</artifactId>
    <version>${spec.info.version}</version>
    <dependencies>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>
</project>`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'java', 'pom.xml'), pomXml);

  console.log('✅ Generated Java client');
}

main().catch(console.error);
