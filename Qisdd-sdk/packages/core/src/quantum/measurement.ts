// QISDD-SDK Quantum: Measurement (Collapse) Implementation

import { QuantumStateType } from "./observer-effect";
import { QuantumState, Superposition } from "./superposition";

export type MeasurementResult = {
  collapsed: boolean;
  collapsedState?: QuantumStateType;
  reason?: string;
};

export class Measurement {
  constructor() {
    // Initialize measurement logic
  }

  // Collapse all states in a superposition to a single collapsed state
  public collapse(
    superposition: Superposition,
    trigger: string,
  ): MeasurementResult {
    superposition.collapseAll();
    return {
      collapsed: true,
      collapsedState: QuantumStateType.Collapsed,
      reason: `Collapse triggered by ${trigger}`,
    };
  }

  // Read out the current active state (authorized access)
  public readState(superposition: Superposition): QuantumState | null {
    // Return the current active state if not collapsed
    const state = superposition.getActiveState();
    if (state && state.stateType !== QuantumStateType.Collapsed) {
      return state;
    }
    return null;
  }
}
