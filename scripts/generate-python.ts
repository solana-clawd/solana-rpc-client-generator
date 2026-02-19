#!/usr/bin/env ts-node
/**
 * Custom Python client generator for Solana RPC
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenRpcSpec {
  info: { title: string; version: string; description: string };
  servers: Array<{ name: string; url: string }>;
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
  description?: string;
}

interface Schema {
  type?: string;
  $ref?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  enum?: string[];
  additionalProperties?: Schema;
}

function toSnakeCase(name: string): string {
  // Handle kebab-case first, then camelCase
  return name
    .replace(/-/g, '_')
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/__+/g, '_');
}

function toPythonClassName(name: string): string {
  return name;
}

function schemaToPythonType(schema: Schema, spec: OpenRpcSpec): string {
  if (schema.$ref) {
    return `"${schema.$ref.split('/').pop()}"`;
  }

  if (schema.enum) {
    return 'str';
  }

  switch (schema.type) {
    case 'string':
      return 'str';
    case 'integer':
      return 'int';
    case 'number':
      return 'float';
    case 'boolean':
      return 'bool';
    case 'array':
      if (schema.items) {
        return `List[${schemaToPythonType(schema.items, spec)}]`;
      }
      return 'List[Any]';
    case 'object':
      if (schema.additionalProperties) {
        return `Dict[str, ${schemaToPythonType(schema.additionalProperties, spec)}]`;
      }
      return 'Dict[str, Any]';
    default:
      return 'Any';
  }
}

function generateTypes(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('"""Auto-generated Solana RPC Types"""');
  lines.push('from __future__ import annotations');
  lines.push('from dataclasses import dataclass, field');
  lines.push('from typing import Any, Dict, List, Optional, Union');
  lines.push('from enum import Enum');
  lines.push('');

  // Generate enums first
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (schema.enum) {
      lines.push(`class ${name}(str, Enum):`);
      for (const val of schema.enum) {
        const enumName = val.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        lines.push(`    ${enumName} = "${val}"`);
      }
      lines.push('');
    }
  }

  // Generate dataclasses
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (schema.type === 'object' && schema.properties) {
      lines.push('@dataclass');
      lines.push(`class ${name}:`);
      lines.push(`    """${name} type"""`);

      const fields: string[] = [];
      const optionalFields: string[] = [];

      for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
        const pyFieldName = toSnakeCase(fieldName);
        let pyType = schemaToPythonType(fieldSchema, spec);
        // Make all fields optional for flexibility
        fields.push(`    ${pyFieldName}: Optional[${pyType}] = None`);
      }

      if (fields.length === 0) {
        lines.push('    pass');
      } else {
        lines.push(...fields);
      }
      lines.push('');
    }
  }

  // Type aliases
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (!schema.enum && !(schema.type === 'object' && schema.properties)) {
      const pyType = schemaToPythonType(schema, spec);
      lines.push(`${name} = ${pyType.replace(/"/g, '')}`);
    }
  }

  return lines.join('\n');
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];

  lines.push('"""');
  lines.push(`Auto-generated Solana RPC Client`);
  lines.push(`${spec.info.title} v${spec.info.version}`);
  lines.push('"""');
  lines.push('from __future__ import annotations');
  lines.push('import json');
  lines.push('from typing import Any, Dict, List, Optional, Union');
  lines.push('from dataclasses import asdict');
  lines.push('');
  lines.push('try:');
  lines.push('    import httpx');
  lines.push('    HAS_HTTPX = True');
  lines.push('except ImportError:');
  lines.push('    import urllib.request');
  lines.push('    HAS_HTTPX = False');
  lines.push('');
  lines.push('from .types import *');
  lines.push('');

  // Endpoints
  lines.push('class Endpoints:');
  lines.push('    MAINNET_BETA = "https://api.mainnet-beta.solana.com"');
  lines.push('    DEVNET = "https://api.devnet.solana.com"');
  lines.push('    TESTNET = "https://api.testnet.solana.com"');
  lines.push('');

  // RPC Error
  lines.push('class SolanaRpcError(Exception):');
  lines.push('    """RPC Error from Solana node"""');
  lines.push('    def __init__(self, code: int, message: str, data: Any = None):');
  lines.push('        self.code = code');
  lines.push('        self.message = message');
  lines.push('        self.data = data');
  lines.push('        super().__init__(f"RPC error {code}: {message}")');
  lines.push('');

  // Client class
  lines.push('class SolanaRpcClient:');
  lines.push('    """Solana JSON-RPC Client"""');
  lines.push('');
  lines.push('    def __init__(self, endpoint: str = Endpoints.MAINNET_BETA, headers: Optional[Dict[str, str]] = None):');
  lines.push('        self.endpoint = endpoint');
  lines.push('        self.headers = {"Content-Type": "application/json", **(headers or {})}');
  lines.push('        self._request_id = 0');
  lines.push('        if HAS_HTTPX:');
  lines.push('            self._client = httpx.Client(headers=self.headers)');
  lines.push('        else:');
  lines.push('            self._client = None');
  lines.push('');

  // Generic call method
  lines.push('    def _call(self, method: str, params: List[Any]) -> Any:');
  lines.push('        self._request_id += 1');
  lines.push('        payload = {');
  lines.push('            "jsonrpc": "2.0",');
  lines.push('            "id": self._request_id,');
  lines.push('            "method": method,');
  lines.push('            "params": params,');
  lines.push('        }');
  lines.push('');
  lines.push('        if HAS_HTTPX:');
  lines.push('            response = self._client.post(self.endpoint, json=payload)');
  lines.push('            result = response.json()');
  lines.push('        else:');
  lines.push('            req = urllib.request.Request(');
  lines.push('                self.endpoint,');
  lines.push('                data=json.dumps(payload).encode(),');
  lines.push('                headers=self.headers,');
  lines.push('                method="POST"');
  lines.push('            )');
  lines.push('            with urllib.request.urlopen(req) as resp:');
  lines.push('                result = json.loads(resp.read().decode())');
  lines.push('');
  lines.push('        if "error" in result and result["error"]:');
  lines.push('            err = result["error"]');
  lines.push('            raise SolanaRpcError(err.get("code", -1), err.get("message", "Unknown error"), err.get("data"))');
  lines.push('');
  lines.push('        return result.get("result")');
  lines.push('');

  // Generate methods
  for (const method of spec.methods) {
    const methodName = toSnakeCase(method.name);
    const params = method.params;

    // Build parameter list
    const pyParams = ['self'];
    for (const p of params) {
      const paramName = toSnakeCase(p.name);
      let pyType = schemaToPythonType(p.schema, spec).replace(/"/g, '');
      if (!p.required) {
        pyParams.push(`${paramName}: Optional[${pyType}] = None`);
      } else {
        pyParams.push(`${paramName}: ${pyType}`);
      }
    }

    // Generate doc comment
    lines.push(`    def ${methodName}(${pyParams.join(', ')}) -> Any:`);
    lines.push(`        """${method.summary}"""`);
    lines.push('        params = []');

    for (const p of params) {
      const paramName = toSnakeCase(p.name);
      if (p.required) {
        lines.push(`        params.append(${paramName})`);
      } else {
        lines.push(`        if ${paramName} is not None:`);
        lines.push(`            params.append(${paramName})`);
      }
    }

    lines.push(`        return self._call("${method.name}", params)`);
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'python', 'solana_rpc_client');

  console.log('Reading OpenRPC spec...');
  const specContent = fs.readFileSync(specPath, 'utf-8');
  const spec: OpenRpcSpec = JSON.parse(specContent);

  console.log(`Found ${spec.methods.length} methods`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Generate types
  console.log('Generating types.py...');
  fs.writeFileSync(path.join(outDir, 'types.py'), generateTypes(spec));

  // Generate client
  console.log('Generating client.py...');
  fs.writeFileSync(path.join(outDir, 'client.py'), generateClient(spec));

  // Generate __init__.py
  const initPy = `"""Solana RPC Client - Auto-generated from OpenRPC specification"""
from .client import SolanaRpcClient, SolanaRpcError, Endpoints
from .types import *

__version__ = "${spec.info.version}"
__all__ = ["SolanaRpcClient", "SolanaRpcError", "Endpoints"]
`;
  fs.writeFileSync(path.join(outDir, '__init__.py'), initPy);

  // Generate setup.py
  const setupPy = `from setuptools import setup, find_packages

setup(
    name="solana-rpc-client",
    version="${spec.info.version}",
    description="${spec.info.description}",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[],
    extras_require={
        "httpx": ["httpx>=0.24.0"],
    },
)
`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'python', 'setup.py'), setupPy);

  // Generate pyproject.toml
  const pyproject = `[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "solana-rpc-client"
version = "${spec.info.version}"
description = "${spec.info.description}"
requires-python = ">=3.8"
dependencies = []

[project.optional-dependencies]
httpx = ["httpx>=0.24.0"]
`;
  fs.writeFileSync(path.join(__dirname, '..', 'generated', 'python', 'pyproject.toml'), pyproject);

  console.log('\n✅ Generated Python client in:', outDir);
}

main().catch(console.error);
