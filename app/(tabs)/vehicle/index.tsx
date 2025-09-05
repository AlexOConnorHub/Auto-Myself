import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList } from '@app/components/elements';
import { useTable } from 'tinybase/ui-react';
import { router } from 'expo-router';
import { VehicleCard } from '@app/components/cards/vehicle';
import CallbackButton from '@app/components/callbackButton';

export default function Tab(): React.ReactElement {
  const cars = useTable('cars');

  return (
    <View style={ pageStyles.container }>
      <FlatList
        data={ Object.keys(cars).map((key) => {
          return { ...cars[key], id: key };
        }) }
        renderItem={({ item }) => <VehicleCard key={ (item as { id: string }).id } car={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>Add a car to get started!</Text>
        }
      />
      <CallbackButton
        text={{ style: pageStyles.addCarText }}
        title="Add Car"
        pressable={{ style: pageStyles.addCarButton }}
        onPress={() => {
          router.push('/vehicle/add');
        }}
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
  addCarButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  addCarText: {
    paddingLeft: 10,
  },
});
