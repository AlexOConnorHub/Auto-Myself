import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Pressable } from "../../../components/elements";
import { convertIntervalForDisplay } from "../../../helpers/functions";
import { ParamListBase, useNavigation, useTheme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCell, useRow } from "tinybase/ui-react";
import { tables } from "../../../database/schema";

export default function Card(props): React.ReactElement {
  // static contextType = SettingsContext;
  // state = {
  //   maintainanceType: {},
  //   carMaintainanceInterval: {},
  // }
  // componentDidMount() {
  //   this.postConstruct();
  // }
  // async postConstruct() {
  //   let maintainanceType = await this.props.maintainanceRecord.maintainanceType.fetch();
  //   this.setState({ maintainanceType: maintainanceType });
  //   let carMaintainanceInterval = await maintainanceType.carMaintainanceInterval(this.props.maintainanceRecord.car.id);
  //   this.setState({ carMaintainanceInterval: carMaintainanceInterval });
  // }

  // useEffect(() => {
  //   (async () => {
  //     let maintainanceType = await props.maintainanceRecord.maintainanceType.fetch();
  //     let carMaintainanceInterval = await maintainanceType.carMaintainanceInterval(props.maintainanceRecord.car.id);
  //     setState({ maintainanceType: maintainanceType, carMaintainanceInterval: carMaintainanceInterval });
  //   })();
  // }, []);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const row = useRow(tables.maintainance_records, props.record.id);
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const theme = useTheme();

  const onPress = () => {
    navigation.navigate('EditRecord', { id: props.record.id });
  }

  return (
    <Pressable style={ pageStyles.container } onPress={ onPress.bind(this) }>
      <View style={{ ...pageStyles.row, backgroundColor: theme.colors.primary, }}>
        <Text style={ pageStyles.headerText }>{ row.name }</Text>
        <Text style={ pageStyles.subText }>
          { convertIntervalForDisplay(row.interval, row.intervalUnit, distanceUnit as "Miles" | "Kilometers") } { row.intervalUnit === 'dist' ? distanceUnit : row.intervalUnit }
        </Text>
      </View>
      <Text style={[ pageStyles.row, pageStyles.mainText, { backgroundColor: theme.colors.primary } ]}>{ row.notes }</Text>
      <View style={[ pageStyles.row, { backgroundColor: theme.colors.primary } ]}>
        <Text style={ pageStyles.subText }>{ row.date }</Text>
        <Text style={ pageStyles.subText }>Odometer: { row.odometer }</Text>
        <Text style={ pageStyles.subText }>Cost: { row.cost }</Text>
      </View>
    </Pressable>
  );
}

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