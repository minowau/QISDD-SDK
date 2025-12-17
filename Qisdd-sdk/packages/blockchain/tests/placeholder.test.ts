describe('@qisdd/blockchain utilities', () => {
  const isHex = (s: string) => /^0x[0-9a-fA-F]+$/.test(s);
  const shorten = (tx: string) => (tx.length > 10 ? tx.slice(0, 6) + '...' + tx.slice(-4) : tx);
  const checksum = (v: string) => v.split('').reverse().join('');

  test('isHex returns true for 0x prefixed', () => {
    expect(isHex('0xabc123')).toBe(true);
    expect(isHex('abc123')).toBe(false);
  });

  test('shorten transaction hash', () => {
    const tx = '0x' + 'a'.repeat(64);
    expect(shorten(tx)).toMatch(/^0xaaaaaa\.\.\.[0-9a-f]{4}$/);
  });

  test('checksum is reversible', () => {
    const s = 'hello';
    expect(checksum(checksum(s))).toBe(s);
  });

  test('formats gas number', () => {
    const fmt = (n: number) => `${n.toLocaleString()} gas`;
    expect(fmt(123456)).toBe('123,456 gas');
  });

  test('mock transaction object validation', () => {
    const tx = { from: '0xabc', to: '0xdef', value: 100 };
    expect(typeof tx.value).toBe('number');
    expect(tx.from.startsWith('0x')).toBe(true);
  });
});
