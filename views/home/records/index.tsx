import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text, FlatList, Pressable } from '../../../components/elements';
import Card from './card';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTable, useCell, useRow } from 'tinybase/ui-react';
import { tables } from '../../../database/schema';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function Records(props): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const records = useTable(tables.maintenance_records);

  const carName = useCell(tables.cars, props.route.params.car_id, 'nickname') as string;

  useEffect(() => {
    navigation.setOptions({ title: carName });
  }, [carName]);


  const allRecords = useTable(tables.maintenance_records);
  const recordsForExport = Object.keys(allRecords).filter((key) => allRecords[key].car_id === props.route.params.car_id).map(
    (key) => {
      // remove car_id as it is specific useless in an export
      // remove uuid as it is specific to online backup
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { car_id, uuid, ...record } = allRecords[key];
      return record;
    },
  );
  const row = useRow(tables.cars, props.route.params.car_id) as Record<string, string>;

  const exportRecord = () => {
    // remove uuid as it is specific to online backup
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uuid, ...rowToExport } = row;
    const final = JSON.stringify({
      ...rowToExport,
      records: recordsForExport,
    }, null, 4);

    const asyncFunc = async () => {
      if (await Sharing.isAvailableAsync()) {
        const fileLocation = `${FileSystem.cacheDirectory}export.json`;
        await FileSystem.writeAsStringAsync(fileLocation, final, { encoding: FileSystem.EncodingType.UTF8 });
        Sharing.shareAsync(fileLocation, { dialogTitle: 'Download File', mimeType: 'application/json' });
      } else {
        await Clipboard.setStringAsync(final);
        Alert.alert('Exported', 'Data copied to clipboard. Please save to a file');
      }
    };
    asyncFunc();
  };

  return (
    <View style={ pageStyles.container }>
      <FlatList
        data={ Object.keys(records).filter((key) => records[key].car_id === props.route.params.car_id).map((key) => {
          return { ...records[key], id: key };
        }) }
        renderItem={({ item }) => <Card key={ (item as { id: string }).id } record={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>No records</Text>
        }
      />
      <View style={ pageStyles.actionButtonSection }>
        <Pressable onPress={() => {
          navigation.navigate('EditRecord', { id: undefined, car_id: props.route.params.car_id });
        }} style={ pageStyles.actionButton }>
          <Text style={ pageStyles.actionButtonText }>Add Maintenance</Text>
        </Pressable>
        <Pressable onPress={ exportRecord } style={[ pageStyles.actionButton ]}>
          <Text style={ pageStyles.actionButtonText }>Export Vehicle</Text>
        </Pressable>
        <Pressable onPress={() => {
          navigation.navigate('EditCar', { id: props.route.params.car_id });
        }} style={ pageStyles.actionButton }>
          <Text style={ pageStyles.actionButtonText }>Edit Vehicle</Text>
        </Pressable>
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
    fontSize: 24,
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
    fontSize: 24,
    paddingLeft: 10,
  },
});
