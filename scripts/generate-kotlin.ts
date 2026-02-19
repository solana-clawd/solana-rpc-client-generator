#!/usr/bin/env ts-node
/**
 * Custom Kotlin client generator for Solana RPC
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

function toKotlinType(schema: Schema): string {
  if (schema.$ref) return 'Any';
  switch (schema.type) {
    case 'string': return 'String';
    case 'integer': return 'Long';
    case 'number': return 'Double';
    case 'boolean': return 'Boolean';
    case 'array': return 'List<Any>';
    case 'object': return 'Map<String, Any>';
    default: return 'Any';
  }
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('package com.solana.rpc');
  lines.push('');
  lines.push('import kotlinx.serialization.json.*');
  lines.push('import java.net.HttpURLConnection');
  lines.push('import java.net.URL');
  lines.push('import java.util.concurrent.atomic.AtomicLong');
  lines.push('');
  lines.push('/**');
  lines.push(` * ${spec.info.title} v${spec.info.version}`);
  lines.push(' * Auto-generated Solana RPC Client');
  lines.push(' */');
  lines.push('class SolanaRpcClient(private val endpoint: String = MAINNET_BETA) {');
  lines.push('    companion object {');
  lines.push('        const val MAINNET_BETA = "https://api.mainnet-beta.solana.com"');
  lines.push('        const val DEVNET = "https://api.devnet.solana.com"');
  lines.push('        const val TESTNET = "https://api.testnet.solana.com"');
  lines.push('    }');
  lines.push('');
  lines.push('    private val requestId = AtomicLong(0)');
  lines.push('    private val json = Json { ignoreUnknownKeys = true }');
  lines.push('');
  lines.push('    private fun call(method: String, params: List<Any?>): JsonElement {');
  lines.push('        val id = requestId.incrementAndGet()');
  lines.push('        val request = buildJsonObject {');
  lines.push('            put("jsonrpc", "2.0")');
  lines.push('            put("id", id)');
  lines.push('            put("method", method)');
  lines.push('            put("params", json.encodeToJsonElement(params))');
  lines.push('        }');
  lines.push('');
  lines.push('        val connection = URL(endpoint).openConnection() as HttpURLConnection');
  lines.push('        connection.requestMethod = "POST"');
  lines.push('        connection.setRequestProperty("Content-Type", "application/json")');
  lines.push('        connection.doOutput = true');
  lines.push('        connection.outputStream.write(request.toString().toByteArray())');
  lines.push('');
  lines.push('        val response = connection.inputStream.bufferedReader().readText()');
  lines.push('        val result = json.parseToJsonElement(response).jsonObject');
  lines.push('');
  lines.push('        result["error"]?.let { error ->');
  lines.push('            val errorObj = error.jsonObject');
  lines.push('            throw RuntimeException("RPC Error ${errorObj["code"]}: ${errorObj["message"]}")');
  lines.push('        }');
  lines.push('');
  lines.push('        return result["result"] ?: JsonNull');
  lines.push('    }');
  lines.push('');

  for (const method of spec.methods) {
    const params = method.params;
    const kotlinParams = params.map(p => {
      const type = toKotlinType(p.schema);
      return p.required ? `${p.name}: ${type}` : `${p.name}: ${type}? = null`;
    }).join(', ');

    lines.push(`    /** ${method.summary} */`);
    lines.push(`    fun ${method.name}(${kotlinParams}): JsonElement {`);
    lines.push('        val params = mutableListOf<Any?>()');
    for (const p of params) {
      if (p.required) {
        lines.push(`        params.add(${p.name})`);
      } else {
        lines.push(`        ${p.name}?.let { params.add(it) }`);
      }
    }
    lines.push(`        return call("${method.name}", params)`);
    lines.push('    }');
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'kotlin', 'src', 'main', 'kotlin', 'com', 'solana', 'rpc');

  const spec: OpenRpcSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  console.log(`Generating Kotlin client with ${spec.methods.length} methods...`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'SolanaRpcClient.kt'), generateClient(spec));

  const buildGradle = `plugins {
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.serialization") version "1.9.0"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
}`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'kotlin', 'build.gradle.kts'), buildGradle);

  console.log('✅ Generated Kotlin client');
}

main().catch(console.error);
