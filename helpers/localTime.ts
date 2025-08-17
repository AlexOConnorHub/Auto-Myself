export const provideLocalTime = (date: Date | string): Date => {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return date;
};

export const displayTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = provideLocalTime(date);
  }
  return date.toISOString().split('T')[0];
};
