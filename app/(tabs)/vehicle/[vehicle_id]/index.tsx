import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList, Ionicons } from '@app/components/elements';
import RecordCard from '@app/components/cards/record';
import { router, useLocalSearchParams } from 'expo-router';
import { useSliceRowIds } from 'tinybase/ui-react';
import VehicleNicknameInHeader from '@app/components/hooks/vehicleHeader';
import { OptionButtons } from '@app/components/elements/optionButtons';

export default function Records(): React.ReactElement {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();

  const recordIDs = useSliceRowIds('byVehicle', vehicle_id);
  return (
    <View style={ pageStyles.container }>
      <VehicleNicknameInHeader />
      <FlatList
        data={ recordIDs }
        renderItem={({ item }) => <RecordCard key={ item } record_id={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>No records</Text>
        }
      />
      <OptionButtons
        options={[
          { label: 'Add Maintenance', key: 'add', icon: <Ionicons name="add-circle" size={20} /> },
        ]}
        onSelect={ (value, enable) => {
          router.push(`/vehicle/${vehicle_id}/record/add`);
          enable();
        }}
        highlightAll={true}
      />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  emptyText: {
    alignSelf: 'center',
  },
  actionButtonSection: {
    marginVertical: 8,
  },
  actionButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 3,
    width: '95%',
  },
  actionButtonText: {
    paddingLeft: 10,
  },
});
