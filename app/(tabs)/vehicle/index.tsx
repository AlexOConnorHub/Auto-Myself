import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Pressable, FlatList } from '@app/components/elements';
import { useTable } from 'tinybase/ui-react';
import { router } from 'expo-router';
import { VehicleCard } from '@app/components/cardVehicle';

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
      <Pressable onPress={() => {
        router.push('/vehicle/add');
      }} style={ pageStyles.addCarButton }>
        <Text style={ pageStyles.addCarText }>Add Car</Text>
      </Pressable>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    width: '95%',
    alignSelf: 'center',
  },
  cardRow: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 18,
  },
  data: {
    fontSize: 16,
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  emptyText: {
    fontSize: 24,
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
    fontSize: 24,
    paddingLeft: 10,
  },
});
