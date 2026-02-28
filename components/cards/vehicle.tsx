import { router } from 'expo-router';
import { Text, View } from '@app/components/elements';
import ConditionalView from '@app/components/elements/conditionalView';
import { StyleSheet } from 'react-native';
import Accordion from '@app/components/elements/accordion';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { useStore } from 'tinybase/ui-react';
import { exportVehicle } from '@app/helpers/export';

export default function VehicleCard({ vehicle }): React.ReactElement {
  const store = useStore();

  const firstRow = [vehicle.color, vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');

  return (
    <Accordion title={vehicle.nickname || firstRow}>
      <View style={pageStyles.cardRow}>
        <ConditionalView condition={vehicle.nickname && firstRow}><Text>{firstRow}</Text></ConditionalView>
        <ConditionalView condition={vehicle.license_plate}><Text>LPN: {vehicle.license_plate}</Text></ConditionalView>
        <ConditionalView condition={vehicle.vin}><Text>VIN: {vehicle.vin}</Text></ConditionalView>
        <ConditionalView condition={vehicle.notes}><Text>{vehicle.notes}</Text></ConditionalView>
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
            { label: 'Export', key: 'export' },
            { label: 'Records', key: 'records' },
          ]}
          onSelect={(value, enable) => {
            switch (value) {
              case 'edit':
                router.push(`/vehicle/${vehicle.id}/edit`);
                break;
              case 'records':
                router.push(`/vehicle/${vehicle.id}`);
                break;
              case 'export':
                exportVehicle(store, vehicle.id, true, (vehicle.nickname || firstRow).replaceAll(/\s/g, '_'));
                break;
            }
            enable();
          }}
          highlightAll={true}
        />
      </View>
    </Accordion>
  );
}

const pageStyles = StyleSheet.create({
  cardRow: {
    marginHorizontal: 10,
  },
});
