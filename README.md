# VictoriaMetrics Gemini Extension (vm-mcp)

A specialized Gemini CLI extension for interacting with VictoriaMetrics instances. This extension provides expert-level MetricsQL support, health monitoring, and troubleshooting tools.

## Features

- **MCP Integration**: Seamlessly connects to the community `mcp-victoriametrics` server.
- **Custom Skills**: 
  - `metrics-expert`: Specialized in PromQL/MetricsQL and query optimization.
  - `troubleshooter`: Focused on VictoriaMetrics health, ingestion, and storage diagnostics.
- **Slash Commands**:
  - `/vm-status`: Quick health report and status summary.
  - `/vm-query <query>`: Execute a query with AI-assisted interpretation.
- **Persistent Context**: `GEMINI.md` provides foundational knowledge about VictoriaMetrics architecture and best practices.

## Installation

### For Users (from GitHub)
Run the following command to install the extension directly from the repository:
```bash
gemini extensions install https://github.com/nielsvbrecht/vm-mcp.git
```

### For Developers (Local)
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/nielsvbrecht/vm-mcp.git
    cd vm-mcp
    ```

2.  **Install dependencies and build**:
    ```bash
    npm install
    npm run build
    ```

3.  **Link the extension**:
    ```bash
    gemini extensions link .
    ```

4.  **Configure VictoriaMetrics**:
    By default, the extension looks for VictoriaMetrics at `http://localhost:8428`. You can customize this by editing `gemini-extension.json` or setting environment variables:
    - `VM_INSTANCE_ENTRYPOINT`: URL of your VictoriaMetrics instance.
    - `VM_INSTANCE_TYPE`: `single` or `cluster`.

## Usage

Once linked, start a new Gemini CLI session. You can use the following commands and tools:

### Commands
- `/vm-status`: "Check the health of my VictoriaMetrics instance."
- `/vm-query "sum(rate(node_cpu_seconds_total[5m]))"`: Run a query and get an analysis.

### Tools
- `victoriametrics__query`: Execute raw MetricsQL.
- `victoriametrics__list_metrics`: Explore available metrics.
- `vmMcpInfo__check_config`: Verify your local configuration.

### Skills
The extension's skills are automatically available. You can also explicitly activate them:
- `activate_skill(name="metrics-expert")`

## Development

### Running Tests
```bash
npm test
```

### Project Structure
- `gemini-extension.json`: Extension manifest.
- `index.js`: Local MCP server for extension metadata.
- `skills/`: Specialized agent expertise.
- `commands/`: Custom slash command definitions.
- `GEMINI.md`: Core instruction set.
