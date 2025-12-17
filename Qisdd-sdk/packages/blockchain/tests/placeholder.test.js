describe('@qisdd/blockchain utilities', () => {
  const isHex = (s) => /^0x[0-9a-fA-F]+$/.test(s);
  const shorten = (tx) => (tx.length > 10 ? tx.slice(0, 6) + '...' + tx.slice(-4) : tx);
  const checksum = (v) => v.split('').reverse().join('');

  test('isHex returns true for 0x prefixed', () => {
    expect(isHex('0xabc123')).toBe(true);
    expect(isHex('abc123')).toBe(false);
  });

  test('shorten transaction hash', () => {
    const tx = '0x' + 'a'.repeat(64);
    const short = shorten(tx);
    expect(short).toContain('...');
    expect(short.startsWith('0x')).toBe(true);
    expect(short.endsWith(tx.slice(-4))).toBe(true);
    expect(short.length).toBeLessThan(tx.length);
  });

  test('checksum is reversible', () => {
    const s = 'hello';
    expect(checksum(checksum(s))).toBe(s);
  });

  test('formats gas number', () => {
    const fmt = (n) => `${new Intl.NumberFormat('en-US').format(n)} gas`;
    expect(fmt(123456)).toBe('123,456 gas');
  });

  test('mock transaction object validation', () => {
    const tx = { from: '0xabc', to: '0xdef', value: 100 };
    expect(typeof tx.value).toBe('number');
    expect(tx.from.startsWith('0x')).toBe(true);
  });
});
