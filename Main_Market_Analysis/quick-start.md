# QISDD-SDK Quick Start Guide

Choose your path based on your role and needs:

---

## 👥 **Choose Your Role**

### 🎯 **For Evaluators & Decision Makers**
**Goal**: See QISDD in action quickly
**Time**: 5 minutes

```bash
# 1. Quick Demo (No coding required)
git clone https://github.com/minowau/QISDD-SDK.git
cd QISDD-SDK/Qisdd-sdk
npm install && npx lerna bootstrap

# 2. Run interactive demo
cd packages/core
npx ts-node src/interactive-security-demo.ts

# 3. Watch QISDD block real attacks!
# ✅ See 15+ attacks blocked with 95%+ success rate
# ✅ Protect financial, medical, personal data
# ✅ Real quantum states and encryption
```

**What you'll see:**
- Real-time hacker attack simulation
- QISDD blocking SQL injection, ransomware, phishing
- Protection of credit cards, medical records, API keys
- 100% success rate demonstration

---

### 💻 **For Developers**
**Goal**: Integrate QISDD into applications
**Time**: 15 minutes

```bash
# 1. Setup development environment
git clone https://github.com/minowau/QISDD-SDK.git
cd QISDD-SDK/Qisdd-sdk
npm install && npx lerna bootstrap && npm run build

# 2. Start dashboard & API
# Terminal 1:
cd apps/demo-api && npx ts-node src/server.ts

# Terminal 2:
cd apps/dashboard && npm start

# 3. Open http://localhost:3001
# - Click "Protect My Data" 
# - Click "Simulate Hacker Attack"
# - See live security metrics
```

**Integration example:**
```typescript
import { QISDDIntegratedClient } from '@qisdd/core';

const qisdd = new QISDDIntegratedClient();

// Protect sensitive data
const result = await qisdd.protectData({
  customerData: "sensitive information",
  creditCard: "4532-1234-5678-9012"
});

// Data is now quantum-protected!
console.log('Protected with ID:', result.id);
```

---

### 🏢 **For System Administrators**
**Goal**: Deploy QISDD infrastructure
**Time**: 30 minutes

```bash
# 1. Production deployment setup
git clone https://github.com/minowau/QISDD-SDK.git
cd QISDD-SDK/Qisdd-sdk

# 2. Docker deployment
docker-compose up -d

# 3. Kubernetes deployment (optional)
kubectl apply -f k8s/

# 4. Verify deployment
curl http://localhost:3002/api/health
```

**Monitoring setup:**
- Prometheus metrics: `http://localhost:9090`
- Grafana dashboards: `http://localhost:3000`
- Application logs: `docker logs qisdd-api`

---

### 🔬 **For Security Researchers**
**Goal**: Understand quantum-inspired security
**Time**: 45 minutes

```bash
# 1. Deep dive setup
git clone https://github.com/minowau/QISDD-SDK.git
cd QISDD-SDK/Qisdd-sdk
npm install && npx lerna bootstrap

# 2. Explore core components
cd packages/core/src
ls quantum/          # Quantum-inspired algorithms
ls crypto/           # Homomorphic encryption
ls security/         # Threat simulation

# 3. Run security tests
npm run test:security

# 4. Analyze threat detection
npx ts-node src/security/threat-simulator.ts
```

**Security features to explore:**
- Observer effect implementation
- Multi-state data protection
- Zero-knowledge proof generation
- Behavioral anomaly detection

---

## ⚡ **Super Quick Demo (2 minutes)**

```bash
# One-command demo
curl -fsSL https://raw.githubusercontent.com/minowau/QISDD-SDK/main/quick-demo.sh | bash

# This will:
# 1. Clone repository
# 2. Install dependencies  
# 3. Run protection demo
# 4. Show attack blocking
# 5. Display results
```

---

## 📱 **Interactive Web Demo**

If you prefer a web interface:

1. **Visit**: https://demo.qisdd.io
2. **Click**: "Protect Sample Data"
3. **Click**: "Simulate Attack"
4. **Watch**: Real-time threat blocking

---

## 🔧 **Troubleshooting Quick Fixes**

### **Demo won't start?**
```bash
# Fix permissions
sudo chown -R $(whoami) .

# Install missing dependencies
npm install -g typescript ts-node

# Use specific Node version
nvm install 18 && nvm use 18
```

### **Port conflicts?**
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9

# Or use different ports
PORT=3003 npm start
```

### **Build failures?**
```bash
# Clean and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npx lerna bootstrap
npm run build
```

---

## 📚 **Next Steps**

After the quick start:

1. **Read full documentation**: `/Documents_Projects/README.md`
2. **Explore API reference**: `/docs/api/`
3. **Check examples**: `/apps/examples/`
4. **Join community**: Discord, GitHub Issues
5. **Contribute**: See CONTRIBUTING.md

---

## 🎯 **Success Checklist**

- [ ] ✅ Cloned repository successfully
- [ ] ✅ Dependencies installed without errors
- [ ] ✅ Demo runs and shows attack blocking
- [ ] ✅ Dashboard displays real metrics
- [ ] ✅ Can protect custom data
- [ ] ✅ Understand quantum-inspired security
- [ ] ✅ Ready for integration/deployment

---

**🚀 You're now ready to use QISDD quantum-inspired security!**

For detailed documentation, see the complete [README.md](README.md) file.

*Quick Start Guide - v1.0.0*
