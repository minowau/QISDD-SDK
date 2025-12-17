import { StateManager, StateRecord } from '../src/storage/state-manager';

describe('@qisdd/sdk core behavior', () => {
  test('StateManager starts empty', () => {
    const sm = new StateManager({});
    expect(sm.getStates('nope')).toEqual([]);
  });

  test('saveState and getStates', () => {
    const sm = new StateManager({});
    const r: StateRecord = { id: 's1', dataId: 'd1', stateIndex: 0, createdAt: new Date(), active: false };
    sm.saveState(r);
    const states = sm.getStates('d1');
    expect(states.length).toBe(1);
    expect(states[0].id).toBe('s1');
  });

  test('setActiveState toggles the correct index', () => {
    const sm = new StateManager({});
    sm.saveState({ id: 's1', dataId: 'd2', stateIndex: 0, createdAt: new Date(), active: false });
    sm.saveState({ id: 's2', dataId: 'd2', stateIndex: 1, createdAt: new Date(), active: false });
    sm.setActiveState('d2', 1);
    const s = sm.getStates('d2');
    expect(s[0].active).toBe(false);
    expect(s[1].active).toBe(true);
  });

  test('deleteState removes by id', () => {
    const sm = new StateManager({});
    sm.saveState({ id: 'del1', dataId: 'd3', stateIndex: 0, createdAt: new Date(), active: false });
    sm.deleteState('del1');
    expect(sm.getStates('d3')).toEqual([]);
  });

  test('multiple saves and active count', () => {
    const sm = new StateManager({});
    for (let i = 0; i < 5; i++) {
      sm.saveState({ id: `id${i}`, dataId: 'multi', stateIndex: i, createdAt: new Date(), active: false });
    }
    sm.setActiveState('multi', 3);
    const s = sm.getStates('multi');
    const activeCount = s.filter(x => x.active).length;
    expect(s.length).toBe(5);
    expect(activeCount).toBe(1);
    expect(s[3].active).toBe(true);
  });
});
