# QISDD-SDK API Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Core Endpoints](#core-endpoints)
4. [WebSocket Events](#websocket-events)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [SDKs & Libraries](#sdks--libraries)
8. [Examples](#examples)

## Getting Started

### Base URLs
- **Production**: `https://api.qisdd.io/v1`
- **Staging**: `https://staging-api.qisdd.io/v1`
- **Sandbox**: `https://sandbox-api.qisdd.io/v1`

### Quick Start
```bash
# 1. Install SDK
npm install @qisdd/sdk

# 2. Get your API key from dashboard
export QISDD_API_KEY="your-api-key"

# 3. Create your first protected data
curl -X POST https://api.qisdd.io/v1/protect \
  -H "X-API-Key: $QISDD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"account": "123456", "balance": 50000},
    "policy": {
      "observation_limit": 5,
      "time_window": {"value": 24, "unit": "hours"}
    }
  }'
```

## Authentication

### API Key Authentication
All API requests must include your API key in the `X-API-Key` header:

```http
X-API-Key: qisdd_live_1234567890abcdef
```

### JWT Authentication (Optional)
For enhanced security, you can use JWT tokens:

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Signature Authentication
For sensitive operations, request signatures are required:

```javascript
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(`${method}\n${path}\n${timestamp}\n${body}`)
  .digest('hex');

headers['X-Signature'] = signature;
headers['X-Timestamp'] = timestamp;
```

## Core Endpoints

### 1. Create Protected Data

**Endpoint**: `POST /protect`

Creates quantum-protected data with specified access policies.

#### Request
```json
{
  "data": {
    "type": "object",
    "description": "The data to protect",
    "example": {
      "account_number": "1234567890",
      "balance": 50000,
      "currency": "USD"
    }
  },
  "policy": {
    "type": "object",
    "required": ["observation_limit", "time_window"],
    "properties": {
      "observation_limit": {
        "type": "integer",
        "description": "Maximum allowed observations",
        "minimum": 1,
        "default": 10
      },
      "time_window": {
        "type": "object",
        "properties": {
          "value": {"type": "integer"},
          "unit": {"enum": ["minutes", "hours", "days"]}
        }
      },
      "allowed_contexts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": {"enum": ["ip", "environment", "api_key"]},
            "value": {"type": "string"}
          }
        }
      },
      "degradation_strategy": {
        "enum": ["progressive", "immediate", "adaptive"],
        "default": "progressive"
      },
      "alert_threshold": {
        "type": "integer",
        "default": 3
      },
      "superposition_count": {
        "type": "integer",
        "default": 5,
        "minimum": 3,
        "maximum": 10
      },
      "compliance": {
        "type": "object",
        "properties": {
          "regulations": {
            "type": "array",
            "items": {"enum": ["GDPR", "CCPA", "PCI_DSS"]}
          },
          "data_retention_days": {"type": "integer"},
          "audit_required": {"type": "boolean"}
        }
      }
    }
  },
  "metadata": {
    "type": "object",
    "description": "Additional metadata",
    "properties": {
      "tags": {"type": "array", "items": {"type": "string"}},
      "expires_at": {"type": "string", "format": "date-time"},
      "reference_id": {"type": "string"}
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "pd_1234567890abcdef",
    "type": "quantum-protected",
    "created_at": "2024-01-15T10:30:00Z",
    "state_count": 5,
    "policy_summary": {
      "observation_limit": 10,
      "time_window": "24 hours",
      "compliance": ["GDPR", "PCI_DSS"]
    },
    "blockchain_ref": {
      "network": "polygon",
      "transaction": "0x1234...5678",
      "contract": "0xabcd...ef01"
    }
  }
}
```

#### Example
```javascript
const { QISDD } = require('@qisdd/sdk');
const client = new QISDD({ apiKey: process.env.QISDD_API_KEY });

async function protectFinancialData() {
  const response = await client.protect({
    data: {
      account_number: '1234567890',
      balance: 50000,
      transactions: [
        { date: '2024-01-10', amount: -150, merchant: 'Store A' },
        { date: '2024-01-11', amount: -75, merchant: 'Store B' }
      ]
    },
    policy: {
      observation_limit: 5,
      time_window: { value: 24, unit: 'hours' },
      allowed_contexts: [
        { type: 'environment', value: 'production' },
        { type: 'ip', value: '10.0.0.0/8' }
      ],
      degradation_strategy: 'progressive',
      compliance: {
        regulations: ['GDPR', 'PCI_DSS'],
        data_retention_days: 90,
        audit_required: true
      }
    }
  });
  
  console.log('Protected data ID:', response.data.id);
  return response.data.id;
}
```

### 2. Access Protected Data

**Endpoint**: `GET /data/{id}`

Attempts to access protected data. Response depends on authorization status.

#### Request Headers
```http
X-API-Key: your-api-key
X-Access-Token: access-token (optional)
X-Purpose: transaction-processing (optional)
X-Request-ID: unique-request-id (recommended)
```

#### Response (Authorized)
```json
{
  "success": true,
  "data": {
    "account_number": "1234567890",
    "balance": 50000,
    "currency": "USD"
  },
  "proof": {
    "type": "groth16",
    "proof": "0xabcd...1234",
    "public_signals": ["0x5678...ef01"]
  },
  "metadata": {
    "access_time_ms": 87,
    "state_used": 2,
    "remaining_accesses": 4,
    "trust_score": 0.95
  }
}
```

#### Response (Unauthorized - Poisoned)
```json
{
  "success": false,
  "data": {
    "account_number": "9876543210",
    "balance": 12345,
    "currency": "EUR"
  },
  "warning": "Rate limit approaching",
  "metadata": {
    "response_modified": true,
    "modification_type": "light_poison"
  }
}
```

#### Response (Unauthorized - Collapsed)
```json
{
  "success": false,
  "error": "DATA_COLLAPSED",
  "message": "Data is no longer accessible due to security violations",
  "metadata": {
    "collapsed_at": "2024-01-15T11:45:00Z",
    "reason": "threshold_exceeded"
  }
}
```

### 3. Verify Properties (Zero-Knowledge)

**Endpoint**: `POST /verify`

Verify data properties without revealing actual values.

#### Request
```json
{
  "data_id": "pd_1234567890abcdef",
  "verifications": [
    {
      "property": "balance_gte",
      "value": 1000,
      "purpose": "loan_approval"
    },
    {
      "property": "age_gte",
      "value": 18,
      "purpose": "age_verification"  
    }
  ],
  "requester": {
    "id": "partner_123",
    "name": "Partner Bank"
  }
}
```

#### Response
```json
{
  "success": true,
  "verifications": [
    {
      "property": "balance_gte",
      "value": 1000,
      "result": true,
      "proof": {
        "type": "groth16",
        "proof": "0x...",
        "verification_key": "0x...",
        "public_inputs": ["0x..."]
      }
    },
    {
      "property": "age_gte",
      "value": 18,
      "result": true,
      "proof": {
        "type": "groth16",
        "proof": "0x...",
        "verification_key": "0x...",
        "public_inputs": ["0x..."]
      }
    }
  ],
  "metadata": {
    "verification_time_ms": 234,
    "blockchain_anchored": true,
    "anchor_tx": "0x..."
  }
}
```

### 4. Homomorphic Computation

**Endpoint**: `POST /compute`

Perform computations on encrypted data without decryption.

#### Request
```json
{
  "operation": "aggregate",
  "function": "sum",
  "data_ids": [
    "pd_1234567890abcdef",
    "pd_fedcba0987654321"
  ],
  "parameters": {
    "field": "balance"
  },
  "output_format": "encrypted"
}
```

#### Response
```json
{
  "success": true,
  "result": {
    "type": "encrypted",
    "data_id": "pd_result_abcdef123456",
    "operation": "sum(balance)",
    "input_count": 2
  },
  "computation": {
    "duration_ms": 156,
    "noise_budget_remaining": 45,
    "operations_performed": 1
  }
}
```

### 5. Audit Trail

**Endpoint**: `GET /audit/{data_id}`

Retrieve tamper-evident audit logs from blockchain.

#### Query Parameters
- `start_date` (ISO 8601): Start of date range
- `end_date` (ISO 8601): End of date range
- `event_types` (array): Filter by event types
- `include_unauthorized` (boolean): Include failed attempts
- `page` (integer): Page number
- `limit` (integer): Results per page (max 1000)

#### Response
```json
{
  "success": true,
  "audit_trail": {
    "data_id": "pd_1234567890abcdef",
    "total_events": 127,
    "date_range": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-15T23:59:59Z"
    },
    "events": [
      {
        "id": "evt_001",
        "timestamp": "2024-01-15T10:30:00Z",
        "type": "data_created",
        "actor": "user_123",
        "context": {
          "ip": "192.168.1.1",
          "environment": "production"
        },
        "blockchain_ref": "0x1234...5678"
      },
      {
        "id": "evt_002",
        "timestamp": "2024-01-15T10:35:00Z",
        "type": "access_authorized",
        "actor": "api_key_456",
        "context": {
          "ip": "10.0.0.5",
          "purpose": "balance_check"
        },
        "result": {
          "success": true,
          "trust_score": 0.92
        }
      },
      {
        "id": "evt_003",
        "timestamp": "2024-01-15T11:00:00Z",
        "type": "access_denied",
        "actor": "unknown",
        "context": {
          "ip": "45.67.89.10",
          "anomaly_score": 0.85
        },
        "result": {
          "success": false,
          "reason": "context_mismatch",
          "action": "data_poisoned"
        }
      }
    ],
    "statistics": {
      "total_accesses": 45,
      "authorized": 42,
      "unauthorized": 3,
      "unique_actors": 12
    }
  },
  "pagination": {
    "page": 1,
    "limit": 100,
    "total_pages": 2,
    "has_next": true
  }
}
```

### 6. Policy Management

**Endpoint**: `PATCH /data/{id}/policy`

Update access policy for protected data.

#### Request
```json
{
  "updates": {
    "observation_limit": 20,
    "allowed_contexts": {
      "add": [
        {"type": "api_key", "value": "partner_789"}
      ],
      "remove": [
        {"type": "ip", "value": "192.168.1.0/24"}
      ]
    },
    "alert_threshold": 5
  },
  "reason": "Increased partner access requirements"
}
```

### 7. Data Erasure (GDPR Compliance)

**Endpoint**: `DELETE /data/{id}`

Quantum collapse data for compliance with erasure requests.

#### Request
```json
{
  "verification_token": "token_from_email",
  "reason": "gdpr_request",
  "options": {
    "preserve_audit_log": true,
    "notify_entangled": true,
    "cascade_delete": false
  }
}
```

#### Response
```json
{
  "success": true,
  "erasure": {
    "data_id": "pd_1234567890abcdef",
    "status": "collapsed",
    "method": "quantum_noise",
    "timestamp": "2024-01-15T12:00:00Z",
    "certificate": {
      "id": "cert_erasure_123456",
      "hash": "sha256:abcdef...",
      "blockchain_ref": "0x9876...5432"
    }
  },
  "affected": {
    "primary_records": 1,
    "entangled_records": 3,
    "notifications_sent": 2
  }
}
```

## WebSocket Events

### Connection
```javascript
const ws = new WebSocket('wss://api.qisdd.io/v1/events');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    api_key: 'your-api-key'
  }));
  
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['security', 'access', 'state_changes'],
    filters: {
      data_ids: ['pd_123', 'pd_456'],
      severity: ['medium', 'high', 'critical']
    }
  }));
});
```

### Event Types

#### Security Event
```json
{
  "type": "event",
  "channel": "security",
  "data": {
    "event_type": "anomaly_detected",
    "severity": "high",
    "data_id": "pd_1234567890abcdef",
    "threat": {
      "type": "unusual_access_pattern",
      "score": 0.89,
      "details": {
        "access_velocity": "5x_normal",
        "geographic_anomaly": true,
        "time_anomaly": true
      }
    },
    "recommended_action": "review_and_restrict",
    "auto_response": {
      "enabled": true,
      "action": "increased_poisoning"
    },
    "timestamp": "2024-01-15T10:45:23.456Z"
  }
}
```

#### Access Event
```json
{
  "type": "event",
  "channel": "access",
  "data": {
    "event_type": "access_attempt",
    "data_id": "pd_1234567890abcdef",
    "requester": {
      "id": "api_key_789",
      "type": "partner_api"
    },
    "result": {
      "authorized": false,
      "reason": "rate_limit_exceeded",
      "response_type": "honeypot_served"
    },
    "context": {
      "trust_score": 0.45,
      "anomaly_indicators": ["velocity", "pattern"]
    },
    "timestamp": "2024-01-15T10:46:00.123Z"
  }
}
```

#### State Change Event
```json
{
  "type": "event",
  "channel": "state_changes",
  "data": {
    "event_type": "state_transition",
    "data_id": "pd_1234567890abcdef",
    "transition": {
      "from": "healthy",
      "to": "degraded",
      "reason": "threshold_approaching"
    },
    "metrics": {
      "unauthorized_attempts": 3,
      "degradation_level": 0.3,
      "remaining_observations": 2
    },
    "timestamp": "2024-01-15T10:47:15.789Z"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded. Please retry after 60 seconds.",
    "details": {
      "limit": 1000,
      "window": "1h",
      "retry_after": 60
    },
    "request_id": "req_abc123def456",
    "documentation": "https://docs.qisdd.io/errors/rate-limit"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key is missing or invalid |
| `INSUFFICIENT_PERMISSIONS` | 403 | API key lacks required permissions |
| `DATA_NOT_FOUND` | 404 | Protected data ID not found |
| `DATA_COLLAPSED` | 410 | Data has been quantum collapsed |
| `INVALID_REQUEST` | 400 | Request validation failed |
| `POLICY_VIOLATION` | 403 | Request violates data access policy |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error occurred |
| `CRYPTO_ERROR` | 500 | Cryptographic operation failed |
| `BLOCKCHAIN_ERROR` | 503 | Blockchain service unavailable |

### Error Handling Example
```javascript
try {
  const result = await client.observe(dataId, credentials);
  console.log('Data:', result.data);
} catch (error) {
  if (error.code === 'DATA_COLLAPSED') {
    console.error('Data has been destroyed due to security breach');
    // Trigger incident response
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log(`Retry after ${error.details.retry_after} seconds`);
    // Implement exponential backoff
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Rate Limiting

### Limits by Plan

| Plan | Requests/Hour | Burst | Concurrent | Data Volume |
|------|---------------|-------|------------|-------------|
| Free | 100 | 10/sec | 10 | 100MB |
| Starter | 1,000 | 50/sec | 100 | 10GB |
| Professional | 10,000 | 100/sec | 1,000 | 1TB |
| Enterprise | Unlimited | Custom | Custom | Unlimited |

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 456
X-RateLimit-Reset: 1642329600
X-RateLimit-Reset-After: 3600
X-RateLimit-Bucket: api_key_123
```

### Handling Rate Limits
```javascript
const backoff = require('exponential-backoff');

async function makeRequestWithRetry(fn) {
  return backoff.backOff(
    async () => {
      try {
        return await fn();
      } catch (error) {
        if (error.code === 'RATE_LIMIT_EXCEEDED') {
          const waitTime = error.details.retry_after * 1000;
          console.log(`Rate limited. Waiting ${waitTime}ms`);
          throw error; // Backoff will handle retry
        }
        throw error; // Non-retryable error
      }
    },
    {
      numOfAttempts: 5,
      startingDelay: 1000,
      timeMultiple: 2,
      maxDelay: 30000
    }
  );
}
```

## SDKs & Libraries

### Official SDKs

#### JavaScript/TypeScript
```bash
npm install @qisdd/sdk
```

```javascript
import { QISDD } from '@qisdd/sdk';

const client = new QISDD({
  apiKey: process.env.QISDD_API_KEY,
  environment: 'production', // or 'sandbox'
  timeout: 30000,
  retries: 3
});

// Async/await
const protected = await client.protect(data, policy);

// Promises
client.observe(dataId, credentials)
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Streaming
const events = client.stream(['security', 'access']);
events.on('event', (event) => {
  console.log('Event received:', event);
});
```

#### Python
```bash
pip install qisdd
```

```python
from qisdd import Client
import os

client = Client(
    api_key=os.environ['QISDD_API_KEY'],
    environment='production'
)

# Protect data
protected = client.protect(
    data={'balance': 50000},
    policy={
        'observation_limit': 10,
        'time_window': {'value': 24, 'unit': 'hours'}
    }
)

# Observe data
try:
    result = client.observe(protected.id, credentials)
    print(f"Data: {result.data}")
except DataCollapsedError:
    print("Data has been quantum collapsed!")
```

#### Go
```bash
go get github.com/qisdd/go-sdk
```

```go
package main

import (
    "github.com/qisdd/go-sdk"
    "log"
)

func main() {
    client := qisdd.NewClient(
        qisdd.WithAPIKey(os.Getenv("QISDD_API_KEY")),
        qisdd.WithEnvironment(qisdd.Production),
    )
    
    protected, err := client.Protect(ctx, &qisdd.ProtectRequest{
        Data: map[string]interface{}{
            "balance": 50000,
        },
        Policy: &qisdd.AccessPolicy{
            ObservationLimit: 10,
            TimeWindow: &qisdd.TimeWindow{
                Value: 24,
                Unit:  "hours",
            },
        },
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    log.Printf("Protected data ID: %s", protected.ID)
}
```

### Community SDKs
- **Ruby**: `gem install qisdd-ruby`
- **PHP**: `composer require qisdd/php-sdk`
- **Java**: `com.qisdd:java-sdk:1.0.0`
- **Rust**: `qisdd = "0.1.0"`

## Examples

### Example 1: Basic Financial Data Protection
```javascript
// Protect customer financial data
const protectedAccount = await client.protect({
  data: {
    account_id: 'acc_123456',
    balance: 75000,
    credit_score: 750,
    monthly_income: 8500
  },
  policy: {
    observation_limit: 10,
    time_window: { value: 1, unit: 'days' },
    degradation_strategy: 'progressive',
    allowed_contexts: [
      { type: 'environment', value: 'production' }
    ]
  }
});

// Partner verification without data exposure
const verification = await client.verify({
  data_id: protectedAccount.id,
  verifications: [
    { property: 'balance_gte', value: 50000 },
    { property: 'credit_score_gte', value: 700 }
  ]
});

console.log('Eligible for loan:', 
  verification.verifications.every(v => v.result));
```

### Example 2: Detecting and Responding to Threats
```javascript
// Set up real-time monitoring
const monitor = client.monitor(protectedDataId);

monitor.on('threat_detected', async (event) => {
  console.log(`Threat detected: ${event.threat.type}`);
  
  if (event.severity === 'critical') {
    // Immediately collapse the data
    await client.emergency.collapse(event.data_id, {
      reason: 'critical_threat',
      preserve_audit: true
    });
    
    // Notify security team
    await notifySecurityTeam(event);
  }
});

monitor.on('unauthorized_access', async (event) => {
  console.log(`Unauthorized access from ${event.context.ip}`);
  
  // Check if this is a pattern
  const pattern = await client.analyze.accessPattern(
    event.data_id,
    { timeframe: '1h' }
  );
  
  if (pattern.anomaly_score > 0.8) {
    // Increase protection level
    await client.updatePolicy(event.data_id, {
      degradation_strategy: 'immediate',
      alert_threshold: 1
    });
  }
});
```

### Example 3: Homomorphic Analytics
```javascript
// Analyze encrypted customer data without decryption
const monthlyTotals = await client.compute({
  operation: 'aggregate',
  function: 'sum',
  data_ids: customerTransactionIds,
  parameters: {
    field: 'amount',
    group_by: 'month'
  },
  output_format: 'encrypted'
});

// Compare encrypted values
const comparison = await client.compute({
  operation: 'compare',
  function: 'greater_than',
  data_ids: [currentMonthTotal.id, previousMonthTotal.id],
  output_format: 'plaintext' // Only the boolean result
});

console.log('Revenue increased:', comparison.result);
```

### Example 4: GDPR Compliance Workflow
```javascript
// Handle data erasure request
async function handleErasureRequest(customerId, verificationToken) {
  // Find all data related to customer
  const customerData = await client.search({
    owner_id: customerId,
    include_entangled: true
  });
  
  console.log(`Found ${customerData.total} records`);
  
  // Verify the request
  const verified = await client.compliance.verifyErasureRequest(
    customerId,
    verificationToken
  );
  
  if (!verified) {
    throw new Error('Invalid verification token');
  }
  
  // Execute erasure with cascade
  const results = await Promise.all(
    customerData.records.map(record =>
      client.erase(record.id, {
        reason: 'gdpr_article_17',
        preserve_audit_log: true,
        notify_entangled: true
      })
    )
  );
  
  // Generate compliance certificate
  const certificate = await client.compliance.generateCertificate({
    type: 'erasure',
    customer_id: customerId,
    records_erased: results.map(r => r.data_id),
    timestamp: new Date().toISOString()
  });
  
  return {
    success: true,
    certificate: certificate.id,
    records_erased: results.length
  };
}
```

### Example 5: Multi-Party Computation
```javascript
// Banks sharing fraud detection without sharing customer data
const fraudDetection = await client.multiparty.createSession({
  participants: [
    { id: 'bank_a', role: 'data_provider' },
    { id: 'bank_b', role: 'data_provider' },
    { id: 'regulator', role: 'observer' }
  ],
  computation: {
    type: 'fraud_pattern_detection',
    algorithm: 'anomaly_clustering',
    privacy_budget: 10.0
  }
});

// Each bank contributes encrypted data
await client.multiparty.contribute(fraudDetection.session_id, {
  participant_id: 'bank_a',
  data_ids: bankATransactionIds,
  share_type: 'shamir_share'
});

// Execute computation
const result = await client.multiparty.compute(fraudDetection.session_id);

// Each participant can only see aggregate results
console.log('Fraud patterns detected:', result.patterns.length);
console.log('Affected accounts (anonymized):', result.affected_count);
```

## Best Practices

### 1. Security Best Practices
- Always use HTTPS
- Rotate API keys regularly
- Implement request signing for sensitive operations
- Use webhook signature verification
- Monitor the security event stream

### 2. Performance Optimization
- Batch operations when possible
- Use appropriate cache headers
- Implement connection pooling
- Choose the right superposition count
- Monitor noise budgets for homomorphic operations

### 3. Error Handling
- Implement exponential backoff for retries
- Log all error responses
- Set up alerts for critical errors
- Have a fallback strategy for collapsed data
- Test error scenarios in sandbox

### 4. Compliance
- Enable audit logging for all sensitive data
- Implement data retention policies
- Support user data export requests
- Document your data protection measures
- Regular compliance audits

## Support

- **Documentation**: https://docs.qisdd.io
- **API Status**: https://status.qisdd.io
- **Support Email**: support@qisdd.io
- **Discord Community**: https://discord.gg/qisdd
- **GitHub Issues**: https://github.com/qisdd/sdk/issues