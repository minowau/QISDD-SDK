// QISDD-SDK: Types

export type BlockchainConfig = {
  network: string;
  contractAddress?: string;
  privateKey?: string;
};

export type EncryptionConfig = {
  scheme: string;
  keySize?: number;
  publicKey?: string;
  privateKey?: string;
};

export type ZKPConfig = {
  scheme: string;
  provingKey?: string;
  verificationKey?: string;
};

export type ContextConfig = {
  trustThreshold?: number;
  anomalyDetection?: boolean;
  mlModel?: string;
};

export type ComplianceConfig = {
  mode?: string;
  regulations?: string[];
  dataResidency?: string;
};

export type DefenseConfig = {
  enableQuantumCollapse?: boolean;
  enableHoneypot?: boolean;
  alertThreshold?: number;
};

export type StorageConfig = {
  type?: string;
  ipfsHost?: string;
  redisHost?: string;
};

export type QISDDConfig = {
  apiKey?: string;
  environment?: string;
  timeout?: number;
  retries?: number;
  blockchain?: BlockchainConfig;
  encryption?: EncryptionConfig;
  zkp?: ZKPConfig;
  context?: ContextConfig;
  compliance?: ComplianceConfig;
  defense?: DefenseConfig;
  storage?: StorageConfig;
}; 