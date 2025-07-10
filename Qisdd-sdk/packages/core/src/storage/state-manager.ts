// QISDD-SDK Storage: State Manager

export type StateRecord = {
  id: string;
  dataId: string;
  stateIndex: number;
  createdAt: Date;
  active: boolean;
};

export class StateManager {
  private stateMap: Map<string, StateRecord[]> = new Map();

  constructor(config: any) {
    // Initialize state manager config, DB connection, etc.
  }

  // Save a new state record
  public saveState(record: StateRecord): void {
    const states = this.stateMap.get(record.dataId) || [];
    states.push(record);
    this.stateMap.set(record.dataId, states);
  }

  // Get all states for a dataId
  public getStates(dataId: string): StateRecord[] {
    return this.stateMap.get(dataId) || [];
  }

  // Set a state as active
  public setActiveState(dataId: string, stateIndex: number): void {
    const states = this.stateMap.get(dataId) || [];
    states.forEach((s, i) => (s.active = i === stateIndex));
    this.stateMap.set(dataId, states);
  }

  // Delete a state record
  public deleteState(stateId: string): void {
    for (const [dataId, states] of this.stateMap.entries()) {
      const filtered = states.filter(s => s.id !== stateId);
      this.stateMap.set(dataId, filtered);
    }
  }
} 