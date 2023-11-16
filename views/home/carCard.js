import React from "react";
import { StyleSheet } from "react-native";
import { Text, Pressable } from "../../components/elements";
import { ConditionalText } from "../../components/conditionalText";
import { colors } from "../../components/style";

class CarCard extends React.Component {
  render() {
    return (
      <Pressable onPress={() => this.onPress() } style={ pageStyles.pressable }>
        <Text style={ [pageStyles.title, pageStyles.cardRow] }>
          { this.props.car.nickname }
          { (this.props.car.year) ? ` (${this.props.car.year})` : '' }
        </Text>
        <Text style={ [pageStyles.title, pageStyles.cardRow] }>
          { this.props.car.make } { this.props.car.model }
        </Text>
        <ConditionalText condition={ this.props.car.vin } style={ [pageStyles.data, pageStyles.cardRow] }>
          VIN: { this.props.car.vin }
        </ConditionalText>
        <ConditionalText condition={ this.props.car.lpn } style={ [pageStyles.data, pageStyles.cardRow] }>
          License Plate: { this.props.car.lpn }
        </ConditionalText>
        <ConditionalText condition={ this.props.car.annualMileage } style={ [pageStyles.data, pageStyles.cardRow] }>
          Estimated Annual Mileage: { this.props.car.annualMileage }
        </ConditionalText>
      </Pressable>
    );
  }
  onPress() {
    this.props.navigation.navigate('CarForm', { carId: this.props.car.id });
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
    backgroundColor: colors.primary,
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
