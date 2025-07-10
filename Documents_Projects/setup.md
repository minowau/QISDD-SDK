# QISDD-SDK Development Environment Setup Guide

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 10+ with WSL2
- **RAM**: Minimum 16GB (32GB recommended)
- **Storage**: 50GB free space
- **CPU**: 4+ cores (8+ recommended)

### Required Software
- Node.js 18.x or higher
- Docker Desktop 4.x
- Git 2.35+
- Python 3.9+ (for tooling)
- Rust 1.70+ (for WASM compilation)

## Step 1: Core Development Tools

### 1.1 Install Node.js and Package Managers
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install global packages
npm install -g yarn pnpm lerna typescript ts-node

# Verify installations
node --version  # Should be 18.x
npm --version   # Should be 9.x
yarn --version  # Should be 1.22.x
```

### 1.2 Install Docker
```bash
# Ubuntu
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker

# macOS - Download Docker Desktop from docker.com

# Verify Docker
docker --version
docker-compose --version
```

### 1.3 Install Rust and WebAssembly Tools
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install additional tools
cargo install wasm-bindgen-cli
cargo install wasm-opt
```

### 1.4 Install Blockchain Development Tools
```bash
# Install Hardhat and related tools
npm install -g hardhat
npm install -g @openzeppelin/contracts

# Install Polygon/Mumbai testnet tools
npm install -g @maticnetwork/maticjs
```

## Step 2: Project Setup

### 2.1 Clone Repository
```bash
# Clone the repository
git clone https://github.com/your-org/qisdd-sdk.git
cd qisdd-sdk

# Install dependencies
npm install
lerna bootstrap
```

### 2.2 Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env
```

**.env Configuration**:
```env
# Node Environment
NODE_ENV=development

# API Configuration
API_PORT=3000
API_HOST=localhost

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=qisdd_dev
POSTGRES_USER=qisdd_user
POSTGRES_PASSWORD=secure_password_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# IPFS Configuration
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_GATEWAY=http://localhost:8080

# Blockchain Configuration
BLOCKCHAIN_NETWORK=polygon-mumbai
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
BLOCKCHAIN_CONTRACT_ADDRESS=

# Cryptographic Keys
SEAL_PUBLIC_KEY_PATH=./keys/seal_public.key
SEAL_PRIVATE_KEY_PATH=./keys/seal_private.key
ZKP_PROVING_KEY_PATH=./keys/proving_key.json
ZKP_VERIFICATION_KEY_PATH=./keys/verification_key.json

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=1h

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# Feature Flags
ENABLE_QUANTUM_COLLAPSE=true
ENABLE_HONEYPOT=true
ENABLE_ML_ANOMALY_DETECTION=false
```

### 2.3 Database Setup
```bash
# Start PostgreSQL container
docker run -d \
  --name qisdd-postgres \
  -e POSTGRES_DB=qisdd_dev \
  -e POSTGRES_USER=qisdd_user \
  -e POSTGRES_PASSWORD=secure_password_here \
  -p 5432:5432 \
  -v qisdd-postgres-data:/var/lib/postgresql/data \
  postgres:14-alpine

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### 2.4 Redis Setup
```bash
# Start Redis container
docker run -d \
  --name qisdd-redis \
  -p 6379:6379 \
  -v qisdd-redis-data:/data \
  redis:7-alpine \
  redis-server --requirepass redis_password_here
```

### 2.5 IPFS Setup
```bash
# Start IPFS container
docker run -d \
  --name qisdd-ipfs \
  -p 4001:4001 \
  -p 5001:5001 \
  -p 8080:8080 \
  -v qisdd-ipfs-data:/data/ipfs \
  ipfs/go-ipfs:latest

# Initialize IPFS
docker exec qisdd-ipfs ipfs init

# Configure IPFS for development
docker exec qisdd-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec qisdd-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
```

## Step 3: Cryptographic Setup

### 3.1 Generate SEAL Keys
```bash
# Create keys directory
mkdir -p keys

# Run key generation script
npm run crypto:generate-keys

# This will create:
# - keys/seal_public.key
# - keys/seal_private.key
# - keys/seal_params.json
```

### 3.2 Setup Zero-Knowledge Proof Circuits
```bash
# Install circom
npm install -g circom snarkjs

# Compile circuits
cd packages/core/src/crypto/zkp/circuits
circom balance_check.circom --r1cs --wasm --sym

# Generate proving/verification keys
snarkjs groth16 setup balance_check.r1cs pot12_final.ptau balance_check_0000.zkey

# Contribute to ceremony (development only)
snarkjs zkey contribute balance_check_0000.zkey balance_check_0001.zkey \
  --name="1st Contributor" -v

# Export verification key
snarkjs zkey export verificationkey balance_check_0001.zkey verification_key.json

# Copy keys to project
cp balance_check_0001.zkey ../../../../../keys/proving_key.zkey
cp verification_key.json ../../../../../keys/verification_key.json
```

## Step 4: Blockchain Setup

