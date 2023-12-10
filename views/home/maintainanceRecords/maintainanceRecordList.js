import React from "react";
import { StyleSheet, Keyboard } from "react-native";
import withObservables from "@nozbe/with-observables";
import { Q } from '@nozbe/watermelondb';
import { View, Text, FlatList, Pressable } from "../../../components/elements";
import { CallbackButton } from "../../../components/callbackButton";
import { tables } from "../../../database/tables";
import { MaintainanceRecordCard } from "./maintainanceRecordCard";

class MaintainanceRecordList extends React.Component {
  RenderMaintainanceCard = (maintainanceRecord) =>
    <MaintainanceRecordCard key={ maintainanceRecord.id } maintainanceRecord={ maintainanceRecord } navigation={ this.props.navigation } database={ this.props.database }/>
  RenderMaintainanceList = ({ car, maintainanceRecords }) => (
    <View style={ pageStyles.container }>
      <View style={ pageStyles.heaader }>
        <CallbackButton
          title="Back"
          onPress={ this.goBack.bind(this) } />
        <Text style={ pageStyles.headerText }>Maintainance History</Text>
      </View>
      <View style={ pageStyles.container }>
        <FlatList
          data={ maintainanceRecords }
          renderItem={({ item }) => this.RenderMaintainanceCard(item) }
          ListEmptyComponent={() => (
            <Text style={ pageStyles.emptyText }>No maintainance history</Text>
            )}
        />
      </View>
      <Pressable onPress={this.addRecord.bind(this)} style={ pageStyles.addButton }>
        <Text style={ pageStyles.addText }>Record Maintainance</Text>
      </Pressable>
    </View>
  );
  enhance = withObservables(['carId'], ({ carId, database }) => ({
    car: database.get(tables.cars).findAndObserve(carId),
    maintainanceRecords: database.collections.get(tables.maintainance_records).query(Q.where('car_id', carId)),
  }));
  EnhancedMaintainanceList = this.enhance(this.RenderMaintainanceList);
  render() {
    return (
      <this.EnhancedMaintainanceList carId={ this.props.route.params.carId } database={ this.props.database } />
    );
  }
  async edit(callback) {
    callback();
    this.props.navigation.navigate('CarForm', { carId: this.props.route.params.carId });
  }
  goBack(callback) {
    Keyboard.dismiss();
    callback();
    this.props.navigation.goBack();
  }
  addRecord() {
    this.props.navigation.navigate('MaintainanceRecordForm', { carId: this.props.route.params.carId });
  }
}

export { MaintainanceRecordList };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heaader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 10,
  },
  headerText: {
    alignSelf: 'center',
    fontSize: 20,
  },
  addButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  addText: {
    fontSize: 24,
    paddingLeft: 10,
  },
});