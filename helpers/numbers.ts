export const formatNumberForSave = (input: string, fixed: number): number => {
  const numericString = input.toString().replaceAll(/[^0-9.]/g, '');
  const parsedNumber = Number.parseFloat(numericString);
  return Number.parseFloat(parsedNumber.toFixed(fixed));
};

export const costFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
export const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
export const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
