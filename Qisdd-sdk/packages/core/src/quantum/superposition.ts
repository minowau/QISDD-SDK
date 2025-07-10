// QISDD-SDK Quantum: Superposition Implementation

import { QuantumStateType } from './observer-effect';

export type QuantumState = {
  index: number;
  ciphertext: Buffer;
  createdAt: Date;
  active: boolean;
  stateType: QuantumStateType;
};

export class Superposition {
  private states: QuantumState[] = [];
  private activeState: number = 0;

  constructor(initialStates: QuantumState[]) {
    this.states = initialStates;
    this.activeState = 0;
    if (this.states.length > 0) {
      this.states[0].active = true;
    }
  }

  // Rotate to the next state (for pattern prevention)
  public rotateState(): QuantumState {
    this.activeState = (this.activeState + 1) % this.states.length;
    this.setActiveState(this.activeState);
    return this.states[this.activeState];
  }

  // Set a specific state as active (context-aware selection)
  public setActiveState(index: number): void {
    this.states.forEach((s, i) => (s.active = i === index));
    this.activeState = index;
  }

  // Context-aware state selection (e.g., based on trust score, environment)
  public selectStateByContext(context: any): QuantumState {
    // Example: select state based on context.trustScore
    if (context && typeof context.trustScore === 'number') {
      const idx = Math.floor(context.trustScore * this.states.length) % this.states.length;
      this.setActiveState(idx);
    }
    return this.states[this.activeState];
  }

  // Collapse all states to a single collapsed state
  public collapseAll(): void {
    this.states.forEach(s => {
      s.stateType = QuantumStateType.Collapsed;
      s.active = false;
    });
    this.activeState = -1;
  }

  // Get the current active state
  public getActiveState(): QuantumState | null {
    if (this.activeState >= 0 && this.activeState < this.states.length) {
      return this.states[this.activeState];
    }
    return null;
  }

  // Add a new quantum state
  public addState(state: QuantumState): void {
    this.states.push(state);
  }

  // Get all states (for entanglement, auditing, etc.)
  public getAllStates(): QuantumState[] {
    return this.states;
  }
} 