import React from "react";
import { StyleSheet, Keyboard } from "react-native";
import { View, Text, FlatList, Pressable } from "../../../components/elements";
import CallbackButton from "../../../components/callbackButton";
import Card from "./card";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTable } from "tinybase/ui-react";

export default function Records(): React.ReactElement {
  // RenderMaintainanceCard = (maintainanceRecord) =>
  //   <MaintainanceRecordCard key={ maintainanceRecord.id } maintainanceRecord={ maintainanceRecord } navigation={ this.props.navigation } database={ this.props.database }/>
  // RenderMaintainanceList = ({ maintainanceRecords }) => (
  //   // <View style={ pageStyles.container }>
  //   <View>
  //     <View style={ pageStyles.heaader }>
  //       <CallbackButton
  //         title="Back"
  //         onPress={ this.goBack.bind(this) } />
  //       <Text style={ pageStyles.headerText }>Maintainance History</Text>
  //     </View>
  //     {/* <View style={ pageStyles.container }> */}
  //     <View>
  //       <FlatList
  //         data={ maintainanceRecords.sort((a, b) => b.createdAt - a.createdAt) }
  //         renderItem={({ item }) => this.RenderMaintainanceCard(item) }
  //         ListEmptyComponent={() => (
  //           <Text style={ pageStyles.emptyText }>No maintainance history</Text>
  //           )}
  //       />
  //     </View>
  //     <Pressable onPress={this.addRecord.bind(this)} style={ pageStyles.addButton }>
  //       <Text style={ pageStyles.addText }>Record Maintainance</Text>
  //     </Pressable>
  //   </View>
  // );
  // // enhance = withObservables(['carId'], ({ carId, database }) => ({
  // //   maintainanceRecords: database.collections.get(tables.maintainance_records).query(Q.where('car_id', carId)),
  // // }));
  // // EnhancedMaintainanceList = this.enhance(this.RenderMaintainanceList);
  // render() {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const cars = useTable('cars');

    const RecordListItem = (record) =>
      <Card key={ record.id } record={ record } />

    return (
      <View style={ pageStyles.container }>
        <View>
          <FlatList
            data={ Object.keys(cars).map((key) => { return { ...cars[key], id: key }; }) }
            renderItem={({ item }) => RecordListItem(item) }
            ListEmptyComponent={() => (
              <Text style={ pageStyles.emptyText }>Add a car to get started!</Text>
            )}
          />
        </View>
        <Pressable onPress={() => { navigation.navigate('EditRecord', { id: undefined }); }} style={ pageStyles.addRecordButton }>
          <Text style={ pageStyles.addRecordText }>Add Record</Text>
        </Pressable>
      </View>
    );
  // }
  // async edit(callback) {
  //   callback();
  //   this.props.navigation.navigate('CarForm', { carId: this.props.route.params.carId });
  // }
  // goBack(callback) {
  //   Keyboard.dismiss();
  //   callback();
  //   this.props.navigation.goBack();
  // }
  // addRecord() {
  //   this.props.navigation.navigate('MaintainanceRecordForm', { carId: this.props.route.params.carId });
  // }
}

// export { MaintainanceRecordList };

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  emptyText : {
    fontSize: 24,
    alignSelf: 'center',
  },
  addRecordButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  addRecordText: {
    fontSize: 24,
    paddingLeft: 10,
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