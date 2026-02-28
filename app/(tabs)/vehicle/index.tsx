import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList, TextInput, Dropdown } from '@app/components/elements';
import { useCell, useSetCellCallback, useTable } from 'tinybase/ui-react';
import { router } from 'expo-router';
import VehicleCard from '@app/components/cards/vehicle';
import CallbackButton from '@app/components/elements/callbackButton';
import { tables } from '@app/database/schema';
import { useTheme } from '@react-navigation/native';

export default function Tab(): React.ReactElement {
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const sort = useCell(tables.settings, 'local', 'sort') as string;
  const setSort = useSetCellCallback(tables.settings, 'local', 'sort', (newValue: { value: string }) => newValue.value);

  const vehicles = useTable(tables.vehicles);
  const [vehiclesToList, setVehiclesToList] = useState<Record<string, string | number>[]>([]);

  useEffect(() => {
    let filteredVehicles = Object.keys(vehicles).map((key) => {
      return { ...vehicles[key], id: key } as Record<string, string>;
    });
    filteredVehicles = filteredVehicles.filter((vehicle) => {
      const searchLower = search.toLowerCase();
      const nickname = (vehicle).nickname.toLowerCase();
      const make = (vehicle).make.toLowerCase();
      const model = (vehicle).model.toLowerCase();
      const year = (vehicle).year.toString();
      const notes = (vehicle).notes.toLowerCase();
      return (
        nickname.includes(searchLower) ||
        make.includes(searchLower) ||
        model.includes(searchLower) ||
        year.includes(searchLower) ||
        notes.includes(searchLower)
      );
    });
    filteredVehicles.sort((a, b) => {
      if (sort === 'year-asc') {
        return a.year.localeCompare(b.year);
      } else if (sort === 'year-desc') {
        return b.year.localeCompare(a.year);
      } else if (sort === 'nickname') {
        return a.nickname.localeCompare(b.nickname);
      }
    });
    setVehiclesToList(filteredVehicles);
  }, [vehicles, search, sort]);

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
        data={ vehiclesToList }
        renderItem={ ({ item }) => <VehicleCard key={ (item as { id: string }).id } vehicle={ item } /> }
        ListEmptyComponent={ <Text style={ pageStyles.emptyText }>Add a vehicle to get started!</Text> }
      />
      <CallbackButton
        text={{ style: pageStyles.addVehicleText }}
        title="Add Vehicle"
        pressable={{ style: pageStyles.addVehicleButton }}
        onPress={(callback) => {
          router.push('/vehicle/add');
          callback();
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
  addVehicleButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  addVehicleText: {
    paddingLeft: 10,
  },
});
