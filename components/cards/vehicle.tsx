import { router } from 'expo-router';
import { Text, View } from '@app/components/elements';
import ConditionalView from '@app/components/elements/conditionalView';
import { StyleSheet } from 'react-native';
import Accordion from '@app/components/elements/accordion';
import { OptionButtons } from '../elements/optionButtons';
import { useStore } from 'tinybase/ui-react';
import { exportVehicle } from '@app/helpers/vehicleExport';

export function VehicleCard({ car }): React.ReactElement {
  const store = useStore();

  const firstRow = [car.color, car.year, car.make, car.model].filter(Boolean).join(' ');

  return (
    <Accordion title={car.nickname || firstRow}>
      <View style={pageStyles.cardRow}>
        <ConditionalView condition={car.nickname && firstRow}><Text>{firstRow}</Text></ConditionalView>
        <ConditionalView condition={car.license_plate}><Text>LPN: {car.license_plate}</Text></ConditionalView>
        <ConditionalView condition={car.vin}><Text>VIN: {car.vin}</Text></ConditionalView>
        <ConditionalView condition={car.notes}><Text>{car.notes}</Text></ConditionalView>
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
            { label: 'Export', key: 'export' },
            { label: 'Records', key: 'records' },
          ]}
          onSelect={(value, enable) => {
            switch (value) {
              case 'edit':
                router.push(`/vehicle/${car.id}/edit`);
                break;
              case 'records':
                router.push(`/vehicle/${car.id}`);
                break;
              case 'export':
                exportVehicle(store, car.id);
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
