/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'vm-mcp',
  version: '1.0.0',
});

server.registerTool(
  'get_extension_info',
  {
    description: 'Returns information about the VictoriaMetrics extension.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: 'VictoriaMetrics Gemini Extension (vm-mcp). Version 1.0.0. Provides MetricsQL expertise and troubleshooting tools.',
        },
      ],
    };
  },
);

server.registerTool(
  'check_config',
  {
    description: 'Checks if the VictoriaMetrics configuration is set in environment variables.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    const url = process.env.VM_INSTANCE_ENTRYPOINT || 'http://localhost:8428';
    const type = process.env.VM_INSTANCE_TYPE || 'single';
    return {
      content: [
        {
          type: 'text',
          text: `Configuration Status:\nURL: ${url}\nType: ${type}`,
        },
      ],
    };
  },
);

server.registerTool(
  'query',
  {
    description: 'Execute a MetricsQL query against VictoriaMetrics.',
    inputSchema: z.object({
      query: z.string().describe('The MetricsQL query expression.'),
    }),
  },
  async ({ query }) => {
    const entrypoint = process.env.VM_INSTANCE_ENTRYPOINT || 'http://localhost:8428';
    try {
      const response = await fetch(`${entrypoint}/api/v1/query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error executing query: ${error.message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'list_metrics',
  {
    description: 'List available metrics in the VictoriaMetrics instance.',
    inputSchema: z.object({}),
  },
  async () => {
    const entrypoint = process.env.VM_INSTANCE_ENTRYPOINT || 'http://localhost:8428';
    try {
      const response = await fetch(`${entrypoint}/api/v1/label/__name__/values`);
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data.data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error listing metrics: ${error.message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'list_labels',
  {
    description: 'List available label names in the VictoriaMetrics instance.',
    inputSchema: z.object({}),
  },
  async () => {
    const entrypoint = process.env.VM_INSTANCE_ENTRYPOINT || 'http://localhost:8428';
    try {
      const response = await fetch(`${entrypoint}/api/v1/labels`);
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data.data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error listing labels: ${error.message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'vm_status',
  {
    description: 'Check the health and status of the VictoriaMetrics instance.',
    inputSchema: z.object({}),
  },
  async () => {
    const entrypoint = process.env.VM_INSTANCE_ENTRYPOINT || 'http://localhost:8428';
    try {
      const healthResponse = await fetch(`${entrypoint}/health`);
      const health = await healthResponse.text();
      
      const statusResponse = await fetch(`${entrypoint}/api/v1/status/tsdb`);
      const status = await statusResponse.json();

      return {
        content: [
          {
            type: 'text',
            text: `Health: ${health}\n\nTSDB Status:\n${JSON.stringify(status.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error checking status: ${error.message}` }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
