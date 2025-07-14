// QISDD-SDK Logging & Auditing System
// packages/core/src/logging/index.ts

import { EventEmitter } from 'events';
import { createHash, randomBytes } from 'crypto';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Core Logging Interfaces
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  event: string;
  message: string;
  data?: any;
  context?: LogContext;
  correlationId?: string;
  error?: Error;
  stackTrace?: string;
  performance?: PerformanceMetrics;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  result: 'success' | 'failure' | 'partial';
  reason?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: Geolocation;
  riskScore?: number;
  compliance?: ComplianceInfo;
}

export interface PerformanceMetrics {
  duration: number; // milliseconds
  memoryUsage?: number; // bytes
  cpuUsage?: number; // percentage
  networkIO?: number; // bytes
  diskIO?: number; // bytes
  cacheHits?: number;
  cacheMisses?: number;
}

export interface LogContext {
  superpositionId?: string;
  stateId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  operationId?: string;
  component: string;
  version?: string;
  environment?: string;
  region?: string;
  correlationId?: string;
}

export interface ComplianceInfo {
  regulation: string; // GDPR, PCI-DSS, SOX, etc.
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  evidence?: string;
}

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

export enum LogCategory {
  QUANTUM = 'quantum',
  CRYPTO = 'crypto',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  AUDIT = 'audit',
  COMPLIANCE = 'compliance',
  SYSTEM = 'system',
  USER = 'user',
  API = 'api',
  BLOCKCHAIN = 'blockchain'
}

// Main Logger Class
export class QISDDLogger extends EventEmitter {
  private logEntries: LogEntry[] = [];
  private auditEvents: AuditEvent[] = [];
  private config: LoggerConfig;
  private performanceCounters: Map<string, number> = new Map();
  private rotationTimer?: NodeJS.Timeout;

  constructor(config: Partial<LoggerConfig> = {}) {
    super();
    
    this.config = {
      level: LogLevel.INFO,
      maxEntries: 10000,
      enableConsole: true,
      enableFile: true,
      enableStructured: true,
      logDirectory: './logs',
      rotationInterval: 24 * 60 * 60 * 1000, // 24 hours
      compressionEnabled: true,
      encryptionEnabled: false,
      retentionDays: 90,
      bufferSize: 100,
      flushInterval: 5000, // 5 seconds
      enableMetrics: true,
      enableCorrelation: true,
      sensitiveDataMasking: true,
      ...config
    };

    this.setupLogRotation();
    this.setupPeriodicFlush();
  }

