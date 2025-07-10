// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AccessControl {
    struct DataPolicy {
        uint256 observationLimit;
        uint256 timeWindow;
        uint256 alertThreshold;
        address[] allowedCallers;
        bool active;
    }
    
    struct AccessRecord {
        address requester;
        uint256 timestamp;
        bool authorized;
        bytes32 contextHash;
    }
    
    mapping(bytes32 => DataPolicy) public policies;
    mapping(bytes32 => AccessRecord[]) public accessHistory;
    mapping(bytes32 => uint256) public accessCounts;
    
    event PolicyCreated(bytes32 indexed dataId, address indexed owner);
    event AccessAttempt(bytes32 indexed dataId, address indexed requester, bool authorized);
    event PolicyViolation(bytes32 indexed dataId, string violationType);
    
    function createPolicy(
        bytes32 dataId,
        uint256 observationLimit,
        uint256 timeWindow,
        uint256 alertThreshold,
        address[] memory allowedCallers
    ) external {
        require(!policies[dataId].active, "Policy exists");
        policies[dataId] = DataPolicy({
            observationLimit: observationLimit,
            timeWindow: timeWindow,
            alertThreshold: alertThreshold,
            allowedCallers: allowedCallers,
            active: true
        });
        emit PolicyCreated(dataId, msg.sender);
    }
    
    function recordAccess(
        bytes32 dataId,
        address requester,
        bool authorized,
        bytes32 contextHash
    ) external {
        AccessRecord memory record = AccessRecord({
            requester: requester,
            timestamp: block.timestamp,
            authorized: authorized,
            contextHash: contextHash
        });
        accessHistory[dataId].push(record);
        if (!authorized) {
            accessCounts[dataId]++;
            if (accessCounts[dataId] >= policies[dataId].alertThreshold) {
                emit PolicyViolation(dataId, "THRESHOLD_EXCEEDED");
            }
        }
        emit AccessAttempt(dataId, requester, authorized);
    }
} 