import React from "react";
import { StyleSheet } from "react-native";
import { Text, Pressable } from "../../../components/elements";
import { ConditionalText } from "../../../components/conditionalText";
import { SettingsContext } from "../../../helpers/settingsContext";

class CarCard extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <Pressable onPress={() => this.onPress() } style={ pageStyles.pressable } onLongPress={() => this.props.triggerModal(this.props.car)}>
        <Text style={ [pageStyles.title, pageStyles.cardRow, { backgroundColor: this.context.colors.primary }] }>
          { this.props.car.nickname }
          { (this.props.car.year) ? ` (${this.props.car.year})` : '' }
        </Text>
        <Text style={ [pageStyles.title, pageStyles.cardRow, { backgroundColor: this.context.colors.primary }] }>
          { this.props.car.make } { this.props.car.model }
        </Text>
        <ConditionalText condition={ this.props.car.vin } style={ [pageStyles.data, pageStyles.cardRow, { backgroundColor: this.context.colors.primary }] }>
          VIN: { this.props.car.vin }
        </ConditionalText>
        <ConditionalText condition={ this.props.car.lpn } style={ [pageStyles.data, pageStyles.cardRow, { backgroundColor: this.context.colors.primary }] }>
          License Plate: { this.props.car.lpn }
        </ConditionalText>
        <ConditionalText condition={ this.props.car.annualMileage } style={ [pageStyles.data, pageStyles.cardRow, { backgroundColor: this.context.colors.primary }] }>
          Estimated Annual Mileage: { this.props.car.annualMileage }
        </ConditionalText>
      </Pressable>
    );
  }
  onPress() {
    this.props.navigation.navigate('MaintainanceRecordList', { carId: this.props.car.id });
  }
}

export { CarCard };

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
