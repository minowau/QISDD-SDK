// QISDD-SDK Storage Management & State Persistence
// packages/core/src/storage/index.ts

import { EventEmitter } from "events";
import { createHash, randomBytes } from "crypto";
import { promises as fs } from "fs";
import { join, dirname } from "path";
import { LoggerFactory } from "../logging";
import { QuantumState, QuantumStateType } from "../quantum/superposition";

const logger = LoggerFactory.createQuantumLogger();

// Storage Interfaces
export interface StorageConfig {
  storageType: "memory" | "file" | "database" | "hybrid";
  basePath?: string;
  compression: boolean;
  encryption: boolean;
  replication: boolean;
  maxMemoryStates: number;
  persistenceInterval: number;
  cacheTTL: number;
  enableMetrics: boolean;
}

export interface StateRecord {
  id: string;
  dataId: string;
  stateIndex: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  stateType: QuantumStateType;
  metadata: StateMetadata;
  ciphertext?: Buffer;
  location?: StorageLocation;
  accessHistory: AccessRecord[];
}

export interface StateMetadata {
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  checksumSHA256: string;
  encryptionKeyId?: string;
  replicationFactor: number;
  lastVerified: Date;
  integrityChecks: number;
  corruptionDetected: boolean;
}

export interface StorageLocation {
  primary: string;
  replicas?: string[];
  storageType: "memory" | "file" | "database";
  lastAccessed: Date;
  accessCount: number;
}

export interface AccessRecord {
  timestamp: Date;
  operation: "read" | "write" | "verify" | "replicate";
  success: boolean;
  duration: number;
  error?: string;
}

export interface StorageMetrics {
  totalStates: number;
  memoryStates: number;
  fileStates: number;
  databaseStates: number;
  totalStorageSize: number;
  compressionSavings: number;
  replicationOverhead: number;
  averageAccessTime: number;
  integrityFailures: number;
  cacheHitRate: number;
}

// Main State Manager
export class StateManager extends EventEmitter {
  private config: StorageConfig;
  private memoryCache: Map<string, StateRecord> = new Map();
  private stateIndex: Map<string, Set<string>> = new Map(); // dataId -> Set<stateId>
  private persistenceTimer?: NodeJS.Timeout;
  private metrics: StorageMetrics;
  private fileStorage: FileStorageAdapter;
  private databaseStorage?: DatabaseStorageAdapter;
  private compressionEngine: CompressionEngine;
  private encryptionEngine: EncryptionEngine;

  constructor(config: Partial<StorageConfig> = {}) {
    super();

    this.config = {
      storageType: "hybrid",
      basePath: "./data/quantum-states",
      compression: true,
      encryption: true,
      replication: true,
      maxMemoryStates: 1000,
      persistenceInterval: 30000, // 30 seconds
      cacheTTL: 300000, // 5 minutes
      enableMetrics: true,
      ...config,
    };

    this.initializeStorage();
    this.initializeMetrics();
    this.setupPeriodicPersistence();

    logger.info("State manager initialized", { config: this.config });
  }

  private initializeStorage(): void {
    this.fileStorage = new FileStorageAdapter(this.config.basePath!);

    if (
      this.config.storageType === "database" ||
      this.config.storageType === "hybrid"
    ) {
      this.databaseStorage = new DatabaseStorageAdapter();
    }

    this.compressionEngine = new CompressionEngine();
    this.encryptionEngine = new EncryptionEngine();
  }

  private initializeMetrics(): void {
    this.metrics = {
      totalStates: 0,
      memoryStates: 0,
      fileStates: 0,
      databaseStates: 0,
      totalStorageSize: 0,
      compressionSavings: 0,
      replicationOverhead: 0,
      averageAccessTime: 0,
      integrityFailures: 0,
      cacheHitRate: 0,
    };
  }

  private setupPeriodicPersistence(): void {
    if (this.config.persistenceInterval > 0) {
      this.persistenceTimer = setInterval(async () => {
        await this.persistPendingStates();
      }, this.config.persistenceInterval);
    }
  }

