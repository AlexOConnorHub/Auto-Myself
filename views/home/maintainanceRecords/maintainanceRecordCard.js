import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Pressable } from "../../../components/elements";
import { Q } from "@nozbe/watermelondb";
import { tables } from "../../../database/tables";
import { colors } from "../../../components/style";

class MaintainanceRecordCard extends React.Component {
  state = {
    maintainanceType: {},
    carMaintainanceInterval: {},
  }
  componentDidMount() {
    this.postConstruct();
  }
  async postConstruct() {
    let maintainanceType = await this.props.maintainanceRecord.maintainanceType.fetch();
    this.setState({ maintainanceType: maintainanceType });
    let carMaintainanceInterval = await maintainanceType.carMaintainanceInterval(this.props.maintainanceRecord.car.id);
    this.setState({ carMaintainanceInterval: carMaintainanceInterval });
  }
  render() {
    return (
      <Pressable style={ pageStyles.container } onPress={ this.onPress.bind(this) }>
        <View style={ pageStyles.row }>
          <Text style={ pageStyles.headerText }>{ this.state.maintainanceType.name }</Text>
          <Text style={ pageStyles.subText }>
            { this.state.carMaintainanceInterval.frequency } { this.state.carMaintainanceInterval.frequencyType }
          </Text>
        </View>
        <Text style={ pageStyles.mainText }>{ this.props.maintainanceRecord.notes }</Text>
        <View style={ pageStyles.row }>
          <Text style={ pageStyles.subText }>{ this.props.maintainanceRecord.humanDate() }</Text>
          <Text style={ pageStyles.subText }>Odometer: { this.props.maintainanceRecord.odometer }</Text>
          <Text style={ pageStyles.subText }>Cost: { this.props.maintainanceRecord.cost }</Text>
        </View>
      </Pressable>
    );
  }
  onPress() {
    this.props.navigation.navigate('MaintainanceRecordForm', { maintainanceRecordId: this.props.maintainanceRecord.id });
  }
}

export { MaintainanceRecordCard };

const pageStyles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 18,
  },
  mainText: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});