  // Core logging methods
  public trace(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.TRACE, LogCategory.SYSTEM, 'trace', message, data, context);
  }

  public debug(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.DEBUG, LogCategory.SYSTEM, 'debug', message, data, context);
  }

  public info(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.INFO, LogCategory.SYSTEM, 'info', message, data, context);
  }

  public warn(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.WARN, LogCategory.SYSTEM, 'warning', message, data, context);
  }

  public error(message: string, error?: Error, data?: any, context?: LogContext): void {
    this.log(LogLevel.ERROR, LogCategory.SYSTEM, 'error', message, data, context, error);
  }

  public fatal(message: string, error?: Error, data?: any, context?: LogContext): void {
    this.log(LogLevel.FATAL, LogCategory.SYSTEM, 'fatal', message, data, context, error);
  }

  // Category-specific logging methods
  public quantum(level: LogLevel, event: string, message: string, data?: any, context?: LogContext): void {
    this.log(level, LogCategory.QUANTUM, event, message, data, context);
  }

  public crypto(level: LogLevel, event: string, message: string, data?: any, context?: LogContext): void {
    this.log(level, LogCategory.CRYPTO, event, message, data, context);
  }

  public security(level: LogLevel, event: string, message: string, data?: any, context?: LogContext): void {
    this.log(level, LogCategory.SECURITY, event, message, data, context);
  }

  public audit(event: AuditEvent): void {
    this.auditEvents.push(event);
    
    // Emit for real-time processing
    this.emit('auditEvent', event);
    
    // Log as structured entry
    this.log(LogLevel.INFO, LogCategory.AUDIT, event.action, 
      `User ${event.userId} performed ${event.action} on ${event.resource}`, 
      event, {
        userId: event.userId,
        sessionId: event.sessionId,
        component: 'audit'
      });

    // Trim audit events if needed
    if (this.auditEvents.length > this.config.maxEntries) {
      this.auditEvents = this.auditEvents.slice(-this.config.maxEntries);
    }
  }

  // Performance logging
  public startPerformanceTimer(operationId: string): void {
    this.performanceCounters.set(operationId, Date.now());
  }

  public endPerformanceTimer(operationId: string, additionalMetrics?: Partial<PerformanceMetrics>): PerformanceMetrics {
    const startTime = this.performanceCounters.get(operationId);
    if (!startTime) {
      throw new Error(`Performance timer ${operationId} was not started`);
    }

    const duration = Date.now() - startTime;
    this.performanceCounters.delete(operationId);

    const metrics: PerformanceMetrics = {
      duration,
      memoryUsage: process.memoryUsage().heapUsed,
      ...additionalMetrics
    };

    this.log(LogLevel.INFO, LogCategory.PERFORMANCE, 'operation_completed', 
      `Operation ${operationId} completed`, 
      { operationId, metrics },
      { operationId, component: 'performance' },
      undefined,
      metrics
    );

    return metrics;
  }

  // Structured logging with correlation
  public correlatedLog(correlationId: string, level: LogLevel, category: LogCategory, 
                      event: string, message: string, data?: any, context?: LogContext): void {
    this.log(level, category, event, message, data, { ...context, correlationId });
  }

  // Main logging implementation
  private log(
    level: LogLevel,
    category: LogCategory,
    event: string,
    message: string,
    data?: any,
    context?: LogContext,
    error?: Error,
    performance?: PerformanceMetrics
  ): void {
    if (level < this.config.level) {
      return; // Skip if below configured level
    }

    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      category,
      event,
      message,
      data: this.config.sensitiveDataMasking ? this.maskSensitiveData(data) : data,
      context,
      error,
      stackTrace: error ? error.stack : undefined,
      performance
    };

    this.logEntries.push(logEntry);

    // Emit for real-time processing
    this.emit('logEntry', logEntry);

    // Console output
    if (this.config.enableConsole) {
      this.outputToConsole(logEntry);
    }

    // Async file writing (non-blocking)
    if (this.config.enableFile) {
      this.writeToFileAsync(logEntry).catch(err => {
        console.error('Failed to write log to file:', err);
      });
    }

    // Trim log entries if needed
    if (this.logEntries.length > this.config.maxEntries) {
      this.logEntries = this.logEntries.slice(-this.config.maxEntries);
    }
  }

  // Query and filtering methods
  public getLogEntries(filter?: LogFilter): LogEntry[] {
    let entries = [...this.logEntries];

    if (filter) {
      if (filter.level !== undefined) {
        entries = entries.filter(e => e.level >= filter.level!);
      }
      if (filter.category) {
        entries = entries.filter(e => e.category === filter.category);
      }
      if (filter.startTime) {
        entries = entries.filter(e => e.timestamp >= filter.startTime!);
      }
      if (filter.endTime) {
        entries = entries.filter(e => e.timestamp <= filter.endTime!);
      }
      if (filter.correlationId) {
        entries = entries.filter(e => e.context?.correlationId === filter.correlationId);
      }
      if (filter.userId) {
        entries = entries.filter(e => e.context?.userId === filter.userId);
      }
      if (filter.component) {
        entries = entries.filter(e => e.context?.component === filter.component);
      }
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        entries = entries.filter(e => 
          e.message.toLowerCase().includes(searchLower) ||
          e.event.toLowerCase().includes(searchLower)
        );
      }
    }

    return entries.slice(0, filter?.limit || 1000);
  }

  public getAuditEvents(filter?: AuditFilter): AuditEvent[] {
    let events = [...this.auditEvents];

    if (filter) {
      if (filter.userId) {
        events = events.filter(e => e.userId === filter.userId);
      }
      if (filter.action) {
        events = events.filter(e => e.action === filter.action);
      }
      if (filter.resource) {
        events = events.filter(e => e.resource === filter.resource);
      }
      if (filter.result) {
        events = events.filter(e => e.result === filter.result);
      }
      if (filter.startTime) {
        events = events.filter(e => e.timestamp >= filter.startTime!);
      }
      if (filter.endTime) {
        events = events.filter(e => e.timestamp <= filter.endTime!);
      }
      if (filter.riskScoreMin !== undefined) {
        events = events.filter(e => (e.riskScore || 0) >= filter.riskScoreMin!);
      }
    }

    return events.slice(0, filter?.limit || 1000);
  }

  // Analytics and reporting
  public generateSecurityReport(timeRange: { start: Date; end: Date }): SecurityReport {
    const auditEvents = this.getAuditEvents({
      startTime: timeRange.start,
      endTime: timeRange.end
    });

    const logEntries = this.getLogEntries({
      startTime: timeRange.start,
      endTime: timeRange.end,
      category: LogCategory.SECURITY
    });

    const failedAttempts = auditEvents.filter(e => e.result === 'failure');
    const securityEvents = logEntries.filter(e => 
      e.level >= LogLevel.WARN && e.category === LogCategory.SECURITY
    );

    const userActivities = this.analyzeUserActivities(auditEvents);
    const threatIndicators = this.detectThreatIndicators(auditEvents, logEntries);
    const complianceStatus = this.assessCompliance(auditEvents);

    return {
      period: timeRange,
      summary: {
        totalEvents: auditEvents.length,
        successfulOperations: auditEvents.filter(e => e.result === 'success').length,
        failedOperations: failedAttempts.length,
        securityIncidents: securityEvents.length,
        uniqueUsers: new Set(auditEvents.map(e => e.userId).filter(Boolean)).size,
        averageRiskScore: this.calculateAverageRiskScore(auditEvents)
      },
      failedAttempts: failedAttempts.slice(0, 100), // Top 100
      securityEvents: securityEvents.slice(0, 100), // Top 100
      userActivities,
      threatIndicators,
      complianceStatus,
      recommendations: this.generateSecurityRecommendations(failedAttempts, securityEvents)
    };
  }

  public generatePerformanceReport(timeRange: { start: Date; end: Date }): PerformanceReport {
    const performanceLogs = this.getLogEntries({
      startTime: timeRange.start,
      endTime: timeRange.end,
      category: LogCategory.PERFORMANCE
    }).filter(e => e.performance);

    const durations = performanceLogs.map(e => e.performance!.duration);
    const memoryUsages = performanceLogs.map(e => e.performance!.memoryUsage).filter(Boolean) as number[];

    return {
      period: timeRange,
      summary: {
        totalOperations: performanceLogs.length,
        averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
        medianDuration: this.calculateMedian(durations),
        p95Duration: this.calculatePercentile(durations, 95),
        p99Duration: this.calculatePercentile(durations, 99),
        averageMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length || 0,
        slowestOperations: this.findSlowestOperations(performanceLogs, 10)
      },
      trends: this.analyzePerformanceTrends(performanceLogs),
      bottlenecks: this.identifyBottlenecks(performanceLogs),
      recommendations: this.generatePerformanceRecommendations(performanceLogs)
    };
  }

  // Export and backup
  public async exportLogs(format: 'json' | 'csv' | 'ndjson' = 'json'): Promise<string> {
    const data = {
      metadata: {
        exportTime: new Date(),
        totalEntries: this.logEntries.length,
        totalAuditEvents: this.auditEvents.length,
        format
      },
      logEntries: this.logEntries,
      auditEvents: this.auditEvents
    };

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'ndjson':
        return this.logEntries.map(entry => JSON.stringify(entry)).join('\n');
      case 'csv':
        return this.convertToCSV(this.logEntries);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  // Cleanup and maintenance
  public async cleanup(): Promise<void> {
    const cutoffDate = new Date(Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000));
    
    const beforeLogCount = this.logEntries.length;
    const beforeAuditCount = this.auditEvents.length;
    
    this.logEntries = this.logEntries.filter(entry => entry.timestamp > cutoffDate);
    this.auditEvents = this.auditEvents.filter(event => event.timestamp > cutoffDate);
    
    this.info('Log cleanup completed', {
      removedLogEntries: beforeLogCount - this.logEntries.length,
      removedAuditEvents: beforeAuditCount - this.auditEvents.length,
      cutoffDate
    });
  }

  public destroy(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
    this.removeAllListeners();
    this.logEntries = [];
    this.auditEvents = [];
  }

  // Private helper methods
  private generateId(): string {
    return `log_${Date.now()}_${randomBytes(4).toString('hex')}`;
  }

  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'credentials',
      'ssn', 'sin', 'creditCard', 'bankAccount', 'pin'
    ];

    const masked = { ...data };
    
    for (const [key, value] of Object.entries(masked)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        masked[key] = '***MASKED***';
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = this.maskSensitiveData(value);
      }
    }

    return masked;
  }

  private outputToConsole(entry: LogEntry): void {
    const levelColors = {
      [LogLevel.TRACE]: '\x1b[37m', // White
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m'  // Magenta
    };

    const reset = '\x1b[0m';
    const color = levelColors[entry.level];
    const levelName = LogLevel[entry.level];
    
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? ` [${entry.context.component}]` : '';
    const correlationId = entry.context?.correlationId ? ` (${entry.context.correlationId})` : '';
    
    console.log(`${color}${timestamp} ${levelName}${context}${correlationId}: ${entry.message}${reset}`);
    
    if (entry.data && this.config.level <= LogLevel.DEBUG) {
      console.log('  Data:', entry.data);
    }
    
    if (entry.error) {
      console.error('  Error:', entry.error.message);
      if (entry.stackTrace && this.config.level <= LogLevel.DEBUG) {
        console.error('  Stack:', entry.stackTrace);
      }
    }
  }

  private async writeToFileAsync(entry: LogEntry): Promise<void> {
    try {
      await mkdir(this.config.logDirectory, { recursive: true });
      
      const filename = this.getLogFilename();
      const filepath = join(this.config.logDirectory, filename);
      
      const logLine = this.config.enableStructured 
        ? JSON.stringify(entry) + '\n'
        : this.formatPlainTextLog(entry) + '\n';
      
      await appendFile(filepath, logLine, 'utf-8');
    } catch (error) {
      // Don't log errors about logging to prevent infinite loops
      console.error('Failed to write log entry to file:', error);
    }
  }

  private getLogFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    return `qisdd-${date}.log`;
  }

  private formatPlainTextLog(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const context = entry.context ? ` [${entry.context.component}]` : '';
    
    let line = `${timestamp} ${level}${context}: ${entry.message}`;
    
    if (entry.data) {
      line += ` | Data: ${JSON.stringify(entry.data)}`;
    }
    
    if (entry.error) {
      line += ` | Error: ${entry.error.message}`;
    }
    
    return line;
  }

  private setupLogRotation(): void {
    this.rotationTimer = setInterval(async () => {
      await this.rotateLogFiles();
    }, this.config.rotationInterval);
  }

  private setupPeriodicFlush(): void {
    setInterval(() => {
      this.emit('flush', {
        logEntries: this.logEntries.length,
        auditEvents: this.auditEvents.length
      });
    }, this.config.flushInterval);
  }

  private async rotateLogFiles(): Promise<void> {
    // Implementation for log file rotation
    this.info('Log rotation initiated');
  }

  // Analytics helper methods
  private analyzeUserActivities(auditEvents: AuditEvent[]): any {
    const userStats = new Map<string, any>();
    
    auditEvents.forEach(event => {
      if (!event.userId) return;
      
      if (!userStats.has(event.userId)) {
        userStats.set(event.userId, {
          userId: event.userId,
          totalActions: 0,
          successfulActions: 0,
          failedActions: 0,
          uniqueResources: new Set(),
          averageRiskScore: 0,
          firstAction: event.timestamp,
          lastAction: event.timestamp
        });
      }
      
      const stats = userStats.get(event.userId)!;
      stats.totalActions++;
      
      if (event.result === 'success') {
        stats.successfulActions++;
      } else if (event.result === 'failure') {
        stats.failedActions++;
      }
      
      stats.uniqueResources.add(event.resource);
      
      if (event.timestamp < stats.firstAction) {
        stats.firstAction = event.timestamp;
      }
      if (event.timestamp > stats.lastAction) {
        stats.lastAction = event.timestamp;
      }
    });
    
    return Array.from(userStats.values()).map(stats => ({
      ...stats,
      uniqueResources: stats.uniqueResources.size
    }));
  }

  private detectThreatIndicators(auditEvents: AuditEvent[], logEntries: LogEntry[]): any[] {
    const indicators = [];
    
    // Multiple failed attempts
    const failuresByUser = new Map<string, number>();
    auditEvents.filter(e => e.result === 'failure').forEach(event => {
      const count = failuresByUser.get(event.userId || 'unknown') || 0;
      failuresByUser.set(event.userId || 'unknown', count + 1);
    });
    
    failuresByUser.forEach((count, userId) => {
      if (count >= 5) {
        indicators.push({
          type: 'multiple_failures',
          userId,
          count,
          severity: count >= 10 ? 'high' : 'medium'
        });
      }
    });
    
    // High risk score events
    const highRiskEvents = auditEvents.filter(e => (e.riskScore || 0) > 0.8);
    if (highRiskEvents.length > 0) {
      indicators.push({
        type: 'high_risk_activity',
        count: highRiskEvents.length,
        averageRiskScore: highRiskEvents.reduce((sum, e) => sum + (e.riskScore || 0), 0) / highRiskEvents.length,
        severity: 'high'
      });
    }
    
    return indicators;
  }

  private assessCompliance(auditEvents: AuditEvent[]): any {
    const complianceEvents = auditEvents.filter(e => e.compliance);
    
    const complianceByRegulation = new Map<string, any>();
    
    complianceEvents.forEach(event => {
      const regulation = event.compliance!.regulation;
      if (!complianceByRegulation.has(regulation)) {
        complianceByRegulation.set(regulation, {
          regulation,
          total: 0,
          compliant: 0,
          nonCompliant: 0,
          pending: 0
        });
      }
      
      const stats = complianceByRegulation.get(regulation)!;
      stats.total++;
      
      switch (event.compliance!.status) {
        case 'compliant':
          stats.compliant++;
          break;
        case 'non-compliant':
          stats.nonCompliant++;
          break;
        case 'pending':
          stats.pending++;
          break;
      }
    });
    
    return Array.from(complianceByRegulation.values());
  }

  private generateSecurityRecommendations(failedAttempts: AuditEvent[], securityEvents: LogEntry[]): string[] {
    const recommendations = [];
    
    if (failedAttempts.length > 100) {
      recommendations.push('Consider implementing rate limiting or account lockout policies');
    }
    
    if (securityEvents.length > 50) {
      recommendations.push('Review security event patterns and consider additional monitoring');
    }
    
    const highRiskAttempts = failedAttempts.filter(e => (e.riskScore || 0) > 0.7);
    if (highRiskAttempts.length > 10) {
      recommendations.push('Implement additional authentication factors for high-risk scenarios');
    }
    
    return recommendations;
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private calculatePercentile(numbers: number[], percentile: number): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private calculateAverageRiskScore(auditEvents: AuditEvent[]): number {
    const eventsWithRisk = auditEvents.filter(e => e.riskScore !== undefined);
    if (eventsWithRisk.length === 0) return 0;
    
    return eventsWithRisk.reduce((sum, e) => sum + e.riskScore!, 0) / eventsWithRisk.length;
  }

  private findSlowestOperations(logs: LogEntry[], count: number): any[] {
    return logs
      .filter(log => log.performance)
      .sort((a, b) => b.performance!.duration - a.performance!.duration)
      .slice(0, count)
      .map(log => ({
        event: log.event,
        duration: log.performance!.duration,
        timestamp: log.timestamp,
        context: log.context
      }));
  }

  private analyzePerformanceTrends(logs: LogEntry[]): any {
    // Implementation for performance trend analysis
    return { trend: 'stable', analysis: 'Performance metrics within normal ranges' };
  }

  private identifyBottlenecks(logs: LogEntry[]): any[] {
    // Implementation for bottleneck identification
    return [];
  }

  private generatePerformanceRecommendations(logs: LogEntry[]): string[] {
    const recommendations = [];
    
    const slowOperations = logs.filter(log => 
      log.performance && log.performance.duration > 1000
    );
    
    if (slowOperations.length > logs.length * 0.1) {
      recommendations.push('Consider optimizing slow operations or implementing caching');
    }
    
    return recommendations;
  }

  private convertToCSV(logEntries: LogEntry[]): string {
    const headers = ['timestamp', 'level', 'category', 'event', 'message', 'userId', 'component'];
    const rows = logEntries.map(entry => [
      entry.timestamp.toISOString(),
      LogLevel[entry.level],
      entry.category,
      entry.event,
      entry.message.replace(/"/g, '""'), // Escape quotes
      entry.context?.userId || '',
      entry.context?.component || ''
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

// Supporting interfaces and types
export interface LoggerConfig {
  level: LogLevel;
  maxEntries: number;
  enableConsole: boolean;
  enableFile: boolean;
  enableStructured: boolean;
  logDirectory: string;
  rotationInterval: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  retentionDays: number;
  bufferSize: number;
  flushInterval: number;
  enableMetrics: boolean;
  enableCorrelation: boolean;
  sensitiveDataMasking: boolean;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  startTime?: Date;
  endTime?: Date;
  correlationId?: string;
  userId?: string;
  component?: string;
  searchText?: string;
  limit?: number;
}

export interface AuditFilter {
  userId?: string;
  action?: string;
  resource?: string;
  result?: 'success' | 'failure' | 'partial';
  startTime?: Date;
  endTime?: Date;
  riskScoreMin?: number;
  limit?: number;
}

export interface SecurityReport {
  period: { start: Date; end: Date };
  summary: {
    totalEvents: number;
    successfulOperations: number;
    failedOperations: number;
    securityIncidents: number;
    uniqueUsers: number;
    averageRiskScore: number;
  };
  failedAttempts: AuditEvent[];
  securityEvents: LogEntry[];
  userActivities: any[];
  threatIndicators: any[];
  complianceStatus: any[];
  recommendations: string[];
}

export interface PerformanceReport {
  period: { start: Date; end: Date };
  summary: {
    totalOperations: number;
    averageDuration: number;
    medianDuration: number;
    p95Duration: number;
    p99Duration: number;
    averageMemoryUsage: number;
    slowestOperations: any[];
  };
  trends: any;
  bottlenecks: any[];
  recommendations: string[];
}

// Factory for creating pre-configured loggers
export class LoggerFactory {
  public static createQuantumLogger(config?: Partial<LoggerConfig>): QISDDLogger {
    return new QISDDLogger({
      level: LogLevel.DEBUG,
      enableCorrelation: true,
      enableMetrics: true,
      ...config
    });
  }

  public static createProductionLogger(config?: Partial<LoggerConfig>): QISDDLogger {
    return new QISDDLogger({
      level: LogLevel.INFO,
      enableConsole: false,
      enableFile: true,
      enableStructured: true,
      ...config
    });
  }

  public static createSecurityLogger(config?: Partial<LoggerConfig>): QISDDLogger {
    return new QISDDLogger({
      level: LogLevel.WARN,
      sensitiveDataMasking: true,
      encryptionEnabled: true,
      retentionDays: 365, // Keep security logs longer
      ...config
    });
  }
}

// Global logger instance
export const globalLogger = new QISDDLogger();

// Export singleton for backward compatibility
export default globalLogger;