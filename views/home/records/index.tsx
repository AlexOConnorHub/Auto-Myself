import React, { useEffect } from "react";
import { StyleSheet, Keyboard } from "react-native";
import { View, Text, FlatList, Pressable } from "../../../components/elements";
import CallbackButton from "../../../components/callbackButton";
import Card from "./card";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTable, useCell } from "tinybase/ui-react";
import { tables } from "../../../database/schema";

export default function Records(props): React.ReactElement {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const records = useTable(tables.maintenance_records);

    const RecordListItem = (record) =>
      <Card key={ record.id } record={ record } />

    const carName = useCell(tables.cars, props.route.params.car_id, 'nickname') as string;

    useEffect(() => {
      navigation.setOptions({ title: carName });
    }, [carName]);

    return (
      <View style={ pageStyles.container }>
        <View>
          <FlatList
            data={ Object.keys(records).filter((key) => records[key].car_id === props.route.params.car_id).map((key) => { return { ...records[key], id: key }; }) }
            renderItem={({ item }) => RecordListItem(item) }
            ListEmptyComponent={() => (
              <Text style={ pageStyles.emptyText }>No records yet</Text>
            )}
          />
        </View>
        <View style={ pageStyles.actionButtonSection }>
          <Pressable onPress={() => { navigation.navigate('EditRecord', { id: undefined, car_id: props.route.params.car_id }); }} style={ pageStyles.actionButton }>
            <Text style={ pageStyles.actionButtonText }>Add Maintenance</Text>
          </Pressable>
          <Pressable onPress={() => { navigation.navigate('EditCar', { id: props.route.params.car_id }); }} style={ pageStyles.actionButton }>
            <Text style={ pageStyles.actionButtonText }>Edit Car</Text>
          </Pressable>
        </View>
      </View>
    );
}

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  emptyText : {
    fontSize: 24,
    alignSelf: 'center',
  },
  actionButtonSection: {
    marginVertical: 8,
  },
  actionButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 3,
    width: '95%',
  },
  actionButtonText: {
    fontSize: 24,
    paddingLeft: 10,
  },
});