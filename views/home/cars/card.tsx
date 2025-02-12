import React from "react";
import { StyleSheet } from "react-native";
import { Text, Pressable } from "../../../components/elements";
import ConditionalText from "../../../components/conditionalText";
import { convertIntervalForDisplay } from "../../../helpers/functions";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { tables } from "../../../database/schema";
import { useCell } from "tinybase/ui-react";

export default function Card(props): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const onPress = () => {
    navigation.navigate('Records', { id: props.car.id });
  }
  return (
    <Pressable onPress={() => onPress() } style={ pageStyles.pressable } onLongPress={() => props.triggerModal(props.car)}>
      <Text style={ [pageStyles.title, pageStyles.cardRow, ] }>
        { props.car.nickname }
        { (props.car.year) ? ` (${props.car.year})` : '' }
      </Text>
      <Text style={ [pageStyles.title, pageStyles.cardRow, ] }>
        { props.car.make } { props.car.model }
      </Text>
      <ConditionalText condition={ props.car.vin } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        VIN: { props.car.vin }
      </ConditionalText>
      <ConditionalText condition={ props.car.lpn } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        License Plate: { props.car.lpn }
      </ConditionalText>
      <ConditionalText condition={ props.car.annualUsage } style={ [pageStyles.data, pageStyles.cardRow, ] }>
        Estimated Annual Usage: { convertIntervalForDisplay(props.car.annualUsage, 'dist', distanceUnit as "Miles" | "Kilometers") } { distanceUnit }
      </ConditionalText>
    </Pressable>
  );
}

const pageStyles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
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
