#!/bin/bash

# QISDD Demo API Test Script

API_BASE="http://localhost:3000/api"

echo "🧪 Testing QISDD Demo API"
echo "========================="

# Test 1: Protect data
echo "1. Testing /protect endpoint..."
PROTECT_RESPONSE=$(curl -s -X POST "$API_BASE/protect" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"accountNumber": "1234567890", "balance": 50000, "user": "test@example.com"},
    "policy": {"superpositionCount": 3, "observationLimit": 10, "timeWindow": "24h"}
  }')

echo "✅ Protect Response:"
echo "$PROTECT_RESPONSE" | jq .

# Extract data ID for subsequent tests
DATA_ID=$(echo "$PROTECT_RESPONSE" | jq -r '.data.id')
echo "📝 Protected data ID: $DATA_ID"

echo ""

# Test 2: Access protected data
echo "2. Testing /data/:id endpoint..."
ACCESS_RESPONSE=$(curl -s -X GET "$API_BASE/data/$DATA_ID" \
  -H "x-api-key: test-key-12345" \
  -H "x-signature: test-signature-abcdef" \
  -H "x-purpose: account_balance" \
  -H "x-request-id: req-$(date +%s)")

echo "✅ Access Response:"
echo "$ACCESS_RESPONSE" | jq .

echo ""

# Test 3: Verify data
echo "3. Testing /verify endpoint..."
VERIFY_RESPONSE=$(curl -s -X POST "$API_BASE/verify" \
  -H "Content-Type: application/json" \
  -d "{
    \"data_id\": \"$DATA_ID\",
    \"property\": \"balance\",
    \"value\": 50000
  }")

echo "✅ Verify Response:"
echo "$VERIFY_RESPONSE" | jq .

echo ""

# Test 4: Audit trail
echo "4. Testing /audit/:id endpoint..."
AUDIT_RESPONSE=$(curl -s -X GET "$API_BASE/audit/$DATA_ID")

echo "✅ Audit Response:"
echo "$AUDIT_RESPONSE" | jq .

echo ""

# Test 5: Homomorphic computation
echo "5. Testing /compute endpoint..."
# First create another data item for computation
PROTECT_RESPONSE_2=$(curl -s -X POST "$API_BASE/protect" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"value": 1000},
    "policy": {"superpositionCount": 2}
  }')

DATA_ID_2=$(echo "$PROTECT_RESPONSE_2" | jq -r '.data.id')

COMPUTE_RESPONSE=$(curl -s -X POST "$API_BASE/compute" \
  -H "Content-Type: application/json" \
  -d "{
    \"operation\": \"add\",
    \"data_ids\": [\"$DATA_ID\", \"$DATA_ID_2\"],
    \"parameters\": {}
  }")

echo "✅ Compute Response:"
echo "$COMPUTE_RESPONSE" | jq .

echo ""

# Test 6: Update policy
echo "6. Testing /data/:id/policy endpoint..."
UPDATE_RESPONSE=$(curl -s -X PATCH "$API_BASE/data/$DATA_ID/policy" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": {"observationLimit": 5, "alertThreshold": 3},
    "reason": "Enhanced security requirements"
  }')

echo "✅ Update Policy Response:"
echo "$UPDATE_RESPONSE" | jq .

echo ""

# Test 7: Delete/Erase data
echo "7. Testing DELETE /data/:id endpoint..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_BASE/data/$DATA_ID_2" \
  -H "Content-Type: application/json" \
  -d '{
    "verification_token": "secure-token-123",
    "reason": "User requested data deletion",
    "options": {"secure_wipe": true}
  }')

echo "✅ Delete Response:"
echo "$DELETE_RESPONSE" | jq .

echo ""
echo "🎉 All API tests completed!"
echo "========================="
echo "API Server: $API_BASE"
echo "WebSocket Events: ws://localhost:3000/api/events"
echo "Dashboard: http://localhost:3001"
