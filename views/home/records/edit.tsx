import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardType, StyleSheet } from "react-native";
import { Dropdown, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Pressable } from "../../../components/elements";
import CallbackButton from "../../../components/callbackButton";
import FormElement from "../../../components/formElement";
import { OptionButtons } from "../../../components/optionButtons";
import { convertIntervalForDisplay, convertIntervalForStorage } from "../../../helpers/functions";
import { useNavigation } from "@react-navigation/native";
import { useAddRowCallback, useCell, useDelRowCallback, useRow, useSetRowCallback, useStore, useTable } from "tinybase/ui-react";
import { tables } from "../../../database/schema";

export default function Edit(props): React.ReactElement {
  const navigation = useNavigation();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');

  let isNewRecord = props.route.params.id === undefined;
  let formDataGenerator: { label: string, model: string, keyboardType: KeyboardType, }[] = [
    {
      label: `Odometer (${distanceUnit})`,
      model: 'odometer',
      keyboardType: 'numeric',
    },
    {
      label: 'Cost',
      model: 'cost',
      keyboardType: 'numeric',
    },
  ];

  const records = useRow(tables.maintainance_records, props.route.params.id);
  const types = useTable(tables.maintainance_types);
  const [formData, setFormData] = useState(() => formDataGenerator.reduce((state, data) => {
    state[data.model] = records[data.model] || '';
    return state;
  }, {}));

  useEffect(() => {
    if (!isNewRecord) {
      navigation.setOptions({ title: 'Edit Car' });
    }
  }, [props.route.params.id]);

  const store = useStore();
  const saveFunction = () => {
    const newRow = formDataGenerator.reduce((state, data) => {
      state[data.model] = formData[data.model];
      return state;
    }, {} as { odometer: string });
    newRow.odometer = convertIntervalForStorage(newRow.odometer, 'dist', distanceUnit as "Miles" | "Kilometers");
    return newRow;
  };
  const save = isNewRecord ?
    useAddRowCallback(tables.maintainance_records, saveFunction, [formData], store, () => goBack(() => {}), []) :
    useSetRowCallback(tables.maintainance_records, props.route.params.id, saveFunction, [formData], store, () => goBack(() => {}), []);
  const goBack = (callback) => {
    Keyboard.dismiss();
    navigation.goBack();
    callback();
  }

  const remove = useDelRowCallback(tables.maintainance_records, props.route.params.id, store, () => goBack(() => {}), []);
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        {/* <FormElement label="Maintainance Type">
          <Dropdown
            // label="Maintainance Type"
            data={  this.state.maintainanceTypes }
            value={ this.state.maintainanceTypeId }
            onChange={ this.onDropdownChange.bind(this) }/>
        </FormElement>
        { // TODO: Animate this in instead of crude render
          this.state.maintainanceTypeId === 'new' &&
          <FormElement label="New Maintainance Type">
            <TextInput
              style={ pageStyles.textInput }
              value={ this.state.new_maintainanceType }
              onChangeText={(text) => this.setState({ new_maintainanceType: text })}  />
          </FormElement>
        }
        { // TODO: Animate this in instead of crude render
          this.state.maintainanceTypeId !== '' &&
          <FormElement label="Maintainance Interval">
            <TextInput
              style={ pageStyles.textInput }
              value={ this.state.interval }
              onChangeText={(text) => this.setState({ interval: text })}
              keyboardType="numeric" />
          </FormElement>
        }
        { // TODO: Animate this in instead of crude render
          this.state.maintainanceTypeId !== '' &&
          <FormElement label="Interval Unit">
          <OptionButtons
            options={ [
              { key: 'dist', label: this.context.distanceUnit },
              { key: 'weeks', label: 'Weeks' },
              { key: 'months', label: 'Months' },
              { key: 'years', label: 'Years' },
            ] }
            direction="vertical"
            value={ this.state.intervalUnit }
            onSelect={(key) => this.setState({ intervalUnit: key })} />
        </FormElement>
        } */}
        { formDataGenerator.map((element) => (
          <FormElement label={ element.label }
            key={ element.model }>
            <TextInput
              onChangeText={(text) => { setFormData({ ...formData, [element.model]: text }); }}
              value={ formData[element.model] }
              keyboardType={ element.keyboardType } />
          </FormElement>
        )) }
        {/* <FormElement label="Notes">
          <TextInput
            style={ pageStyles.textInput }
            value={ this.state.notes }
            onChangeText={(text) => this.setState({ notes: text })}
            multiline={ true }
            numberOfLines={ 4 } />
        </FormElement> */}
        <View style={ pageStyles.view }>
          {
            !isNewRecord &&
            <Pressable
              key='delete'
              onPress={ remove.bind(this) }
              style={[
                pageStyles.pressable,
              ]}>
              <Text style={pageStyles.text}>Delete</Text>
            </Pressable>
          }
          <Pressable
            key='save'
            onPress={ save.bind(this) }
            style={[
              pageStyles.pressable,
            ]}>
            <Text style={pageStyles.text}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // maintainanceType = null
  // maintainanceInterval = null
  // car = null
  // maintainanceRecord = null
  // new = true
  // carMaintainanceIntervalId = null
  // state = {
  //   maintainanceTypeId: '',
  //   maintainanceTypes: [],
  //   new_maintainanceType: '',
  //   interval: '',
  //   intervalUnit: '',
  //   odometer: '',
  //   cost: '$',
  //   notes: '',
  // }
  // componentDidMount() {
    // this.props.database.get(tables.maintainance_types).query().observeWithColumns(['name']).subscribe((maintainanceTypes) => {
    //   let types = maintainanceTypes.map((type) => {
    //     return { value: type.id, label: type.name };
    //   });
    //   types.sort((a, b) => a.label.localeCompare(b.label));
    //   types.unshift({ value: 'new', label: 'New Maintainance Type' });
    //   this.setState({ maintainanceTypes: types });
    // });
    // if (!this.new) {
    //   this.postConstruct();
    // }
  // }
  // async postConstruct() {
    // this.maintainanceRecord = await this.props.database.get(tables.maintainance_records).find(this.props.route.params.maintainanceRecordId);
    // this.maintainanceType = await this.props.database.get(tables.maintainance_types).find(this.maintainanceRecord._getRaw('maintainance_type_id'));
    // this.maintainanceInterval = await this.maintainanceType.carMaintainanceInterval(this.maintainanceRecord._getRaw('car_id'));
    // this.carMaintainanceIntervalId = this.maintainanceInterval.id;
    // this.car = await this.maintainanceRecord.car.fetch();
    // this.setState({ maintainanceTypeId: this.maintainanceType.id });
    // this.setState({ interval: convertIntervalForDisplay(this.maintainanceInterval.interval, this.maintainanceInterval.intervalUnit, distanceUnit) });
    // this.setState({ intervalUnit: this.maintainanceInterval.intervalUnit });
    // this.setState({ odometer: this.maintainanceRecord.odometer });
    // this.setState({ cost: this.maintainanceRecord.cost });
    // this.setState({ notes: this.maintainanceRecord.notes });
  // }
//   render() {
//     return (
//       // <View style={ pageStyles.container }>
//       <View>
//         <View style={ pageStyles.heaader }>
//           <CallbackButton
//             title="Back"
//             onPress={ this.goBack.bind(this) } />
//           <Text style={ pageStyles.headerText }>
//             Maintainance
//           </Text>
//           <CallbackButton
//             title={ 'Save' }
//             onPress={ this.save.bind(this) } />
//         </View>
//         <ScrollView>
//           { !this.new &&
//             <CallbackButton
//               title="Delete"
//               pressable={ {style: pageStyles.deleteButton} }
//               onPress={ this.delete.bind(this) } />
//           }
//         </ScrollView>
//       </View>
//     );
//   }
//   onDropdownChange(item) {
//     this.setState({ maintainanceTypeId: item.value }, this.getCarMaintainanceInterval.bind(this));
//   }
//   async getCarMaintainanceInterval() {
//     if (this.state.maintainanceTypeId === 'new') {
//       this.setState({ interval: '' });
//       return;
//     }
//     // this.maintainanceInterval = await this.props.database.get(tables.car_maintainance_intervals).query(
//     //   Q.where('car_id', this.props.route.params.carId),
//     //   Q.where('maintainance_type_id', this.state.maintainanceTypeId),
//     // ).fetch();
//     for (let i = 1; i < this.maintainanceInterval.length; i++) {
//       await this.maintainanceInterval[i].deleteRecord();
//     }
//     if (this.maintainanceInterval.length === 1) {
//       this.carMaintainanceIntervalId = this.maintainanceInterval[0].id;
//       this.setState({ interval: convertIntervalForDisplay(this.maintainanceInterval[0].interval, this.maintainanceInterval[0].intervalUnit, distanceUnit) });
//     } else {
//       this.carMaintainanceIntervalId = null;
//       this.setState({ interval: '' });
//     }
//   }
//   async save(callback) {
//     if (this.state.maintainanceTypeId === 'new') {
//       this.maintainanceType = await this.props.database.write(async () => {
//         // return await this.props.database.get(tables.maintainance_types).create((record) => {
//         //   record.name = this.state.new_maintainanceType;
//         // });
//       });
//       this.setState({ maintainanceTypeId: this.maintainanceType });
//     } else if (!this.maintainanceType) {
//       // this.maintainanceType = await this.props.database.get(tables.maintainance_types).find(this.state.maintainanceTypeId);
//     }
//     this.maintainanceInterval = await this.maintainanceType.ensureCarMaintainanceInterval({
//       carId: this.props.route.params.carId,
//       carMaintainanceIntervalId: this.carMaintainanceIntervalId,
//       interval: convertIntervalForStorage(this.state.interval, this.state.intervalUnit, distanceUnit),
//       intervalUnit: this.state.intervalUnit,
//     });
//     if (this.new) {
//       await this.maintainanceType.createMaintainanceRecord({
//         carId: this.props.route.params.carId,
//         odometer: this.state.odometer,
//         cost: this.state.cost,
//         notes: this.state.notes,
//       });
//     } else {
//       await this.maintainanceRecord.updateRecord({
//         odometer: this.state.odometer,
//         cost: this.state.cost,
//         notes: this.state.notes,
//       });
//     }
//     this.goBack(callback);
//   }
//   async delete(callback) {
//     await this.maintainanceRecord.deleteRecord();
//     this.goBack(callback);
//   }
//   goBack(callback) {
//     this.props.navigation.goBack();
//     callback();
//   }
}

const pageStyles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  heaader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formField: {
    marginBottom: 20,
    padding: 10,
  },
  textInput: {
    fontSize: 16,
    textAlignVertical: 'top',
  },
  deleteButton: {
    marginHorizontal: 10,
  },



  view: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },



});
