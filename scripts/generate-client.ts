#!/usr/bin/env ts-node
/**
 * Custom TypeScript client generator for Solana RPC
 * Reads the OpenRPC spec and generates a type-safe client
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenRpcSpec {
  openrpc: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    name: string;
    url: string;
  }>;
  methods: Method[];
  components: {
    schemas: Record<string, Schema>;
  };
}

interface Method {
  name: string;
  summary: string;
  params: Param[];
  result: {
    name: string;
    schema: Schema;
  };
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
  description?: string;
  additionalProperties?: Schema;
}

function resolveRef(ref: string, spec: OpenRpcSpec): Schema {
  const parts = ref.replace('#/', '').split('/');
  let current: any = spec;
  for (const part of parts) {
    current = current[part];
  }
  return current;
}

function schemaToType(schema: Schema, spec: OpenRpcSpec, indent = 0, withPrefix = false): string {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()!;
    return withPrefix ? `types.${refName}` : refName;
  }

  if (schema.enum) {
    return schema.enum.map(v => `'${v}'`).join(' | ');
  }

  switch (schema.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `Array<${schemaToType(schema.items, spec, indent, withPrefix)}>`;
      }
      return 'any[]';
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, val]) => {
            const optional = '';  // For now, all object properties are optional
            // Quote keys that have special characters
            const quotedKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `'${key}'`;
            return `  ${quotedKey}${optional}: ${schemaToType(val, spec, indent + 1, withPrefix)}`;
          })
          .join(';\n' + '  '.repeat(indent));
        return `{\n${'  '.repeat(indent + 1)}${props}\n${'  '.repeat(indent)}}`;
      }
      if (schema.additionalProperties) {
        return `Record<string, ${schemaToType(schema.additionalProperties, spec, indent, withPrefix)}>`;
      }
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

function generateTypes(spec: OpenRpcSpec): string {
  const lines: string[] = [];
  lines.push('// Auto-generated Solana RPC Types');
  lines.push('// Generated from OpenRPC specification');
  lines.push('');

  // Generate type aliases for schemas
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    const typeStr = schemaToType(schema, spec);
    if (schema.type === 'object' && schema.properties) {
      lines.push(`export interface ${name} ${typeStr}`);
    } else {
      lines.push(`export type ${name} = ${typeStr};`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function generateClient(spec: OpenRpcSpec): string {
  const lines: string[] = [];

  lines.push(`// Auto-generated Solana RPC Client`);
  lines.push(`// ${spec.info.title} v${spec.info.version}`);
  lines.push(`// ${spec.info.description}`);
  lines.push('');
  lines.push(`import * as types from './types.js';`);
  lines.push('');

  // RPC Error class
  lines.push(`export class SolanaRpcError extends Error {`);
  lines.push(`  code: number;`);
  lines.push(`  data?: any;`);
  lines.push(``);
  lines.push(`  constructor(code: number, message: string, data?: any) {`);
  lines.push(`    super(message);`);
  lines.push(`    this.name = 'SolanaRpcError';`);
  lines.push(`    this.code = code;`);
  lines.push(`    this.data = data;`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push('');

  // Client configuration interface
  lines.push(`export interface SolanaRpcClientConfig {`);
  lines.push(`  endpoint: string;`);
  lines.push(`  headers?: Record<string, string>;`);
  lines.push(`  fetch?: typeof fetch;`);
  lines.push(`}`);
  lines.push('');

  // Default endpoints
  lines.push(`export const ENDPOINTS = {`);
  for (const server of spec.servers) {
    const key = server.name.replace(/[^a-zA-Z]/g, '_').toUpperCase();
    lines.push(`  ${key}: '${server.url}',`);
  }
  lines.push(`} as const;`);
  lines.push('');

  // Client class
  lines.push(`export class SolanaRpcClient {`);
  lines.push(`  private endpoint: string;`);
  lines.push(`  private headers: Record<string, string>;`);
  lines.push(`  private fetchFn: typeof fetch;`);
  lines.push(`  private requestId = 0;`);
  lines.push('');
  lines.push(`  constructor(config: SolanaRpcClientConfig) {`);
  lines.push(`    this.endpoint = config.endpoint;`);
  lines.push(`    this.headers = {`);
  lines.push(`      'Content-Type': 'application/json',`);
  lines.push(`      ...config.headers,`);
  lines.push(`    };`);
  lines.push(`    this.fetchFn = config.fetch ?? globalThis.fetch;`);
  lines.push(`  }`);
  lines.push('');

  // Generic call method
  lines.push(`  private async call<T>(method: string, params: any[]): Promise<T> {`);
  lines.push(`    const id = ++this.requestId;`);
  lines.push(`    const body = JSON.stringify({`);
  lines.push(`      jsonrpc: '2.0',`);
  lines.push(`      id,`);
  lines.push(`      method,`);
  lines.push(`      params,`);
  lines.push(`    });`);
  lines.push('');
  lines.push(`    const response = await this.fetchFn(this.endpoint, {`);
  lines.push(`      method: 'POST',`);
  lines.push(`      headers: this.headers,`);
  lines.push(`      body,`);
  lines.push(`    });`);
  lines.push('');
  lines.push(`    if (!response.ok) {`);
  lines.push(`      throw new Error(\`HTTP error: \${response.status}\`);`);
  lines.push(`    }`);
  lines.push('');
  lines.push(`    const json = await response.json();`);
  lines.push('');
  lines.push(`    if (json.error) {`);
  lines.push(`      throw new SolanaRpcError(json.error.code, json.error.message, json.error.data);`);
  lines.push(`    }`);
  lines.push('');
  lines.push(`    return json.result as T;`);
  lines.push(`  }`);
  lines.push('');

  // Generate methods
  for (const method of spec.methods) {
    const params = method.params;
    const methodName = method.name;

    // Generate parameter list
    const paramList = params.map(p => {
      const optional = p.required ? '' : '?';
      const typeName = schemaToType(p.schema, spec, 0, true);
      return `${p.name}${optional}: ${typeName}`;
    }).join(', ');

    // Generate return type
    const returnType: string = schemaToType(method.result.schema, spec, 0, true);

    // Generate JSDoc
    lines.push(`  /**`);
    lines.push(`   * ${method.summary}`);
    for (const p of params) {
      lines.push(`   * @param ${p.name} ${p.description || ''}`);
    }
    lines.push(`   */`);

    // Generate method
    lines.push(`  async ${methodName}(${paramList}): Promise<${returnType}> {`);
    const callParams = params.map(p => p.name);
    // Filter out undefined optional params
    lines.push(`    const params: any[] = [];`);
    for (const p of params) {
      if (p.required) {
        lines.push(`    params.push(${p.name});`);
      } else {
        lines.push(`    if (${p.name} !== undefined) params.push(${p.name});`);
      }
    }
    lines.push(`    return this.call<${returnType}>('${methodName}', params);`);
    lines.push(`  }`);
    lines.push('');
  }

  lines.push(`}`);
  lines.push('');

  // Export factory function
  lines.push(`export function createSolanaRpcClient(endpoint: string = ENDPOINTS.MAINNET_BETA): SolanaRpcClient {`);
  lines.push(`  return new SolanaRpcClient({ endpoint });`);
  lines.push(`}`);
  lines.push('');

  return lines.join('\n');
}

function generateIndex(): string {
  return `// Solana RPC Client
