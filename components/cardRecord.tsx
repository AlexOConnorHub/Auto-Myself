import React from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from '@app/components/elements';
import { ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRow } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import ConditionalText from '@app/components/conditionalText';

export default function RecordCard(props): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const row = useRow(tables.maintenance_records, props.record.id) as Record<string, string | number>;

  const onPress = () => {
    navigation.navigate('EditRecord', { id: props.record.id, car_id: row.car_id });
  };

  return (
    <Pressable style={ pageStyles.container } onPress={ onPress.bind(this) }>
      <ConditionalText condition={ row.type }style={ pageStyles.headerText }>{ row.type }</ConditionalText>
      <ConditionalText condition={ row.date }style={ pageStyles.subText }>{ row.date }</ConditionalText>
      <ConditionalText condition={ row.odometer }style={ pageStyles.subText }>Odometer: { row.odometer }</ConditionalText>
    </Pressable>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    width: '95%',
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 24,
  },
  subText: {
    fontSize: 18,
  },
  mainText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
