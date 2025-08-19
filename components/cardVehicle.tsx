import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import { Pressable, Text } from './elements';
import ConditionalText from './conditionalText';
import { StyleSheet } from 'react-native';

export function VehicleCard({ car }): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const onPress = () => {
    navigation.navigate('Records', { car_id: car.id });
  };
  return (
    <Pressable onPress={() => onPress() } style={ pageStyles.pressable }>
      <Text style={ [pageStyles.title, pageStyles.cardRow ] }>
        { car.nickname } { (car.year) ? `(${car.year})` : '' }
      </Text>
      <ConditionalText condition={ car.make || car.model } style={ [pageStyles.title, pageStyles.cardRow ] }>
        { `${car.make} ${car.model}`.trim() }
      </ConditionalText>
      <ConditionalText condition={ car.vin } style={ [pageStyles.data, pageStyles.cardRow ] }>
        VIN: { car.vin }
      </ConditionalText>
      <ConditionalText condition={ car.license_plate } style={ [pageStyles.data, pageStyles.cardRow ] }>
        License Plate: { car.license_plate }
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
