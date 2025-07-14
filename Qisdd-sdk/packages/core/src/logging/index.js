"use strict";
// QISDD-SDK Logging & Auditing System
// packages/core/src/logging/index.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLogger = exports.LoggerFactory = exports.QISDDLogger = exports.LogCategory = exports.LogLevel = void 0;
var events_1 = require("events");
var crypto_1 = require("crypto");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 5] = "FATAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var LogCategory;
(function (LogCategory) {
    LogCategory["QUANTUM"] = "quantum";
    LogCategory["CRYPTO"] = "crypto";
    LogCategory["SECURITY"] = "security";
    LogCategory["PERFORMANCE"] = "performance";
    LogCategory["AUDIT"] = "audit";
    LogCategory["COMPLIANCE"] = "compliance";
    LogCategory["SYSTEM"] = "system";
    LogCategory["USER"] = "user";
    LogCategory["API"] = "api";
    LogCategory["BLOCKCHAIN"] = "blockchain";
})(LogCategory || (exports.LogCategory = LogCategory = {}));
// Main Logger Class
var QISDDLogger = /** @class */ (function (_super) {
    __extends(QISDDLogger, _super);
    function QISDDLogger(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.logEntries = [];
        _this.auditEvents = [];
        _this.performanceCounters = new Map();
        _this.config = __assign({ level: LogLevel.INFO, maxEntries: 10000, enableConsole: true, enableFile: true, enableStructured: true, logDirectory: './logs', rotationInterval: 24 * 60 * 60 * 1000, compressionEnabled: true, encryptionEnabled: false, retentionDays: 90, bufferSize: 100, flushInterval: 5000, enableMetrics: true, enableCorrelation: true, sensitiveDataMasking: true }, config);
        _this.setupLogRotation();
        _this.setupPeriodicFlush();
        return _this;
    }
    // Core logging methods
    QISDDLogger.prototype.trace = function (message, data, context) {
        this.log(LogLevel.TRACE, LogCategory.SYSTEM, 'trace', message, data, context);
    };
    QISDDLogger.prototype.debug = function (message, data, context) {
        this.log(LogLevel.DEBUG, LogCategory.SYSTEM, 'debug', message, data, context);
    };
    QISDDLogger.prototype.info = function (message, data, context) {
        this.log(LogLevel.INFO, LogCategory.SYSTEM, 'info', message, data, context);
    };
    QISDDLogger.prototype.warn = function (message, data, context) {
        this.log(LogLevel.WARN, LogCategory.SYSTEM, 'warning', message, data, context);
    };
    QISDDLogger.prototype.error = function (message, error, data, context) {
        this.log(LogLevel.ERROR, LogCategory.SYSTEM, 'error', message, data, context, error);
    };
    QISDDLogger.prototype.fatal = function (message, error, data, context) {
        this.log(LogLevel.FATAL, LogCategory.SYSTEM, 'fatal', message, data, context, error);
    };
    // Category-specific logging methods
    QISDDLogger.prototype.quantum = function (level, event, message, data, context) {
        this.log(level, LogCategory.QUANTUM, event, message, data, context);
    };
    QISDDLogger.prototype.crypto = function (level, event, message, data, context) {
        this.log(level, LogCategory.CRYPTO, event, message, data, context);
    };
    QISDDLogger.prototype.security = function (level, event, message, data, context) {
        this.log(level, LogCategory.SECURITY, event, message, data, context);
    };
    QISDDLogger.prototype.audit = function (event) {
        this.auditEvents.push(event);
        // Emit for real-time processing
        this.emit('auditEvent', event);
        // Log as structured entry
        this.log(LogLevel.INFO, LogCategory.AUDIT, event.action, "User ".concat(event.userId, " performed ").concat(event.action, " on ").concat(event.resource), event, {
            userId: event.userId,
            sessionId: event.sessionId,
            component: 'audit'
        });
        // Trim audit events if needed
        if (this.auditEvents.length > this.config.maxEntries) {
            this.auditEvents = this.auditEvents.slice(-this.config.maxEntries);
        }
    };
    // Performance logging
    QISDDLogger.prototype.startPerformanceTimer = function (operationId) {
        this.performanceCounters.set(operationId, Date.now());
    };
    QISDDLogger.prototype.endPerformanceTimer = function (operationId, additionalMetrics) {
        var startTime = this.performanceCounters.get(operationId);
        if (!startTime) {
            throw new Error("Performance timer ".concat(operationId, " was not started"));
        }
        var duration = Date.now() - startTime;
        this.performanceCounters.delete(operationId);
        var metrics = __assign({ duration: duration, memoryUsage: process.memoryUsage().heapUsed }, additionalMetrics);
        this.log(LogLevel.INFO, LogCategory.PERFORMANCE, 'operation_completed', "Operation ".concat(operationId, " completed"), { operationId: operationId, metrics: metrics }, { operationId: operationId, component: 'performance' }, undefined, metrics);
        return metrics;
    };
    // Structured logging with correlation
    QISDDLogger.prototype.correlatedLog = function (correlationId, level, category, event, message, data, context) {
        this.log(level, category, event, message, data, __assign(__assign({}, context), { correlationId: correlationId }));
    };
    // Main logging implementation
    QISDDLogger.prototype.log = function (level, category, event, message, data, context, error, performance) {
        if (level < this.config.level) {
            return; // Skip if below configured level
        }
        var logEntry = {
            id: this.generateId(),
            timestamp: new Date(),
            level: level,
            category: category,
            event: event,
            message: message,
            data: this.config.sensitiveDataMasking ? this.maskSensitiveData(data) : data,
            context: context,
            error: error,
            stackTrace: error ? error.stack : undefined,
            performance: performance
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
            this.writeToFileAsync(logEntry).catch(function (err) {
                console.error('Failed to write log to file:', err);
            });
        }
        // Trim log entries if needed
        if (this.logEntries.length > this.config.maxEntries) {
            this.logEntries = this.logEntries.slice(-this.config.maxEntries);
        }
    };
    // Query and filtering methods
    QISDDLogger.prototype.getLogEntries = function (filter) {
        var entries = __spreadArray([], this.logEntries, true);
        if (filter) {
            if (filter.level !== undefined) {
                entries = entries.filter(function (e) { return e.level >= filter.level; });
            }
            if (filter.category) {
                entries = entries.filter(function (e) { return e.category === filter.category; });
            }
            if (filter.startTime) {
                entries = entries.filter(function (e) { return e.timestamp >= filter.startTime; });
            }
            if (filter.endTime) {
                entries = entries.filter(function (e) { return e.timestamp <= filter.endTime; });
            }
            if (filter.correlationId) {
                entries = entries.filter(function (e) { var _a; return ((_a = e.context) === null || _a === void 0 ? void 0 : _a.correlationId) === filter.correlationId; });
            }
            if (filter.userId) {
                entries = entries.filter(function (e) { var _a; return ((_a = e.context) === null || _a === void 0 ? void 0 : _a.userId) === filter.userId; });
            }
            if (filter.component) {
                entries = entries.filter(function (e) { var _a; return ((_a = e.context) === null || _a === void 0 ? void 0 : _a.component) === filter.component; });
            }
            if (filter.searchText) {
                var searchLower_1 = filter.searchText.toLowerCase();
                entries = entries.filter(function (e) {
                    return e.message.toLowerCase().includes(searchLower_1) ||
                        e.event.toLowerCase().includes(searchLower_1);
                });
            }
        }
        return entries.slice(0, (filter === null || filter === void 0 ? void 0 : filter.limit) || 1000);
    };
    QISDDLogger.prototype.getAuditEvents = function (filter) {
        var events = __spreadArray([], this.auditEvents, true);
        if (filter) {
            if (filter.userId) {
                events = events.filter(function (e) { return e.userId === filter.userId; });
            }
            if (filter.action) {
                events = events.filter(function (e) { return e.action === filter.action; });
            }
            if (filter.resource) {
                events = events.filter(function (e) { return e.resource === filter.resource; });
            }
            if (filter.result) {
                events = events.filter(function (e) { return e.result === filter.result; });
            }
            if (filter.startTime) {
                events = events.filter(function (e) { return e.timestamp >= filter.startTime; });
            }
            if (filter.endTime) {
                events = events.filter(function (e) { return e.timestamp <= filter.endTime; });
            }
            if (filter.riskScoreMin !== undefined) {
                events = events.filter(function (e) { return (e.riskScore || 0) >= filter.riskScoreMin; });
            }
        }
        return events.slice(0, (filter === null || filter === void 0 ? void 0 : filter.limit) || 1000);
    };
    // Analytics and reporting
    QISDDLogger.prototype.generateSecurityReport = function (timeRange) {
        var auditEvents = this.getAuditEvents({
            startTime: timeRange.start,
            endTime: timeRange.end
        });
        var logEntries = this.getLogEntries({
            startTime: timeRange.start,
            endTime: timeRange.end,
            category: LogCategory.SECURITY
        });
        var failedAttempts = auditEvents.filter(function (e) { return e.result === 'failure'; });
        var securityEvents = logEntries.filter(function (e) {
            return e.level >= LogLevel.WARN && e.category === LogCategory.SECURITY;
        });
        var userActivities = this.analyzeUserActivities(auditEvents);
        var threatIndicators = this.detectThreatIndicators(auditEvents, logEntries);
        var complianceStatus = this.assessCompliance(auditEvents);
        return {
            period: timeRange,
            summary: {
                totalEvents: auditEvents.length,
                successfulOperations: auditEvents.filter(function (e) { return e.result === 'success'; }).length,
                failedOperations: failedAttempts.length,
                securityIncidents: securityEvents.length,
                uniqueUsers: new Set(auditEvents.map(function (e) { return e.userId; }).filter(Boolean)).size,
                averageRiskScore: this.calculateAverageRiskScore(auditEvents)
            },
            failedAttempts: failedAttempts.slice(0, 100), // Top 100
            securityEvents: securityEvents.slice(0, 100), // Top 100
            userActivities: userActivities,
            threatIndicators: threatIndicators,
            complianceStatus: complianceStatus,
            recommendations: this.generateSecurityRecommendations(failedAttempts, securityEvents)
        };
    };
    QISDDLogger.prototype.generatePerformanceReport = function (timeRange) {
        var performanceLogs = this.getLogEntries({
            startTime: timeRange.start,
            endTime: timeRange.end,
            category: LogCategory.PERFORMANCE
        }).filter(function (e) { return e.performance; });
        var durations = performanceLogs.map(function (e) { return e.performance.duration; });
        var memoryUsages = performanceLogs.map(function (e) { return e.performance.memoryUsage; }).filter(Boolean);
        return {
            period: timeRange,
            summary: {
                totalOperations: performanceLogs.length,
                averageDuration: durations.reduce(function (a, b) { return a + b; }, 0) / durations.length || 0,
                medianDuration: this.calculateMedian(durations),
                p95Duration: this.calculatePercentile(durations, 95),
                p99Duration: this.calculatePercentile(durations, 99),
                averageMemoryUsage: memoryUsages.reduce(function (a, b) { return a + b; }, 0) / memoryUsages.length || 0,
                slowestOperations: this.findSlowestOperations(performanceLogs, 10)
            },
            trends: this.analyzePerformanceTrends(performanceLogs),
            bottlenecks: this.identifyBottlenecks(performanceLogs),
            recommendations: this.generatePerformanceRecommendations(performanceLogs)
        };
    };
    // Export and backup
    QISDDLogger.prototype.exportLogs = function () {
        return __awaiter(this, arguments, void 0, function (format) {
            var data;
            if (format === void 0) { format = 'json'; }
            return __generator(this, function (_a) {
                data = {
                    metadata: {
                        exportTime: new Date(),
                        totalEntries: this.logEntries.length,
                        totalAuditEvents: this.auditEvents.length,
                        format: format
                    },
                    logEntries: this.logEntries,
                    auditEvents: this.auditEvents
                };
                switch (format) {
                    case 'json':
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                    case 'ndjson':
                        return [2 /*return*/, this.logEntries.map(function (entry) { return JSON.stringify(entry); }).join('\n')];
                    case 'csv':
                        return [2 /*return*/, this.convertToCSV(this.logEntries)];
                    default:
                        throw new Error("Unsupported format: ".concat(format));
                }
                return [2 /*return*/];
            });
        });
    };
    // Cleanup and maintenance
    QISDDLogger.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cutoffDate, beforeLogCount, beforeAuditCount;
            return __generator(this, function (_a) {
                cutoffDate = new Date(Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000));
                beforeLogCount = this.logEntries.length;
                beforeAuditCount = this.auditEvents.length;
                this.logEntries = this.logEntries.filter(function (entry) { return entry.timestamp > cutoffDate; });
                this.auditEvents = this.auditEvents.filter(function (event) { return event.timestamp > cutoffDate; });
                this.info('Log cleanup completed', {
                    removedLogEntries: beforeLogCount - this.logEntries.length,
                    removedAuditEvents: beforeAuditCount - this.auditEvents.length,
                    cutoffDate: cutoffDate
                });
                return [2 /*return*/];
            });
        });
    };
    QISDDLogger.prototype.destroy = function () {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
        }
        this.removeAllListeners();
        this.logEntries = [];
        this.auditEvents = [];
    };
    // Private helper methods
    QISDDLogger.prototype.generateId = function () {
        return "log_".concat(Date.now(), "_").concat((0, crypto_1.randomBytes)(4).toString('hex'));
    };
    QISDDLogger.prototype.maskSensitiveData = function (data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        var sensitiveFields = [
            'password', 'token', 'secret', 'key', 'credentials',
            'ssn', 'sin', 'creditCard', 'bankAccount', 'pin'
        ];
        var masked = __assign({}, data);
        var _loop_1 = function (key, value) {
            var lowerKey = key.toLowerCase();
            if (sensitiveFields.some(function (field) { return lowerKey.includes(field); })) {
                masked[key] = '***MASKED***';
            }
            else if (typeof value === 'object' && value !== null) {
                masked[key] = this_1.maskSensitiveData(value);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.entries(masked); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            _loop_1(key, value);
        }
        return masked;
    };
    QISDDLogger.prototype.outputToConsole = function (entry) {
        var _a;
        var _b;
        var levelColors = (_a = {},
            _a[LogLevel.TRACE] = '\x1b[37m',
            _a[LogLevel.DEBUG] = '\x1b[36m',
            _a[LogLevel.INFO] = '\x1b[32m',
            _a[LogLevel.WARN] = '\x1b[33m',
            _a[LogLevel.ERROR] = '\x1b[31m',
            _a[LogLevel.FATAL] = '\x1b[35m' // Magenta
        ,
            _a);
        var reset = '\x1b[0m';
        var color = levelColors[entry.level];
        var levelName = LogLevel[entry.level];
        var timestamp = entry.timestamp.toISOString();
        var context = entry.context ? " [".concat(entry.context.component, "]") : '';
        var correlationId = ((_b = entry.context) === null || _b === void 0 ? void 0 : _b.correlationId) ? " (".concat(entry.context.correlationId, ")") : '';
        console.log("".concat(color).concat(timestamp, " ").concat(levelName).concat(context).concat(correlationId, ": ").concat(entry.message).concat(reset));
        if (entry.data && this.config.level <= LogLevel.DEBUG) {
            console.log('  Data:', entry.data);
        }
        if (entry.error) {
            console.error('  Error:', entry.error.message);
            if (entry.stackTrace && this.config.level <= LogLevel.DEBUG) {
                console.error('  Stack:', entry.stackTrace);
            }
        }
    };
    QISDDLogger.prototype.writeToFileAsync = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, filepath, logLine, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, promises_1.mkdir)(this.config.logDirectory, { recursive: true })];
                    case 1:
                        _a.sent();
                        filename = this.getLogFilename();
                        filepath = (0, path_1.join)(this.config.logDirectory, filename);
                        logLine = this.config.enableStructured
                            ? JSON.stringify(entry) + '\n'
                            : this.formatPlainTextLog(entry) + '\n';
                        return [4 /*yield*/, (0, promises_1.appendFile)(filepath, logLine, 'utf-8')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Don't log errors about logging to prevent infinite loops
                        console.error('Failed to write log entry to file:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QISDDLogger.prototype.getLogFilename = function () {
        var date = new Date().toISOString().split('T')[0];
        return "qisdd-".concat(date, ".log");
    };
    QISDDLogger.prototype.formatPlainTextLog = function (entry) {
        var timestamp = entry.timestamp.toISOString();
        var level = LogLevel[entry.level];
        var context = entry.context ? " [".concat(entry.context.component, "]") : '';
        var line = "".concat(timestamp, " ").concat(level).concat(context, ": ").concat(entry.message);
        if (entry.data) {
            line += " | Data: ".concat(JSON.stringify(entry.data));
        }
        if (entry.error) {
            line += " | Error: ".concat(entry.error.message);
        }
        return line;
    };
    QISDDLogger.prototype.setupLogRotation = function () {
        var _this = this;
        this.rotationTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rotateLogFiles()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, this.config.rotationInterval);
    };
    QISDDLogger.prototype.setupPeriodicFlush = function () {
        var _this = this;
        setInterval(function () {
            _this.emit('flush', {
                logEntries: _this.logEntries.length,
                auditEvents: _this.auditEvents.length
            });
        }, this.config.flushInterval);
    };
    QISDDLogger.prototype.rotateLogFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementation for log file rotation
                this.info('Log rotation initiated');
                return [2 /*return*/];
            });
        });
    };
    // Analytics helper methods
    QISDDLogger.prototype.analyzeUserActivities = function (auditEvents) {
        var userStats = new Map();
        auditEvents.forEach(function (event) {
            if (!event.userId)
                return;
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
            var stats = userStats.get(event.userId);
            stats.totalActions++;
            if (event.result === 'success') {
                stats.successfulActions++;
            }
            else if (event.result === 'failure') {
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
        return Array.from(userStats.values()).map(function (stats) { return (__assign(__assign({}, stats), { uniqueResources: stats.uniqueResources.size })); });
    };
    QISDDLogger.prototype.detectThreatIndicators = function (auditEvents, logEntries) {
        var indicators = [];
        // Multiple failed attempts
        var failuresByUser = new Map();
        auditEvents.filter(function (e) { return e.result === 'failure'; }).forEach(function (event) {
            var count = failuresByUser.get(event.userId || 'unknown') || 0;
            failuresByUser.set(event.userId || 'unknown', count + 1);
        });
        failuresByUser.forEach(function (count, userId) {
            if (count >= 5) {
                indicators.push({
                    type: 'multiple_failures',
                    userId: userId,
                    count: count,
                    severity: count >= 10 ? 'high' : 'medium'
                });
            }
        });
        // High risk score events
        var highRiskEvents = auditEvents.filter(function (e) { return (e.riskScore || 0) > 0.8; });
        if (highRiskEvents.length > 0) {
            indicators.push({
                type: 'high_risk_activity',
                count: highRiskEvents.length,
                averageRiskScore: highRiskEvents.reduce(function (sum, e) { return sum + (e.riskScore || 0); }, 0) / highRiskEvents.length,
                severity: 'high'
            });
        }
        return indicators;
    };
    QISDDLogger.prototype.assessCompliance = function (auditEvents) {
        var complianceEvents = auditEvents.filter(function (e) { return e.compliance; });
        var complianceByRegulation = new Map();
        complianceEvents.forEach(function (event) {
            var regulation = event.compliance.regulation;
            if (!complianceByRegulation.has(regulation)) {
                complianceByRegulation.set(regulation, {
                    regulation: regulation,
                    total: 0,
                    compliant: 0,
                    nonCompliant: 0,
                    pending: 0
                });
            }
            var stats = complianceByRegulation.get(regulation);
            stats.total++;
            switch (event.compliance.status) {
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
    };
    QISDDLogger.prototype.generateSecurityRecommendations = function (failedAttempts, securityEvents) {
        var recommendations = [];
        if (failedAttempts.length > 100) {
            recommendations.push('Consider implementing rate limiting or account lockout policies');
        }
        if (securityEvents.length > 50) {
            recommendations.push('Review security event patterns and consider additional monitoring');
        }
        var highRiskAttempts = failedAttempts.filter(function (e) { return (e.riskScore || 0) > 0.7; });
        if (highRiskAttempts.length > 10) {
            recommendations.push('Implement additional authentication factors for high-risk scenarios');
        }
        return recommendations;
    };
    QISDDLogger.prototype.calculateMedian = function (numbers) {
        var sorted = __spreadArray([], numbers, true).sort(function (a, b) { return a - b; });
        var mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };
    QISDDLogger.prototype.calculatePercentile = function (numbers, percentile) {
        var sorted = __spreadArray([], numbers, true).sort(function (a, b) { return a - b; });
        var index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    };
    QISDDLogger.prototype.calculateAverageRiskScore = function (auditEvents) {
        var eventsWithRisk = auditEvents.filter(function (e) { return e.riskScore !== undefined; });
        if (eventsWithRisk.length === 0)
            return 0;
        return eventsWithRisk.reduce(function (sum, e) { return sum + e.riskScore; }, 0) / eventsWithRisk.length;
    };
    QISDDLogger.prototype.findSlowestOperations = function (logs, count) {
        return logs
            .filter(function (log) { return log.performance; })
            .sort(function (a, b) { return b.performance.duration - a.performance.duration; })
            .slice(0, count)
            .map(function (log) { return ({
            event: log.event,
            duration: log.performance.duration,
            timestamp: log.timestamp,
            context: log.context
        }); });
    };
    QISDDLogger.prototype.analyzePerformanceTrends = function (logs) {
        // Implementation for performance trend analysis
        return { trend: 'stable', analysis: 'Performance metrics within normal ranges' };
    };
    QISDDLogger.prototype.identifyBottlenecks = function (logs) {
        // Implementation for bottleneck identification
        return [];
    };
    QISDDLogger.prototype.generatePerformanceRecommendations = function (logs) {
        var recommendations = [];
        var slowOperations = logs.filter(function (log) {
            return log.performance && log.performance.duration > 1000;
        });
        if (slowOperations.length > logs.length * 0.1) {
            recommendations.push('Consider optimizing slow operations or implementing caching');
        }
        return recommendations;
    };
    QISDDLogger.prototype.convertToCSV = function (logEntries) {
        var headers = ['timestamp', 'level', 'category', 'event', 'message', 'userId', 'component'];
        var rows = logEntries.map(function (entry) {
            var _a, _b;
            return [
                entry.timestamp.toISOString(),
                LogLevel[entry.level],
                entry.category,
                entry.event,
                entry.message.replace(/"/g, '""'), // Escape quotes
                ((_a = entry.context) === null || _a === void 0 ? void 0 : _a.userId) || '',
                ((_b = entry.context) === null || _b === void 0 ? void 0 : _b.component) || ''
            ];
        });
        return __spreadArray([headers], rows, true).map(function (row) { return row.map(function (cell) { return "\"".concat(cell, "\""); }).join(','); }).join('\n');
    };
    return QISDDLogger;
}(events_1.EventEmitter));
exports.QISDDLogger = QISDDLogger;
// Factory for creating pre-configured loggers
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory() {
    }
    LoggerFactory.createQuantumLogger = function (config) {
        return new QISDDLogger(__assign({ level: LogLevel.DEBUG, enableCorrelation: true, enableMetrics: true }, config));
    };
    LoggerFactory.createProductionLogger = function (config) {
        return new QISDDLogger(__assign({ level: LogLevel.INFO, enableConsole: false, enableFile: true, enableStructured: true }, config));
    };
    LoggerFactory.createSecurityLogger = function (config) {
        return new QISDDLogger(__assign({ level: LogLevel.WARN, sensitiveDataMasking: true, encryptionEnabled: true, retentionDays: 365 }, config));
    };
    return LoggerFactory;
}());
exports.LoggerFactory = LoggerFactory;
// Global logger instance
exports.globalLogger = new QISDDLogger();
// Export singleton for backward compatibility
exports.default = exports.globalLogger;
