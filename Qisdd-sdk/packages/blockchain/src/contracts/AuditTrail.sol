// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuditTrail {
    struct AuditEntry {
        uint256 timestamp;
        string eventType;
        bytes32 dataHash;
        address actor;
        bytes metadata;
    }
    
    mapping(bytes32 => AuditEntry[]) public auditLogs;
    mapping(address => bool) public authorizedLoggers;
    
    event LogEntry(
        bytes32 indexed dataId,
        string eventType,
        address indexed actor,
        uint256 timestamp
    );
    
    modifier onlyAuthorized() {
        require(authorizedLoggers[msg.sender], "Unauthorized");
        _;
    }
    
    function addLogEntry(
        bytes32 dataId,
        string memory eventType,
        bytes32 dataHash,
        bytes memory metadata
    ) external onlyAuthorized {
        AuditEntry memory entry = AuditEntry({
            timestamp: block.timestamp,
            eventType: eventType,
            dataHash: dataHash,
            actor: tx.origin,
            metadata: metadata
        });
        auditLogs[dataId].push(entry);
        emit LogEntry(dataId, eventType, tx.origin, block.timestamp);
    }
    
    function getAuditLog(
        bytes32 dataId,
        uint256 fromTime,
        uint256 toTime
    ) external view returns (AuditEntry[] memory) {
        AuditEntry[] memory fullLog = auditLogs[dataId];
        uint256 count = 0;
        for (uint i = 0; i < fullLog.length; i++) {
            if (fullLog[i].timestamp >= fromTime && fullLog[i].timestamp <= toTime) {
                count++;
            }
        }
        AuditEntry[] memory filtered = new AuditEntry[](count);
        uint256 index = 0;
        for (uint i = 0; i < fullLog.length; i++) {
            if (fullLog[i].timestamp >= fromTime && fullLog[i].timestamp <= toTime) {
                filtered[index] = fullLog[i];
                index++;
            }
        }
        return filtered;
    }
} 