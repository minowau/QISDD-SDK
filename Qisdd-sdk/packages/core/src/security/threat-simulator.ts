/**
 * QISDD Threat Simulator - Demonstrates how quantum-inspired security blocks hackers
 */

export interface ThreatScenario {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  attackVector: string;
  expectedOutcome: 'blocked' | 'detected' | 'analyzed';
  techniques: string[];
}

export interface AttackResult {
  threatId: string;
  timestamp: Date;
  blocked: boolean;
  reason: string;
  quantumStateUsed: string;
  trustScore: number;
  responseTime: number;
  details: string;
}

export class ThreatSimulator {
  private threats: ThreatScenario[] = [
    {
      id: 'sql_injection',
      name: 'SQL Injection Attack',
      description: 'Hacker attempts to inject malicious SQL code to access database',
      severity: 'high',
      attackVector: 'Web Application',
      expectedOutcome: 'blocked',
      techniques: ['Union-based injection', 'Boolean-based blind', 'Time-based blind']
    },
    {
      id: 'ransomware',
      name: 'Ransomware Deployment',
      description: 'Malicious actor tries to encrypt critical files for ransom',
      severity: 'critical',
      attackVector: 'File System',
      expectedOutcome: 'blocked',
      techniques: ['File encryption', 'Registry modification', 'Network propagation']
    },
    {
      id: 'phishing',
      name: 'Credential Phishing',
      description: 'Social engineering attack to steal user credentials',
      severity: 'medium',
      attackVector: 'Email/Social',
      expectedOutcome: 'detected',
      techniques: ['Fake login pages', 'Email spoofing', 'Domain hijacking']
    },
    {
      id: 'ddos',
      name: 'DDoS Attack',
      description: 'Distributed denial of service to overwhelm system resources',
      severity: 'high',
      attackVector: 'Network',
      expectedOutcome: 'blocked',
      techniques: ['UDP flood', 'SYN flood', 'HTTP flood']
    },
    {
      id: 'zero_day',
      name: 'Zero-Day Exploit',
      description: 'Unknown vulnerability exploitation attempt',
      severity: 'critical',
      attackVector: 'System Vulnerability',
      expectedOutcome: 'analyzed',
      techniques: ['Buffer overflow', 'Memory corruption', 'Privilege escalation']
    },
    {
      id: 'insider_threat',
      name: 'Insider Data Theft',
      description: 'Authorized user attempting unauthorized data access',
      severity: 'high',
      attackVector: 'Internal Access',
      expectedOutcome: 'detected',
      techniques: ['Privilege abuse', 'Data exfiltration', 'Access pattern anomaly']
    }
  ];

  /**
   * Simulate a random hacker attack and show how QISDD blocks it
   */
  public simulateAttack(): AttackResult {
    const threat = this.threats[Math.floor(Math.random() * this.threats.length)];
    const startTime = Date.now();
    
    // Simulate quantum-inspired defense mechanism
    const quantumStates = ['superposition', 'entanglement', 'coherence'];
    const quantumState = quantumStates[Math.floor(Math.random() * quantumStates.length)];
    
    // Calculate trust score based on threat severity
    const baseTrustScore = this.calculateTrustScore(threat.severity);
    const trustScore = baseTrustScore + (Math.random() * 20 - 10); // Add some variance
    
    // Determine if attack is blocked (QISDD has 95%+ success rate)
    const blocked = Math.random() > 0.05; // 95% success rate
    const responseTime = Date.now() - startTime + Math.random() * 50; // Realistic response time
    
    const result: AttackResult = {
      threatId: threat.id,
      timestamp: new Date(),
      blocked,
      reason: this.generateBlockingReason(threat, quantumState, blocked),
      quantumStateUsed: quantumState,
      trustScore: Math.max(0, Math.min(100, trustScore)),
      responseTime,
      details: this.generateDetailedExplanation(threat, blocked, quantumState)
    };

    return result;
  }

  /**
   * Simulate multiple coordinated attacks (APT scenario)
   */
  public simulateAdvancedPersistentThreat(): AttackResult[] {
    const aptAttacks = [
      this.threats.find(t => t.id === 'phishing')!,
      this.threats.find(t => t.id === 'zero_day')!,
      this.threats.find(t => t.id === 'insider_threat')!,
    ];

    return aptAttacks.map(threat => {
      const quantumState = 'entanglement'; // APT requires coordinated defense
      const blocked = Math.random() > 0.02; // 98% success rate for APT
      
      return {
        threatId: threat.id,
        timestamp: new Date(),
        blocked,
        reason: `APT Stage Detected - ${threat.name} blocked via quantum ${quantumState}`,
        quantumStateUsed: quantumState,
        trustScore: Math.random() * 30 + 20, // APT has low trust scores
        responseTime: Math.random() * 100 + 150, // APT takes longer to analyze
        details: `Advanced Persistent Threat detected. ${threat.description} neutralized using quantum-inspired correlation analysis.`
      };
    });
  }

  private calculateTrustScore(severity: string): number {
    switch (severity) {
      case 'critical': return Math.random() * 20 + 10; // 10-30
      case 'high': return Math.random() * 30 + 20; // 20-50
      case 'medium': return Math.random() * 40 + 40; // 40-80
      case 'low': return Math.random() * 20 + 70; // 70-90
      default: return 50;
    }
  }

  private generateBlockingReason(threat: ThreatScenario, quantumState: string, blocked: boolean): string {
    if (!blocked) {
      return `Attack partially detected - analyzing with quantum ${quantumState}`;
    }

    const reasons = [
      `Quantum ${quantumState} detected anomalous pattern in ${threat.attackVector}`,
      `${threat.name} signature identified and blocked via ${quantumState} correlation`,
      `Threat blocked: ${quantumState}-based analysis flagged malicious behavior`,
      `QISDD quantum defense: ${quantumState} state prevented ${threat.attackVector} compromise`
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private generateDetailedExplanation(threat: ThreatScenario, blocked: boolean, quantumState: string): string {
    const action = blocked ? 'blocked' : 'detected';
    return `QISDD successfully ${action} ${threat.name}. Using quantum-inspired ${quantumState}, the system identified ${threat.techniques.join(', ')} patterns and prevented potential damage. Trust analysis complete.`;
  }

  /**
   * Get threat by ID for specific simulations
   */
  public getThreatById(id: string): ThreatScenario | undefined {
    return this.threats.find(t => t.id === id);
  }

  /**
   * Get all available threats for demo purposes
   */
  public getAllThreats(): ThreatScenario[] {
    return [...this.threats];
  }
}
