#!/usr/bin/env ts-node
/**
 * Custom Go client generator for Solana RPC
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

function toGoName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function toGoFieldName(name: string): string {
  // Handle kebab-case
  return name.split('-').map(toGoName).join('');
}

function schemaToGoType(schema: Schema, spec: OpenRpcSpec): string {
  if (schema.$ref) {
    return schema.$ref.split('/').pop()!;
  }

  if (schema.enum) {
    return 'string';
  }

  switch (schema.type) {
    case 'string':
      return 'string';
    case 'integer':
      return 'int64';
    case 'number':
      return 'float64';
    case 'boolean':
      return 'bool';
    case 'array':
      if (schema.items) {
        return `[]${schemaToGoType(schema.items, spec)}`;
      }
      return '[]interface{}';
    case 'object':
      if (schema.additionalProperties) {
        return `map[string]${schemaToGoType(schema.additionalProperties, spec)}`;
      }
      return 'map[string]interface{}';
    default:
      return 'interface{}';
  }
}

function generateTypes(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('package solana');
  lines.push('');
  lines.push('// Auto-generated Solana RPC Types');
  lines.push('');

  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (schema.type === 'object' && schema.properties) {
      lines.push(`type ${name} struct {`);
      for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
        const goFieldName = toGoFieldName(fieldName);
        const goType = schemaToGoType(fieldSchema, spec);
        const jsonTag = `\`json:"${fieldName},omitempty"\``;
        lines.push(`\t${goFieldName} ${goType} ${jsonTag}`);
      }
      lines.push('}');
      lines.push('');
    } else if (schema.enum) {
      lines.push(`type ${name} string`);
      lines.push('');
      lines.push('const (');
      for (const val of schema.enum) {
        const constName = `${name}${toGoName(val)}`;
        lines.push(`\t${constName} ${name} = "${val}"`);
      }
      lines.push(')');
      lines.push('');
    } else {
      const goType = schemaToGoType(schema, spec);
      lines.push(`type ${name} = ${goType}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];

  lines.push('package solana');
  lines.push('');
  lines.push('import (');
  lines.push('\t"bytes"');
  lines.push('\t"context"');
  lines.push('\t"encoding/json"');
  lines.push('\t"fmt"');
  lines.push('\t"net/http"');
  lines.push('\t"sync/atomic"');
  lines.push(')');
  lines.push('');

  // Endpoints
  lines.push('const (');
  lines.push('\tMainnetBeta = "https://api.mainnet-beta.solana.com"');
  lines.push('\tDevnet      = "https://api.devnet.solana.com"');
  lines.push('\tTestnet     = "https://api.testnet.solana.com"');
  lines.push(')');
  lines.push('');

  // RPC Request/Response types
  lines.push('type rpcRequest struct {');
  lines.push('\tJsonRPC string        `json:"jsonrpc"`');
  lines.push('\tID      uint64        `json:"id"`');
  lines.push('\tMethod  string        `json:"method"`');
  lines.push('\tParams  []interface{} `json:"params"`');
  lines.push('}');
  lines.push('');

  lines.push('type rpcResponse struct {');
  lines.push('\tJsonRPC string          `json:"jsonrpc"`');
  lines.push('\tID      uint64          `json:"id"`');
  lines.push('\tResult  json.RawMessage `json:"result"`');
  lines.push('\tError   *RPCError       `json:"error,omitempty"`');
  lines.push('}');
  lines.push('');

  lines.push('type RPCError struct {');
  lines.push('\tCode    int             `json:"code"`');
  lines.push('\tMessage string          `json:"message"`');
  lines.push('\tData    json.RawMessage `json:"data,omitempty"`');
  lines.push('}');
  lines.push('');

  lines.push('func (e *RPCError) Error() string {');
  lines.push('\treturn fmt.Sprintf("RPC error %d: %s", e.Code, e.Message)');
  lines.push('}');
  lines.push('');

  // Client struct
  lines.push('type Client struct {');
  lines.push('\tendpoint  string');
  lines.push('\thttpClient *http.Client');
  lines.push('\trequestID  uint64');
  lines.push('}');
  lines.push('');

  // NewClient
  lines.push('func NewClient(endpoint string) *Client {');
  lines.push('\treturn &Client{');
  lines.push('\t\tendpoint:   endpoint,');
  lines.push('\t\thttpClient: http.DefaultClient,');
  lines.push('\t}');
  lines.push('}');
  lines.push('');

  // Generic call method
  lines.push('func (c *Client) call(ctx context.Context, method string, params []interface{}, result interface{}) error {');
  lines.push('\tid := atomic.AddUint64(&c.requestID, 1)');
  lines.push('');
  lines.push('\treqBody := rpcRequest{');
  lines.push('\t\tJsonRPC: "2.0",');
  lines.push('\t\tID:      id,');
  lines.push('\t\tMethod:  method,');
  lines.push('\t\tParams:  params,');
  lines.push('\t}');
  lines.push('');
  lines.push('\tbody, err := json.Marshal(reqBody)');
  lines.push('\tif err != nil {');
  lines.push('\t\treturn fmt.Errorf("marshal request: %w", err)');
  lines.push('\t}');
  lines.push('');
  lines.push('\treq, err := http.NewRequestWithContext(ctx, "POST", c.endpoint, bytes.NewReader(body))');
  lines.push('\tif err != nil {');
  lines.push('\t\treturn fmt.Errorf("create request: %w", err)');
  lines.push('\t}');
  lines.push('\treq.Header.Set("Content-Type", "application/json")');
  lines.push('');
  lines.push('\tresp, err := c.httpClient.Do(req)');
  lines.push('\tif err != nil {');
  lines.push('\t\treturn fmt.Errorf("do request: %w", err)');
  lines.push('\t}');
  lines.push('\tdefer resp.Body.Close()');
  lines.push('');
  lines.push('\tvar rpcResp rpcResponse');
  lines.push('\tif err := json.NewDecoder(resp.Body).Decode(&rpcResp); err != nil {');
  lines.push('\t\treturn fmt.Errorf("decode response: %w", err)');
  lines.push('\t}');
  lines.push('');
  lines.push('\tif rpcResp.Error != nil {');
  lines.push('\t\treturn rpcResp.Error');
  lines.push('\t}');
  lines.push('');
  lines.push('\tif err := json.Unmarshal(rpcResp.Result, result); err != nil {');
  lines.push('\t\treturn fmt.Errorf("unmarshal result: %w", err)');
  lines.push('\t}');
  lines.push('');
  lines.push('\treturn nil');
  lines.push('}');
  lines.push('');

  // Generate methods
  for (const method of spec.methods) {
    const methodName = toGoName(method.name);
    const params = method.params;

    // Build parameter list
    const goParams = ['ctx context.Context'];
    for (const p of params) {
      const paramName = p.name;
      let goType = schemaToGoType(p.schema, spec);
      if (!p.required) {
        goType = '*' + goType; // Pointer for optional
      }
      goParams.push(`${paramName} ${goType}`);
    }

    // Return type
    let returnType = schemaToGoType(method.result.schema, spec);
    if (returnType === 'interface{}') {
      returnType = 'json.RawMessage';
    }

    // Generate doc comment
    lines.push(`// ${methodName} ${method.summary}`);

    // Generate method signature
    lines.push(`func (c *Client) ${methodName}(${goParams.join(', ')}) (${returnType}, error) {`);
    lines.push('\tparams := make([]interface{}, 0)');

    for (const p of params) {
      if (p.required) {
        lines.push(`\tparams = append(params, ${p.name})`);
      } else {
        lines.push(`\tif ${p.name} != nil {`);
        lines.push(`\t\tparams = append(params, *${p.name})`);
        lines.push('\t}');
      }
    }

    lines.push('');
    lines.push(`\tvar result ${returnType}`);
    lines.push(`\terr := c.call(ctx, "${method.name}", params, &result)`);
    lines.push('\treturn result, err');
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'go');

  console.log('Reading OpenRPC spec...');
  const specContent = fs.readFileSync(specPath, 'utf-8');
  const spec: OpenRpcSpec = JSON.parse(specContent);

  console.log(`Found ${spec.methods.length} methods`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Generate types
  console.log('Generating types.go...');
  fs.writeFileSync(path.join(outDir, 'types.go'), generateTypes(spec));

  // Generate client
  console.log('Generating client.go...');
  fs.writeFileSync(path.join(outDir, 'client.go'), generateClient(spec));

  // Generate go.mod
  const goMod = `module github.com/solana-rpc/client

go 1.21
`;
  fs.writeFileSync(path.join(outDir, 'go.mod'), goMod);

  console.log('\n✅ Generated Go client in:', outDir);
}

main().catch(console.error);
