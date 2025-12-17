$API_BASE = 'http://localhost:3002/api'

Write-Output 'Testing QISDD Demo API'
# PowerShell port of test-api.sh

$API_BASE = 'http://localhost:3002/api'

Write-Output 'Testing QISDD Demo API'
Write-Output '========================='

Write-Output '1. Testing /protect endpoint...'
$protectPayload = @{
    data = @{ accountNumber = '1234567890'; balance = 50000; user = 'test@example.com' }
    policy = @{ superpositionCount = 3; observationLimit = 10; timeWindow = '24h' }
}
try {
    $PROTECT_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/protect" -Method Post -ContentType 'application/json' -Body ($protectPayload | ConvertTo-Json -Depth 10)
    Write-Output 'Protect Response:'
    $PROTECT_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Protect request failed: $_"
    $PROTECT_RESPONSE = $null
}

if ($null -eq $PROTECT_RESPONSE) { Write-Output "Aborting remaining tests due to failure."; exit 1 }

$DATA_ID = $PROTECT_RESPONSE.data.id
Write-Output "Protected data ID: $DATA_ID"
Write-Output ""

Write-Output 'WebSocket Events: ws://localhost:3002/api/events'
Write-Output 'Dashboard: http://localhost:3001'
Write-Output '2. Testing /data/:id endpoint...'
$headers = @{
    'x-api-key' = 'test-key-12345'
    'x-signature' = 'test-signature-abcdef'
    'x-purpose' = 'account_balance'
    'x-request-id' = "req-$(Get-Date -UFormat %s)"
}
try {
    $ACCESS_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/data/$DATA_ID" -Method Get -Headers $headers
    Write-Output 'Access Response:'
    $ACCESS_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Access request failed: $_"
}

Write-Output ""
Write-Output '3. Testing /verify endpoint...'
$verifyBody = @{ data_id = $DATA_ID; property = 'balance'; value = 50000 }
try {
    $VERIFY_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/verify" -Method Post -ContentType 'application/json' -Body ($verifyBody | ConvertTo-Json -Depth 10)
    Write-Output 'Verify Response:'
    $VERIFY_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Verify request failed: $_"
}

Write-Output ""
Write-Output '4. Testing /audit/:id endpoint...'
try {
    $AUDIT_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/audit/$DATA_ID" -Method Get
    Write-Output 'Audit Response:'
    $AUDIT_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Audit request failed: $_"
}

Write-Output ""
Write-Output '5. Testing /compute endpoint...'
$protectPayload2 = @{
    data = @{ value = 1000 }
    policy = @{ superpositionCount = 2 }
}
try {
    $PROTECT_RESPONSE_2 = Invoke-RestMethod -Uri "$API_BASE/protect" -Method Post -ContentType 'application/json' -Body ($protectPayload2 | ConvertTo-Json -Depth 10)
    $DATA_ID_2 = $PROTECT_RESPONSE_2.data.id
} catch {
    Write-Output "❌ Second protect request failed: $_"
    $DATA_ID_2 = $null
}

if ($null -ne $DATA_ID_2) {
    $computeBody = @{ operation = 'add'; data_ids = @($DATA_ID, $DATA_ID_2); parameters = @{} }
    try {
        $COMPUTE_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/compute" -Method Post -ContentType 'application/json' -Body ($computeBody | ConvertTo-Json -Depth 10)
        Write-Output 'Compute Response:'
        $COMPUTE_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
    } catch {
        Write-Output "Compute request failed: $_"
    }
} else {
    Write-Output 'Skipping compute test; could not create second data item.'
}

Write-Output ""
Write-Output '6. Testing /data/:id/policy endpoint...'
$updateBody = @{ updates = @{ observationLimit = 5; alertThreshold = 3 }; reason = 'Enhanced security requirements' }
try {
    $UPDATE_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/data/$DATA_ID/policy" -Method Patch -ContentType 'application/json' -Body ($updateBody | ConvertTo-Json -Depth 10)
    Write-Output 'Update Policy Response:'
    $UPDATE_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Update request failed: $_"
}

Write-Output ""
Write-Output '7. Testing DELETE /data/:id endpoint...'
$deleteBody = @{ verification_token = 'secure-token-123'; reason = 'User requested data deletion'; options = @{ secure_wipe = $true } }
if ($null -ne $DATA_ID_2) {
    try {
        $DELETE_RESPONSE = Invoke-RestMethod -Uri "$API_BASE/data/$DATA_ID_2" -Method Delete -ContentType 'application/json' -Body ($deleteBody | ConvertTo-Json -Depth 10)
        Write-Output 'Delete Response:'
        $DELETE_RESPONSE | ConvertTo-Json -Depth 10 | Write-Output
    } catch {
        Write-Output "Delete request failed: $_"
    }
} else {
    Write-Output 'Skipping delete test; no second data id available.'
}

Write-Output ""
Write-Output 'All API tests completed.'
Write-Output '========================='
Write-Output "API Server: $API_BASE"
Write-Output 'WebSocket Events: ws://localhost:3000/api/events'
Write-Output 'Dashboard: http://localhost:3001'