// Auto-generated from OpenRPC specification

export * from './types.js';
export * from './client.js';
export { SolanaRpcClient, createSolanaRpcClient, ENDPOINTS, SolanaRpcError } from './client.js';
export type { SolanaRpcClientConfig } from './client.js';
`;
}

async function main() {
  const specPath = path.join(__dirname, '..', 'spec', 'solana-rpc.openrpc.json');
  const outDir = path.join(__dirname, '..', 'generated', 'typescript');

  console.log('Reading OpenRPC spec...');
  const specContent = fs.readFileSync(specPath, 'utf-8');
  const spec: OpenRpcSpec = JSON.parse(specContent);

  console.log(`Found ${spec.methods.length} methods`);
  console.log(`Found ${Object.keys(spec.components.schemas).length} type definitions`);

  // Create output directory
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Generate types
  console.log('Generating types...');
  const types = generateTypes(spec);
  fs.writeFileSync(path.join(outDir, 'types.ts'), types);

  // Generate client
  console.log('Generating client...');
  const client = generateClient(spec);
  fs.writeFileSync(path.join(outDir, 'client.ts'), client);

  // Generate index
  console.log('Generating index...');
  const index = generateIndex();
  fs.writeFileSync(path.join(outDir, 'index.ts'), index);

  // Generate package.json for the output
  const packageJson = {
    name: '@solana-rpc/client',
    version: spec.info.version,
    description: spec.info.description,
    type: 'module',
    main: 'index.js',
    types: 'index.d.ts',
    exports: {
      '.': {
        import: './index.js',
        types: './index.d.ts'
      }
    },
    license: 'MIT',
    scripts: {
      build: 'tsc',
      prepublishOnly: 'npm run build'
    },
    devDependencies: {
      typescript: '^5.0.0'
    }
  };
  fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Generate tsconfig
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: '.',
      rootDir: '.',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      lib: ['ES2022', 'DOM']
    },
    include: ['*.ts'],
    exclude: ['node_modules']
  };
  fs.writeFileSync(path.join(outDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  console.log('\n✅ Generated TypeScript client in:', outDir);
  console.log('   - types.ts');
  console.log('   - client.ts');
  console.log('   - index.ts');
  console.log('   - package.json');
  console.log('   - tsconfig.json');
}

main().catch(console.error);
