import { tables } from '@app/database/schema';
import { useCell } from 'tinybase/ui-react';

export function useDistanceUnit() {
  return useCell(tables.settings, 'local', 'distanceUnit');
};