### 4.1 Configure MetaMask for Mumbai Testnet
```
Network Name: Mumbai Testnet
RPC URL: https://rpc-mumbai.maticvigil.com
Chain ID: 80001
Currency Symbol: MATIC
Block Explorer: https://mumbai.polygonscan.com
```

### 4.2 Get Test MATIC
```bash
# Visit Mumbai Faucet
# https://faucet.polygon.technology/

# Or use CLI
curl -X POST https://api.faucet.matic.network/sendTokens \
  -H "Content-Type: application/json" \
  -d '{"network": "mumbai", "address": "YOUR_WALLET_ADDRESS"}'
```

### 4.3 Deploy Smart Contracts
```bash
# Compile contracts
cd packages/blockchain
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS

# Save deployed addresses to .env
echo "ACCESS_CONTROL_CONTRACT=0x..." >> ../../.env
echo "AUDIT_TRAIL_CONTRACT=0x..." >> ../../.env
```

## Step 5: Development Workflow

### 5.1 Start Development Services
```bash
# Start all services with docker-compose
docker-compose up -d

# Or start individually
npm run dev:db      # PostgreSQL
npm run dev:redis   # Redis
npm run dev:ipfs    # IPFS
```

### 5.2 Run Development Server
```bash
# Start the API server with hot reload
npm run dev

# In another terminal, start the dashboard
cd apps/dashboard
npm run dev

# Start the WebSocket server
cd packages/core
npm run ws:dev
```

### 5.3 Run Tests
```bash
# Run all tests
npm test

# Run specific package tests
lerna run test --scope=@qisdd/core

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### 5.4 Build for Production
```bash
# Build all packages
npm run build

# Build WASM modules
cd packages/wasm
npm run build:wasm

# Build Docker images
docker build -t qisdd/api:latest .
docker build -t qisdd/dashboard:latest ./apps/dashboard
```

## Step 6: IDE Setup

### 6.1 VS Code Configuration
**.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "solidity.compileUsingRemoteVersion": "v0.8.19",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.turbo": true
  }
}
```

### 6.2 Recommended Extensions
```bash
# Install VS Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension juanblanco.solidity
code --install-extension rust-lang.rust-analyzer
code --install-extension matklad.rust-analyzer
code --install-extension ms-vscode.vscode-typescript-next
```

## Step 7: Debugging Setup

### 7.1 Node.js Debugging
**.vscode/launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "program": "${workspaceFolder}/packages/api/dist/server.js",
      "preLaunchTask": "npm: build",
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "outFiles": ["${workspaceFolder}/**/dist/**/*.js"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "--watchAll=false"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 7.2 Chrome DevTools for Dashboard
```bash
# Start dashboard with debugging
cd apps/dashboard
npm run dev -- --inspect

# Open chrome://inspect in Chrome
# Click "inspect" under the Node process
```

## Step 8: Performance Monitoring

### 8.1 Setup Grafana and Prometheus
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 8.2 Application Performance Monitoring
```bash
# Install APM tools
npm install --save @opentelemetry/node
npm install --save @opentelemetry/instrumentation-express
npm install --save @opentelemetry/instrumentation-http

# Configure in your application
# See packages/core/src/telemetry/setup.ts
```

## Step 9: Security Setup

### 9.1 Security Scanning
```bash
# Install security tools
npm install -g snyk
npm audit

# Run security scan
snyk test
snyk monitor

# Scan Docker images
docker scan qisdd/api:latest
```

### 9.2 Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test:unit"
```

## Step 10: Troubleshooting

### Common Issues and Solutions

#### 1. SEAL Library Not Loading
```bash
# Rebuild native modules
npm rebuild @microsoft/node-seal

# If on M1 Mac
arch -x86_64 npm rebuild @microsoft/node-seal
```

#### 2. IPFS Connection Issues
```bash
# Check IPFS is running
docker logs qisdd-ipfs

# Test IPFS API
curl http://localhost:5001/api/v0/id
```

#### 3. Database Migration Errors
```bash
# Reset database
npm run db:reset

# Run migrations manually
npx knex migrate:latest --env development
```

#### 4. Smart Contract Deployment Fails
```bash
# Check account balance
npx hardhat balance --account YOUR_ADDRESS --network mumbai

# Increase gas price
# Edit hardhat.config.js and increase gasPrice
```

## Additional Resources

### Documentation
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Microsoft SEAL](https://github.com/microsoft/SEAL)
- [Circom Documentation](https://docs.circom.io/)

### Community
- Discord: https://discord.gg/qisdd
- GitHub: https://github.com/qisdd/sdk
- Stack Overflow: Tag with `qisdd`

### Development Best Practices
1. Always run tests before committing
2. Use semantic commit messages
3. Create feature branches for new work
4. Update documentation with code changes
5. Run security scans weekly

## Next Steps

1. Complete the setup verification:
   ```bash
   npm run verify:setup
   ```

2. Run the example application:
   ```bash
   npm run example:basic
   ```

3. Explore the codebase:
   - Start with `packages/core/src/index.ts`
   - Review test files for usage examples
   - Check `docs/architecture.md` for system design

4. Join the development community on Discord for support and updates!