  // Main API Methods
  public async saveState(state: QuantumState): Promise<string> {
    const operationId = `save_state_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.debug("Saving quantum state", {
        stateId: state.id,
        dataSize: state.ciphertext.length,
        stateType: state.stateType,
      });

      // Create state record
      const record = await this.createStateRecord(state);

      // Store based on configuration
      await this.storeRecord(record);

      // Update index
      this.updateStateIndex(record.dataId, record.id);

      // Update metrics
      this.updateMetrics("save", record);

      const performance = logger.endPerformanceTimer(operationId);

      logger.info("Quantum state saved successfully", {
        stateId: state.id,
        storageLocation: record.location?.primary,
        performance,
      });

      this.emit("stateSaved", { stateId: state.id, record, performance });

      return record.id;
    } catch (error) {
      logger.error("Failed to save quantum state", error as Error, {
        stateId: state.id,
        operationId,
      });
      throw error;
    }
  }

  public async getState(stateId: string): Promise<QuantumState | null> {
    const operationId = `get_state_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.debug("Retrieving quantum state", { stateId });

      // Check memory cache first
      let record = this.memoryCache.get(stateId);
      let cacheHit = !!record;

      if (!record) {
        // Load from persistent storage
        record = await this.loadRecord(stateId);

        if (record && this.shouldCache(record)) {
          this.memoryCache.set(stateId, record);
        }
      }

      if (!record) {
        logger.warn("Quantum state not found", { stateId });
        return null;
      }

      // Verify integrity
      const integrityValid = await this.verifyIntegrity(record);
      if (!integrityValid) {
        logger.error("State integrity verification failed", undefined, {
          stateId,
        });
        this.metrics.integrityFailures++;

        // Attempt recovery from replica
        record = await this.recoverFromReplica(stateId);
        if (!record) {
          throw new Error(
            `State integrity compromised and recovery failed: ${stateId}`,
          );
        }
      }

      // Convert record back to QuantumState
      const quantumState = await this.recordToQuantumState(record);

      // Update access history
      this.recordAccess(record, "read", true);

      const performance = logger.endPerformanceTimer(operationId);
      this.updateMetrics("get", record, cacheHit);

      logger.debug("Quantum state retrieved successfully", {
        stateId,
        cacheHit,
        performance,
      });

      this.emit("stateAccessed", { stateId, cacheHit, performance });

      return quantumState;
    } catch (error) {
      logger.error("Failed to retrieve quantum state", error as Error, {
        stateId,
        operationId,
      });
      throw error;
    }
  }

  public async getStates(dataId: string): Promise<QuantumState[]> {
    const operationId = `get_states_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.debug("Retrieving quantum states for data", { dataId });

      const stateIds = this.stateIndex.get(dataId);
      if (!stateIds || stateIds.size === 0) {
        logger.warn("No states found for data", { dataId });
        return [];
      }

      const states: QuantumState[] = [];
      const retrievalPromises = Array.from(stateIds).map(async (stateId) => {
        try {
          const state = await this.getState(stateId);
          if (state) {
            states.push(state);
          }
        } catch (error) {
          logger.warn("Failed to retrieve individual state", {
            stateId,
            error: (error as Error).message,
          });
        }
      });

      await Promise.all(retrievalPromises);

      // Sort by state index
      states.sort((a, b) => a.index - b.index);

      const performance = logger.endPerformanceTimer(operationId);

      logger.info("Retrieved quantum states for data", {
        dataId,
        stateCount: states.length,
        performance,
      });

      return states;
    } catch (error) {
      logger.error("Failed to retrieve quantum states", error as Error, {
        dataId,
        operationId,
      });
      throw error;
    }
  }

  public async updateState(
    stateId: string,
    updates: Partial<QuantumState>,
  ): Promise<boolean> {
    const operationId = `update_state_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.debug("Updating quantum state", {
        stateId,
        updates: Object.keys(updates),
      });

      const record = await this.loadRecord(stateId);
      if (!record) {
        throw new Error(`State not found: ${stateId}`);
      }

      // Apply updates
      const updatedState = await this.recordToQuantumState(record);
      Object.assign(updatedState, updates);
      updatedState.updatedAt = new Date();

      // Create new record with updates
      const updatedRecord = await this.createStateRecord(updatedState);
      updatedRecord.id = record.id; // Keep same ID

      // Store updated record
      await this.storeRecord(updatedRecord);

      // Update memory cache
      this.memoryCache.set(stateId, updatedRecord);

      const performance = logger.endPerformanceTimer(operationId);

      logger.info("Quantum state updated successfully", {
        stateId,
        performance,
      });

      this.emit("stateUpdated", { stateId, updates, performance });

      return true;
    } catch (error) {
      logger.error("Failed to update quantum state", error as Error, {
        stateId,
        operationId,
      });
      return false;
    }
  }

  public async deleteState(stateId: string): Promise<boolean> {
    const operationId = `delete_state_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.debug("Deleting quantum state", { stateId });

      const record =
        this.memoryCache.get(stateId) || (await this.loadRecord(stateId));
      if (!record) {
        logger.warn("State not found for deletion", { stateId });
        return false;
      }

      // Remove from memory cache
      this.memoryCache.delete(stateId);

      // Remove from state index
      const stateIds = this.stateIndex.get(record.dataId);
      if (stateIds) {
        stateIds.delete(stateId);
        if (stateIds.size === 0) {
          this.stateIndex.delete(record.dataId);
        }
      }

      // Delete from persistent storage
      await this.deleteRecord(stateId);

      // Delete replicas
      if (record.location?.replicas) {
        for (const replicaLocation of record.location.replicas) {
          await this.deleteReplica(stateId, replicaLocation);
        }
      }

      const performance = logger.endPerformanceTimer(operationId);

      logger.info("Quantum state deleted successfully", {
        stateId,
        performance,
      });

      this.emit("stateDeleted", { stateId, performance });

      return true;
    } catch (error) {
      logger.error("Failed to delete quantum state", error as Error, {
        stateId,
        operationId,
      });
      return false;
    }
  }

  public async verifyAllStates(): Promise<IntegrityReport> {
    const operationId = `verify_all_states_${Date.now()}`;
    logger.startPerformanceTimer(operationId);

    try {
      logger.info("Starting integrity verification for all states");

      const report: IntegrityReport = {
        totalStates: 0,
        verifiedStates: 0,
        corruptedStates: 0,
        missingStates: 0,
        repairedStates: 0,
        irreparableStates: 0,
        details: [],
      };

      // Verify memory cache states
      await Promise.all(
        Array.from(this.memoryCache.entries()).map(
          async ([stateId, record]) => {
            report.totalStates++;

            try {
              const valid = await this.verifyIntegrity(record);
              if (valid) {
                report.verifiedStates++;
              } else {
                report.corruptedStates++;

                // Attempt repair
                const repaired = await this.repairState(stateId);
                if (repaired) {
                  report.repairedStates++;
                } else {
                  report.irreparableStates++;
                }
              }
            } catch (error) {
              report.missingStates++;
              report.details.push({
                stateId,
                issue: "verification_failed",
                error: (error as Error).message,
              });
            }
          },
        ),
      );

      // Verify persistent storage (if applicable)
      if (
        this.config.storageType === "file" ||
        this.config.storageType === "hybrid"
      ) {
        const fileStates = await this.fileStorage.listStates();
        for (const stateId of fileStates) {
          if (!this.memoryCache.has(stateId)) {
            report.totalStates++;

            try {
              const record = await this.loadRecord(stateId);
              if (record) {
                const valid = await this.verifyIntegrity(record);
                if (valid) {
                  report.verifiedStates++;
                } else {
                  report.corruptedStates++;
                }
              } else {
                report.missingStates++;
              }
            } catch (error) {
              report.missingStates++;
              report.details.push({
                stateId,
                issue: "load_failed",
                error: (error as Error).message,
              });
            }
          }
        }
      }

      const performance = logger.endPerformanceTimer(operationId);

      logger.info("Integrity verification completed", {
        ...report,
        performance,
      });

      this.emit("integrityVerificationCompleted", { report, performance });

      return report;
    } catch (error) {
      logger.error("Integrity verification failed", error as Error, {
        operationId,
      });
      throw error;
    }
  }

  public getMetrics(): StorageMetrics {
    return { ...this.metrics };
  }

  public async cleanup(): Promise<void> {
    logger.info("Starting storage cleanup");

    try {
      // Clean expired cache entries
      const now = Date.now();
      for (const [stateId, record] of Array.from(this.memoryCache.entries())) {
        const age = now - record.metadata.lastVerified.getTime();
        if (age > this.config.cacheTTL) {
          this.memoryCache.delete(stateId);
        }
      }

      // Clean old access records
      for (const record of Array.from(this.memoryCache.values())) {
        record.accessHistory = record.accessHistory.filter(
          (access) => now - access.timestamp.getTime() < 24 * 60 * 60 * 1000, // Keep 24 hours
        );
      }

      logger.info("Storage cleanup completed");
    } catch (error) {
      logger.error("Storage cleanup failed", error as Error);
    }
  }

  public async destroy(): Promise<void> {
    logger.info("Destroying state manager");

    if (this.persistenceTimer) {
      clearInterval(this.persistenceTimer);
    }

    // Persist any pending states
    await this.persistPendingStates();

    // Clear memory
    this.memoryCache.clear();
    this.stateIndex.clear();

    // Close database connections
    if (this.databaseStorage) {
      await this.databaseStorage.close();
    }

    this.removeAllListeners();

    logger.info("State manager destroyed");
  }

  // Private helper methods
  private async createStateRecord(state: QuantumState): Promise<StateRecord> {
    const originalSize = state.ciphertext.length;
    let processedData = state.ciphertext;
    let compressedSize = originalSize;

    // Apply compression if enabled
    if (this.config.compression) {
      processedData = await this.compressionEngine.compress(processedData);
      compressedSize = processedData.length;
    }

    // Apply encryption if enabled
    if (this.config.encryption) {
      processedData = await this.encryptionEngine.encrypt(processedData);
    }

    const checksumSHA256 = createHash("sha256")
      .update(processedData)
      .digest("hex");

    const record: StateRecord = {
      id: state.id,
      dataId: state.id.split("_state_")[0] || state.id, // Extract dataId from stateId
      stateIndex: state.index,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
      active: state.active,
      stateType: state.stateType,
      ciphertext: processedData,
      metadata: {
        originalSize,
        compressedSize: this.config.compression ? compressedSize : undefined,
        compressionRatio: this.config.compression
          ? compressedSize / originalSize
          : undefined,
        checksumSHA256,
        encryptionKeyId: this.config.encryption ? "default" : undefined,
        replicationFactor: this.config.replication ? 2 : 1,
        lastVerified: new Date(),
        integrityChecks: 0,
        corruptionDetected: false,
      },
      accessHistory: [],
    };

    return record;
  }

  private async storeRecord(record: StateRecord): Promise<void> {
    const primaryLocation = await this.selectStorageLocation(record);

    // Store primary copy
    await this.storeInLocation(record, primaryLocation);

    record.location = {
      primary: primaryLocation,
      storageType: this.getStorageTypeForLocation(primaryLocation),
      lastAccessed: new Date(),
      accessCount: 0,
    };

    // Create replicas if enabled
    if (this.config.replication) {
      const replicaLocations = await this.createReplicas(record);
      record.location.replicas = replicaLocations;
    }

    // Add to memory cache if appropriate
    if (this.shouldCache(record)) {
      this.memoryCache.set(record.id, record);
    }
  }

  private async selectStorageLocation(record: StateRecord): Promise<string> {
    switch (this.config.storageType) {
      case "memory":
        return "memory";
      case "file":
        return this.fileStorage.generatePath(record.id);
      case "database":
        return "database";
      case "hybrid":
        // Use memory for frequently accessed states, file for others
        if (record.active || record.stateType === QuantumStateType.Healthy) {
          return "memory";
        }
        return this.fileStorage.generatePath(record.id);
      default:
        throw new Error(`Unknown storage type: ${this.config.storageType}`);
    }
  }

  private async storeInLocation(
    record: StateRecord,
    location: string,
  ): Promise<void> {
    if (location === "memory") {
      // Already handled in storeRecord
      return;
    } else if (location === "database") {
      if (this.databaseStorage) {
        await this.databaseStorage.store(record);
      }
    } else {
      // File storage
      await this.fileStorage.store(record, location);
    }
  }

  private getStorageTypeForLocation(
    location: string,
  ): "memory" | "file" | "database" {
    if (location === "memory") return "memory";
    if (location === "database") return "database";
    return "file";
  }

  private async createReplicas(record: StateRecord): Promise<string[]> {
    const replicas = [];
    const replicationCount = Math.min(record.metadata.replicationFactor - 1, 2); // Max 2 replicas

    for (let i = 0; i < replicationCount; i++) {
      const replicaLocation = await this.selectReplicaLocation(record, i);
      await this.storeInLocation(record, replicaLocation);
      replicas.push(replicaLocation);
    }

    return replicas;
  }

  private async selectReplicaLocation(
    record: StateRecord,
    replicaIndex: number,
  ): Promise<string> {
    // Simple strategy: alternate between file and database storage
    if (replicaIndex % 2 === 0) {
      return this.fileStorage.generatePath(
        `${record.id}_replica_${replicaIndex}`,
      );
    } else {
      return "database";
    }
  }

  private shouldCache(record: StateRecord): boolean {
    if (this.memoryCache.size >= this.config.maxMemoryStates) {
      return false;
    }

    // Cache active states and healthy states
    return record.active || record.stateType === QuantumStateType.Healthy;
  }

  private async loadRecord(stateId: string): Promise<StateRecord | null> {
    // Try different storage locations
    const locations = [
      "memory",
      this.fileStorage.generatePath(stateId),
      "database",
    ];

    for (const location of locations) {
      try {
        if (location === "memory") {
          const record = this.memoryCache.get(stateId);
          if (record) return record;
        } else if (location === "database" && this.databaseStorage) {
          const record = await this.databaseStorage.load(stateId);
          if (record) return record;
        } else {
          const record = await this.fileStorage.load(location);
          if (record) return record;
        }
      } catch (error) {
        logger.debug("Failed to load from location", {
          stateId,
          location,
          error: (error as Error).message,
        });
      }
    }

    return null;
  }

  private async verifyIntegrity(record: StateRecord): Promise<boolean> {
    try {
      if (!record.ciphertext) {
        return false;
      }

      const currentChecksum = createHash("sha256")
        .update(record.ciphertext)
        .digest("hex");
      const isValid = currentChecksum === record.metadata.checksumSHA256;

      record.metadata.integrityChecks++;
      record.metadata.lastVerified = new Date();

      if (!isValid) {
        record.metadata.corruptionDetected = true;
        logger.warn("Integrity verification failed", {
          stateId: record.id,
          expectedChecksum: record.metadata.checksumSHA256,
          actualChecksum: currentChecksum,
        });
      }

      return isValid;
    } catch (error) {
      logger.error("Integrity verification error", error as Error, {
        stateId: record.id,
      });
      return false;
    }
  }

  private async recoverFromReplica(
    stateId: string,
  ): Promise<StateRecord | null> {
    logger.info("Attempting to recover state from replica", { stateId });

    // Try to load from each replica location
    const possibleLocations = [
      this.fileStorage.generatePath(`${stateId}_replica_0`),
      this.fileStorage.generatePath(`${stateId}_replica_1`),
      "database",
    ];

    for (const location of possibleLocations) {
      try {
        let record: StateRecord | null = null;

        if (location === "database" && this.databaseStorage) {
          record = await this.databaseStorage.load(`${stateId}_replica`);
        } else {
          record = await this.fileStorage.load(location);
        }

        if (record && (await this.verifyIntegrity(record))) {
          logger.info("Successfully recovered state from replica", {
            stateId,
            replicaLocation: location,
          });
          return record;
        }
      } catch (error) {
        logger.debug("Failed to recover from replica location", {
          stateId,
          location,
          error: (error as Error).message,
        });
      }
    }

    logger.error("Failed to recover state from any replica", undefined, {
      stateId,
    });
    return null;
  }

  private async repairState(stateId: string): Promise<boolean> {
    const repairedRecord = await this.recoverFromReplica(stateId);
    if (repairedRecord) {
      // Restore primary location
      await this.storeRecord(repairedRecord);
      this.memoryCache.set(stateId, repairedRecord);

      logger.info("State repaired successfully", { stateId });
      return true;
    }

    return false;
  }

  private async recordToQuantumState(
    record: StateRecord,
  ): Promise<QuantumState> {
    let processedData = record.ciphertext!;

    // Decrypt if encrypted
    if (this.config.encryption && record.metadata.encryptionKeyId) {
      processedData = await this.encryptionEngine.decrypt(processedData);
    }

    // Decompress if compressed
    if (this.config.compression && record.metadata.compressedSize) {
      processedData = await this.compressionEngine.decompress(processedData);
    }

    const quantumState: QuantumState = {
      id: record.id,
      index: record.stateIndex,
      ciphertext: processedData,
      nonce: randomBytes(16), // Regenerate nonce
      mac: createHash("sha256").update(processedData).digest("hex"),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      active: record.active,
      stateType: record.stateType,
      accessCount: record.location?.accessCount || 0,
      degradationLevel: 0,
      poisonLevel: 0,
      entanglements: [],
      metadata: {
        originalDataHash: record.metadata.checksumSHA256,
        encryptionAlgorithm: "SEAL",
        keyId: record.metadata.encryptionKeyId || "default",
        sizeBytes: processedData.length,
        noiseLevel: 0,
        operationsCount: 0,
        maxOperations: 100,
        coherenceTime: 300000,
      },
    };

    return quantumState;
  }

  private updateStateIndex(dataId: string, stateId: string): void {
    if (!this.stateIndex.has(dataId)) {
      this.stateIndex.set(dataId, new Set());
    }
    this.stateIndex.get(dataId)!.add(stateId);
  }

  private recordAccess(
    record: StateRecord,
    operation: "read" | "write" | "verify" | "replicate",
    success: boolean,
    duration?: number,
  ): void {
    const accessRecord: AccessRecord = {
      timestamp: new Date(),
      operation,
      success,
      duration: duration || 0,
    };

    record.accessHistory.push(accessRecord);

    if (record.location) {
      record.location.lastAccessed = new Date();
      record.location.accessCount++;
    }

    // Keep only last 100 access records
    if (record.accessHistory.length > 100) {
      record.accessHistory = record.accessHistory.slice(-100);
    }
  }

  private updateMetrics(
    operation: string,
    record: StateRecord,
    cacheHit?: boolean,
  ): void {
    if (!this.config.enableMetrics) return;

    switch (operation) {
      case "save":
        this.metrics.totalStates++;
        if (record.location?.storageType === "memory") {
          this.metrics.memoryStates++;
        } else if (record.location?.storageType === "file") {
          this.metrics.fileStates++;
        } else if (record.location?.storageType === "database") {
          this.metrics.databaseStates++;
        }

        this.metrics.totalStorageSize += record.metadata.originalSize;

        if (
          record.metadata.compressedSize &&
          record.metadata.compressionRatio
        ) {
          this.metrics.compressionSavings +=
            record.metadata.originalSize - record.metadata.compressedSize;
        }
        break;

      case "get":
        if (cacheHit) {
          this.metrics.cacheHitRate = this.metrics.cacheHitRate * 0.9 + 1 * 0.1; // Exponential moving average
        } else {
          this.metrics.cacheHitRate = this.metrics.cacheHitRate * 0.9; // Decay without hit
        }
        break;
    }
  }

  private async persistPendingStates(): Promise<void> {
    logger.debug("Persisting pending states");

    const persistencePromises = [];
    for (const [stateId, record] of Array.from(this.memoryCache.entries())) {
      if (
        record.location?.storageType === "memory" &&
        this.config.storageType === "hybrid"
      ) {
        // Persist memory-only states to file storage
        persistencePromises.push(
          this.fileStorage
            .store(record, this.fileStorage.generatePath(stateId))
            .catch((error) =>
              logger.warn("Failed to persist state", {
                stateId,
                error: error.message,
              }),
            ),
        );
      }
    }

    await Promise.all(persistencePromises);
    logger.debug(`Persisted ${persistencePromises.length} states`);
  }

  private async deleteRecord(stateId: string): Promise<void> {
    const locations = [this.fileStorage.generatePath(stateId), "database"];

    for (const location of locations) {
      try {
        if (location === "database" && this.databaseStorage) {
          await this.databaseStorage.delete(stateId);
        } else {
          await this.fileStorage.delete(location);
        }
      } catch (error) {
        logger.debug("Failed to delete from location", {
          stateId,
          location,
          error: (error as Error).message,
        });
      }
    }
  }

  private async deleteReplica(
    stateId: string,
    replicaLocation: string,
  ): Promise<void> {
    try {
      if (replicaLocation === "database" && this.databaseStorage) {
        await this.databaseStorage.delete(`${stateId}_replica`);
      } else {
        await this.fileStorage.delete(replicaLocation);
      }
    } catch (error) {
      logger.warn("Failed to delete replica", {
        stateId,
        replicaLocation,
        error: (error as Error).message,
      });
    }
  }
}

// Storage Adapters
class FileStorageAdapter {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public generatePath(stateId: string): string {
    const subdir = stateId.substring(0, 2); // Use first 2 chars for subdirectory
    return join(this.basePath, subdir, `${stateId}.qstate`);
  }

  public async store(record: StateRecord, filePath: string): Promise<void> {
    await fs.mkdir(dirname(filePath), { recursive: true });

    const serialized = JSON.stringify({
      ...record,
      ciphertext: record.ciphertext?.toString("base64"),
    });

    await fs.writeFile(filePath, serialized, "utf-8");
  }

  public async load(filePath: string): Promise<StateRecord | null> {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);

      if (parsed.ciphertext) {
        parsed.ciphertext = Buffer.from(parsed.ciphertext, "base64");
      }

      return parsed;
    } catch (error) {
      if ((error as any).code !== "ENOENT") {
        throw error;
      }
      return null;
    }
  }

  public async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as any).code !== "ENOENT") {
        throw error;
      }
    }
  }

  public async listStates(): Promise<string[]> {
    // Simplified implementation - in real world would recursively scan directories
    return [];
  }
}

class DatabaseStorageAdapter {
  public async store(record: StateRecord): Promise<void> {
    // Mock database storage - in real implementation would use actual database
    logger.debug("Storing record in database", { stateId: record.id });
  }

  public async load(stateId: string): Promise<StateRecord | null> {
    // Mock database load
    logger.debug("Loading record from database", { stateId });
    return null;
  }

  public async delete(stateId: string): Promise<void> {
    // Mock database delete
    logger.debug("Deleting record from database", { stateId });
  }

  public async close(): Promise<void> {
    // Close database connections
    logger.debug("Closing database connections");
  }
}

class CompressionEngine {
  public async compress(data: Buffer): Promise<Buffer> {
    // Mock compression - in real implementation would use zlib or similar
    logger.debug("Compressing data", { originalSize: data.length });
    return data; // No actual compression in mock
  }

  public async decompress(data: Buffer): Promise<Buffer> {
    // Mock decompression
    logger.debug("Decompressing data", { compressedSize: data.length });
    return data; // No actual decompression in mock
  }
}

class EncryptionEngine {
  public async encrypt(data: Buffer): Promise<Buffer> {
    // Mock encryption - in real implementation would use proper encryption
    logger.debug("Encrypting data", { dataSize: data.length });
    return data; // No actual encryption in mock
  }

  public async decrypt(data: Buffer): Promise<Buffer> {
    // Mock decryption
    logger.debug("Decrypting data", { dataSize: data.length });
    return data; // No actual decryption in mock
  }
}

// Supporting interfaces
export interface IntegrityReport {
  totalStates: number;
  verifiedStates: number;
  corruptedStates: number;
  missingStates: number;
  repairedStates: number;
  irreparableStates: number;
  details: Array<{
    stateId: string;
    issue: string;
    error?: string;
  }>;
}

// Export everything
export {
  StateManager as default,
  FileStorageAdapter,
  DatabaseStorageAdapter,
  CompressionEngine,
  EncryptionEngine,
};
