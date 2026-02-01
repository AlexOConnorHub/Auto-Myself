import { provideDateObj, getDateString, formatDate, formatNumberForSave, costFormatter, numberFormatter } from './numbers';

describe('numbers helpers', () => {
  test('costFormatter', () => {
    expect(costFormatter.format(1234.5)).toBe('$1,234.50');
    expect(costFormatter.format(1000000)).toBe('$1,000,000.00');
    expect(costFormatter.format(0.99)).toBe('$0.99');
  });

  test('numberFormatter', () => {
    expect(numberFormatter.format(1234.56)).toBe('1,235');
    expect(numberFormatter.format(1000000)).toBe('1,000,000');
    expect(numberFormatter.format(9876543.21)).toBe('9,876,543');
  });

  test('formatNumberForSave', () => {
    expect(formatNumberForSave('1234.5678', 2)).toBe(1234.57);
    expect(formatNumberForSave('$1,234.56', 2)).toBe(1234.56);
    expect(formatNumberForSave('12abc34.5def6', 1)).toBe(1234.6);
    expect(formatNumberForSave('invalid', 2)).toBeNaN();
  });

  test('formatDate', () => {
    expect(formatDate('')).toBe('');

    const dateString = '2023-10-05';
    expect(formatDate(dateString)).toBe('Oct 5, 2023');

    expect(formatDate(new Date(2023, 9, 5))).toBe('Oct 5, 2023');
  });

  test('getDateString', () => {
    const dateObj = new Date(2023, 9, 5); // Months are zero-indexed
    const formatted = getDateString(dateObj);
    expect(formatted).toBe('2023-10-05');
  });

  test('provideDateObj', () => {
    const dateObj = provideDateObj('2023-10-05');
    expect(dateObj).toBeInstanceOf(Date);
    expect(dateObj.getFullYear()).toBe(2023);
    expect(dateObj.getMonth()).toBe(9); // Months are zero-indexed
    expect(dateObj.getDate()).toBe(5);

    const result = provideDateObj(dateObj);
    expect(result).toBe(dateObj);

    jest.spyOn(Date, 'now').mockImplementation(() => Date.now());
    const today = new Date();
    const providedToday = provideDateObj('');
    expect(providedToday.getFullYear()).toBe(today.getFullYear());
    expect(providedToday.getMonth()).toBe(today.getMonth());
    expect(providedToday.getDate()).toBe(today.getDate());
    jest.restoreAllMocks();
  });
});
