import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Pressable, FlatList } from '../../../components/elements';
import Card from './card';
import { useTable } from 'tinybase/ui-react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Index(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const cars = useTable('cars');

  return (
    <View style={ pageStyles.container }>
      <FlatList
        data={ Object.keys(cars).map((key) => {
          return { ...cars[key], id: key };
        }) }
        renderItem={({ item }) => <Card key={ (item as { id: string }).id } car={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>Add a car to get started!</Text>
        }
      />
      <Pressable onPress={() => {
        navigation.navigate('EditCar', { id: undefined });
      }} style={ pageStyles.addCarButton }>
        <Text style={ pageStyles.addCarText }>Add Car</Text>
      </Pressable>
    </View>
  );
}

const pageStyles = StyleSheet.create({
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
