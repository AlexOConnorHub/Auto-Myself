function convertIntervalForStorage(interval, intervalUnit, displayUnits) {
  if (interval === undefined || interval === null || interval === '') {
    return '';
  }
  interval = Number(interval.replace(/\D/g, ''));
  if (intervalUnit === 'dist' && displayUnits === 'Kilometers') {
    interval *= 1.60934;
  }
  interval = interval.toFixed(0);
  return interval;
}

function convertIntervalForDisplay(interval, intervalUnit, displayUnits) {
  if (interval === undefined || interval === null || interval === '') {
    return '';
  }
  interval = Number(interval.replace(/\D/g, ''));
  if (intervalUnit === 'dist' && displayUnits === 'Kilometers') {
    interval /= 1.60934;
  }
  interval = interval.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return interval;
}

export { convertIntervalForStorage, convertIntervalForDisplay };
