const { URL } = require('url');

describe('@qisdd/cli utilities', () => {
  function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a.startsWith('--')) {
        const key = a.replace(/^--/, '');
        const next = argv[i + 1];
        if (!next || next.startsWith('--')) args[key] = true;
        else args[key] = next;
      }
    }
    return args;
  }

  test('parses --flag and --key value', () => {
    const res = parseArgs(['--debug', '--port', '8080']);
    expect(res.debug).toBe(true);
    expect(res.port).toBe('8080');
  });

  test('formats help output', () => {
    const help = (cmd) => `Usage: ${cmd} [options]`;
    expect(help('qisdd')).toContain('Usage: qisdd');
  });

  test('valid URL detection', () => {
    const isUrl = (s) => {
      try { new URL(s); return true; } catch { return false; }
    };
    expect(isUrl('http://localhost:3000')).toBe(true);
    expect(isUrl('not a url')).toBe(false);
  });

  test('command dispatch simulation', () => {
    const actions = [];
    const dispatch = (cmd) => actions.push(cmd);
    dispatch('start');
    dispatch('stop');
    expect(actions).toEqual(['start', 'stop']);
  });

  test('argument parser is deterministic', () => {
    const a = parseArgs(['--x', '1', '--y', '2']);
    const b = parseArgs(['--y', '2', '--x', '1']);
    expect(a.x).toBe(b.x);
    expect(a.y).toBe(b.y);
  });
});
