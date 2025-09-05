import { router } from 'expo-router';
import { View } from '../elements';
import ConditionalText from '../conditionalText';
import { StyleSheet } from 'react-native';
import Accordion from '../accordion';
import { OptionButtons } from '../optionButtons';
import { useStore } from 'tinybase/ui-react';
import { exportVehicle } from '@app/helpers/vehicleExport';

export function VehicleCard({ car }): React.ReactElement {
  const store = useStore();

  const firstRow = [car.color, car.year, car.make, car.model].filter(Boolean).join(' ');

  return (
    <Accordion title={car.nickname || firstRow}>
      <View style={pageStyles.cardRow}>
        <ConditionalText condition={car.nickname && firstRow}>{firstRow}</ConditionalText>
        <ConditionalText condition={car.license_plate}>LPN: {car.license_plate}</ConditionalText>
        <ConditionalText condition={car.vin}>VIN: {car.vin}</ConditionalText>
        <ConditionalText condition={car.notes}>{car.notes}</ConditionalText>
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
            { label: 'Export', key: 'export' },
            { label: 'Records', key: 'records' },
          ]}
          onSelect={(value) => {
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
