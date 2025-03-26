import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Pressable } from '../../../components/elements';
import ConditionalText from '../../../components/conditionalText';
import { convertIntervalForDisplay } from '../../../helpers/functions';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { tables } from '../../../database/schema';
import { useCell } from 'tinybase/ui-react';

export default function Card({ car }): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const onPress = () => {
    navigation.navigate('Records', { car_id: car.id });
  };
  return (
    <Pressable onPress={() => onPress() } style={ pageStyles.pressable }>
      <Text style={ [pageStyles.title, pageStyles.cardRow, ] }>
        { car.nickname } { (car.year) ? `(${car.year})` : '' }
      </Text>
      <ConditionalText condition={ car.make || car.model } style={ [pageStyles.title, pageStyles.cardRow, ] }>
        { `${car.make} ${car.model}`.trim() }
      </ConditionalText>
      <ConditionalText condition={ car.vin } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        VIN: { car.vin }
      </ConditionalText>
      <ConditionalText condition={ car.lpn } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        License Plate: { car.lpn }
      </ConditionalText>
      <ConditionalText condition={ car.annualUsage } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        Estimated Annual Usage: { convertIntervalForDisplay(car.annualUsage, 'dist', distanceUnit as 'Miles' | 'Kilometers') } { distanceUnit }
      </ConditionalText>
    </Pressable>
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
});
