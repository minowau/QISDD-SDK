describe('@qisdd/fintech utilities', () => {
  const maskAccount = (acct: string) => acct.replace(/.(?=.{4})/g, '*');
  const calcFee = (amount: number, pct = 0.025) => Math.round(amount * pct * 100) / 100;
  const isValidAmount = (a: any) => typeof a === 'number' && a >= 0;

  test('maskAccount hides all but last 4 chars', () => {
    expect(maskAccount('1234567890')).toBe('******7890');
  });

  test('calcFee default percentage', () => {
    expect(calcFee(100)).toBe(2.5);
    expect(calcFee(12345, 0.01)).toBe(123.45);
  });

  test('isValidAmount validation', () => {
    expect(isValidAmount(0)).toBe(true);
    expect(isValidAmount(-1)).toBe(false);
    expect(isValidAmount('10')).toBe(false);
  });

  test('mock payment processor flow', async () => {
    class MockProcessor { async charge(amount: number) { return { success: true, amount }; } }
    const p = new MockProcessor();
    const r = await p.charge(50);
    expect(r.success).toBe(true);
    expect(r.amount).toBe(50);
  });

  test('fee + mask combined', () => {
    const acct = '9876543210';
    expect(maskAccount(acct)).toMatch(/\*{6}3210/);
    expect(calcFee(1000)).toBeGreaterThan(0);
  });
});
