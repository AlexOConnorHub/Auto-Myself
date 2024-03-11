import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Pressable } from "../../../components/elements";
import { SettingsContext } from "../../../helpers/settingsContext";
import { convertIntervalForDisplay } from "../../../helpers/functions";

class MaintainanceRecordCard extends React.Component {
  static contextType = SettingsContext;
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
        <View style={{ ...pageStyles.row, backgroundColor: this.context.colors.primary, }}>
          <Text style={ pageStyles.headerText }>{ this.state.maintainanceType.name }</Text>
          <Text style={ pageStyles.subText }>
            { convertIntervalForDisplay(this.state.carMaintainanceInterval.interval, this.state.carMaintainanceInterval.intervalUnit, this.context.distanceUnit) } { this.state.carMaintainanceInterval.intervalUnit === 'dist' ? this.context.distanceUnit : this.state.carMaintainanceInterval.intervalUnit }
          </Text>
        </View>
        <Text style={[ pageStyles.row, pageStyles.mainText, { backgroundColor: this.context.colors.primary } ]}>{ this.props.maintainanceRecord.notes }</Text>
        <View style={[ pageStyles.row, { backgroundColor: this.context.colors.primary } ]}>
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
    paddingVertical: 5,
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
    marginHorizontal: 10,
  },
});