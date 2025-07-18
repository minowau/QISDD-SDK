// QISDD-SDK Quantum: Entanglement Implementation

import { QuantumStateType } from "./observer-effect";

export type EntanglementLink = {
  targetId: string;
  strength: number; // 0.0 to 1.0
  type: "symmetric" | "asymmetric";
  createdAt: Date;
};

export class Entanglement {
  private links: EntanglementLink[] = [];

  constructor(initialLinks: EntanglementLink[] = []) {
    this.links = initialLinks;
  }

  // Add a new entanglement link
  public addLink(link: EntanglementLink): void {
    this.links.push(link);
  }

  // Get all entanglement links
  public getLinks(): EntanglementLink[] {
    return this.links;
  }

  // Propagate a state change to all entangled data
  public propagateStateChange(
    state: QuantumStateType,
    propagateFn: (
      targetId: string,
      state: QuantumStateType,
      strength: number,
    ) => void,
  ): void {
    for (const link of this.links) {
      // For symmetric, propagate both ways; for asymmetric, only one way
      propagateFn(link.targetId, state, link.strength);
    }
  }

  // Update entanglement strength
  public updateStrength(targetId: string, newStrength: number): void {
    const link = this.links.find((l) => l.targetId === targetId);
    if (link) {
      link.strength = newStrength;
    }
  }

  // Remove a link (e.g., on data erasure)
  public removeLink(targetId: string): void {
    this.links = this.links.filter((link) => link.targetId !== targetId);
  }
}
