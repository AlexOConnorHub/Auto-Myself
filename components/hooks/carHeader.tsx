import { tables } from '@app/database/schema';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useRow } from 'tinybase/ui-react';

export default function CarNicknameInHeader() {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id?: string }>();
  const navigation = useNavigation();
  const row = useRow(tables.vehicles, vehicle_id ?? '');

  useEffect(() => {
    if (vehicle_id) {
      let nickname;
      if (row.nickname) {
        nickname = row.nickname;
      } else if (row.color || row.year || row.make || row.model) {
        nickname = [row.color, row.year, row.make, row.model].filter(Boolean).join(' ');
      } else {
        nickname = 'Vehicle';
      }
      navigation.setOptions({ title: nickname });
    }
  }, [vehicle_id, row?.nickname]);

  return <></>;
};
