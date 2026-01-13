import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList, TextInput, Dropdown } from '@app/components/elements';
import { useCell, useSetCellCallback, useTable } from 'tinybase/ui-react';
import { router } from 'expo-router';
import { VehicleCard } from '@app/components/cards/vehicle';
import CallbackButton from '@app/components/callbackButton';
import { tables } from '@app/database/schema';
import { useTheme } from '@react-navigation/native';

export default function Tab(): React.ReactElement {
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const sort = useCell(tables.settings, 'local', 'sort') as string;
  const setSort = useSetCellCallback(tables.settings, 'local', 'sort', (newValue: { value: string }) => newValue.value);

  const cars = useTable('cars');
  const [carsToList, setCarsToList] = useState<Record<string, string | number>[]>([]);

  useEffect(() => {
    let filteredCars = Object.keys(cars).map((key) => {
      return { ...cars[key], id: key } as Record<string, string>;
    });
    filteredCars = filteredCars.filter((car) => {
      const searchLower = search.toLowerCase();
      const nickname = (car).nickname.toLowerCase();
      const make = (car).make.toLowerCase();
      const model = (car).model.toLowerCase();
      const year = (car).year.toString();
      const notes = (car).notes.toLowerCase();
      return (
        nickname.includes(searchLower) ||
        make.includes(searchLower) ||
        model.includes(searchLower) ||
        year.includes(searchLower) ||
        notes.includes(searchLower)
      );
    });
    filteredCars.sort((a, b) => {
      if (sort === 'year-asc') {
        return a.year.localeCompare(b.year);
      } else if (sort === 'year-desc') {
        return b.year.localeCompare(a.year);
      } else if (sort === 'nickname') {
        return a.nickname.localeCompare(b.nickname);
      }
    });
    setCarsToList(filteredCars);
  }, [cars, search, sort]);

  return (
    <View style={ pageStyles.container }>
      <View style={{ backgroundColor: theme.colors.primary }} >
        {/* @ts-expect-error Defaults for dropdown set in abstraction, results in incomplete props here */}
        <Dropdown
          value={ sort }
          onChange={ setSort }
          search={ false }
          data={ [
            { label: 'Sort by Year Ascending', value: 'year-asc' },
            { label: 'Sort by Year Descending', value: 'year-desc' },
            { label: 'Sort by Nickname', value: 'nickname' },
          ] }
          style={ pageStyles.dropdown }
          selectedTextStyle={ pageStyles.dropdownInput }
          placeholderStyle={ pageStyles.dropdownInput }
        />
      </View>
      <TextInput value={ search } onChangeText={ setSearch } placeholder="Search" style={ pageStyles.searchText } />
      <FlatList
        data={ carsToList }
        renderItem={ ({ item }) => <VehicleCard key={ (item as { id: string }).id } car={ item } /> }
        ListEmptyComponent={ <Text style={ pageStyles.emptyText }>Add a car to get started!</Text> }
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
  dropdown: {
    marginTop: 5,
  },
  dropdownInput: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchText: {
    marginVertical: 5,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
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
