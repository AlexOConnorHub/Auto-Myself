import { provideLocalTime, displayTime } from './localTime';

describe('localTime helpers', () =>
{

  test('provideLocalTime converts string to Date correctly', () =>
  {
    const dateString = '2023-10-05';
    const dateObj = provideLocalTime(dateString);
    expect(dateObj).toBeInstanceOf(Date);
    expect(dateObj.getFullYear()).toBe(2023);
    expect(dateObj.getMonth()).toBe(9); // Months are zero-indexed
    expect(dateObj.getDate()).toBe(5);
  });

  test('provideLocalTime returns Date unchanged', () =>
  {
    const dateObj = new Date(2023, 9, 5);
    const result = provideLocalTime(dateObj);
    expect(result).toBe(dateObj);
  });

  test('displayTime formats Date object correctly', () =>
  {
    const dateObj = new Date(2023, 9, 5);
    const formatted = displayTime(dateObj);
    expect(formatted).toBe('2023-10-05');
  });

  test('displayTime formats string date correctly', () =>
  {
    const dateString = '2023-10-05';
    const formatted = displayTime(dateString);
    expect(formatted).toBe('2023-10-05');
  });
});

