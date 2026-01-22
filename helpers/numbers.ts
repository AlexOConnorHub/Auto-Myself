export const costFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatNumberForSave = (input: string, fixed: number): number => {
  const numericString = input.toString().replaceAll(/[^0-9.]/g, '');
  const parsedNumber = Number.parseFloat(numericString);
  return Number.parseFloat(parsedNumber.toFixed(fixed));
};

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    if (date.length === 0) {
      return '';
    }
    date = provideDateObj(date);
  }

  return dateFormatter.format(date);
};

export const getDateString = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const provideDateObj = (date: Date | string): Date => {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    const tmpDate = new Date();
    const final = (year && month && day) ? new Date(year, month - 1, day) : new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
    return final;
  }
  return date;
};
