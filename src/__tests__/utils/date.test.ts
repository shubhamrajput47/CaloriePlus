/**
 * Date utils tests
 */
import { getTodayKey, formatDisplayDate, getDateKey } from '@utils/date';

describe('date utils', () => {
  it('getTodayKey returns YYYY-MM-DD', () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('getDateKey formats date correctly', () => {
    const d = new Date(2025, 0, 15);
    expect(getDateKey(d)).toBe('2025-01-15');
  });

  it('formatDisplayDate formats string date', () => {
    const formatted = formatDisplayDate('2025-01-15');
    expect(formatted).toContain('2025');
    expect(formatted.length).toBeGreaterThan(5);
  });
});
