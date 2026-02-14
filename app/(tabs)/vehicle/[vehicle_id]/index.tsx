import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList } from '@app/components/elements';
import RecordCard from '@app/components/cards/record';
import { router, useLocalSearchParams } from 'expo-router';
import { useSliceRowIds } from 'tinybase/ui-react';
import CarNicknameInHeader from '@app/components/hooks/carHeader';
import CallbackButton from '@app/components/elements/callbackButton';

export default function Records(): React.ReactElement {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();

  const recordIDs = useSliceRowIds('byVehicle', vehicle_id);
  return (
    <View style={ pageStyles.container }>
      <CarNicknameInHeader />
      <FlatList
        data={ recordIDs }
        renderItem={({ item }) => <RecordCard key={ item } record_id={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>No records</Text>
        }
      />
      <View style={ pageStyles.actionButtonSection }>
        <CallbackButton
          pressable={{ style: pageStyles.actionButton }}
          text={{ style: pageStyles.actionButtonText }}
          title="Add Maintenance"
          onPress={(callback) => {
            router.push(`/vehicle/${vehicle_id}/record/add`);
            callback();
          }}
        />
      </View>
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
