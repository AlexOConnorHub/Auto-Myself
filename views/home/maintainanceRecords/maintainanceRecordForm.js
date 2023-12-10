import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown, View, Text, TextInput } from "../../../components/elements";
import { CallbackButton } from "../../../components/callbackButton";
import { KeyboardScrollView } from "../../../components/elements";
import { FormElement } from "../../../components/formElement";
import { Q } from "@nozbe/watermelondb";
import { colors } from "../../../components/style";
import { tables } from "../../../database/tables";

class MaintainanceRecordForm extends React.Component {
  maintainanceType = null
  maintainanceInterval = null
  car = null
  maintainanceRecord = null
  new = true
  carMaintainanceIntervalId = null
  state = {
    maintainanceTypeId: '',
    maintainanceTypes: [],
    new_maintainanceType: '',
    timeBetween: '',
    maintainanceIntervalType: 'weeks',
    odometer: '',
    cost: '$',
    notes: '',
  }
  formData = [
    {
      label: 'Odometer',
      model: 'odometer',
      keyboardType: 'numeric',
    },
    {
      label: 'Cost',
      model: 'cost',
      keyboardType: 'numeric',
    },
  ]
  constructor(props) {
    super(props);
    if (props.route.params !== undefined && props.route.params.maintainanceRecordId !== undefined) {
      this.new = false;
    }
  }
  componentDidMount() {
    this.props.database.get(tables.maintainance_types).query().observeWithColumns(['name']).subscribe((maintainanceTypes) => {
      let types = maintainanceTypes.map((type) => {
        return { value: type.id, label: type.name };
      });
      types.sort((a, b) => a.label.localeCompare(b.label));
      types.unshift({ value: 'new', label: 'New Maintainance Type' });
      this.setState({ maintainanceTypes: types });
    });
    if (!this.new) {
      this.postConstruct();
    }
  }
  async postConstruct() {
    this.maintainanceRecord = await this.props.database.get(tables.maintainance_records).find(this.props.route.params.maintainanceRecordId);
    this.maintainanceType = await this.props.database.get(tables.maintainance_types).find(this.maintainanceRecord._getRaw('maintainance_type_id'));
    this.maintainanceInterval = await this.maintainanceType.carMaintainanceInterval(this.maintainanceRecord._getRaw('car_id'));
    this.carMaintainanceIntervalId = this.maintainanceInterval.id;
    this.car = await this.maintainanceRecord.car.fetch();
    this.setState({ maintainanceTypeId: this.maintainanceType.id });
    this.setState({ timeBetween: this.maintainanceInterval.frequency });
    this.setState({ odometer: this.maintainanceRecord.odometer });
    this.setState({ cost: this.maintainanceRecord.cost });
    this.setState({ notes: this.maintainanceRecord.notes });
    this.setState({ maintainanceIntervalType: this.car.maintainanceIntervalType });
  }
  render() {
    return (
      <View style={ pageStyles.container }>
        <View style={ pageStyles.heaader }>
          <CallbackButton
            title="Back"
            onPress={ this.goBack.bind(this) } />
          <Text style={ pageStyles.headerText }>
            Maintainance
          </Text>
          <CallbackButton
            title={ 'Save' }
            onPress={ this.save.bind(this) } />
        </View>
        <KeyboardScrollView>
          <View style={ pageStyles.formField }>
            <Text style={ pageStyles.text }>Maintainance Type</Text>
            <Dropdown
              label="Maintainance Type"
              data={this.state.maintainanceTypes}
              value={ this.state.maintainanceTypeId }
              onChange={ this.onDropdownChange.bind(this) }/>
          </View>
          { // TODO: Animate this in instead of crude render
            this.state.maintainanceTypeId === 'new' &&
            <View style={ pageStyles.formField }>
              <Text style={ pageStyles.text }>Maintainance Type</Text>
              <TextInput
                style={ pageStyles.textInput }
                value={ this.state.new_maintainanceType }
                onChangeText={(text) => this.setState({ new_maintainanceType: text })} />
            </View>
          }
          { // TODO: Animate this in instead of crude render
            this.state.maintainanceTypeId !== '' &&
            <View style={ pageStyles.formField }>
              <Text style={ pageStyles.text }>Maintainance Interval</Text>
              <TextInput
                style={ pageStyles.textInput }
                value={ this.state.timeBetween }
                onChangeText={(text) => this.setState({ timeBetween: text })}
                keyboardType="numeric" />
            </View>
          }
          { this.formData.map((item) => (
            <FormElement
              key={ item.model }
              value={ this.state[item.model] }
              onChangeText={(text) => this.setState({ [item.model]: text })}
              textInputProps={{keyboardType: item.keyboardType}}>
                { item.label }
            </FormElement>
          )) }
          <View style={ pageStyles.formField }>
            <Text style={ pageStyles.text }>Notes</Text>
            <TextInput
              style={ pageStyles.textInput }
              value={ this.state.notes }
              onChangeText={(text) => this.setState({ notes: text })}
              multiline={ true }
              numberOfLines={ 4 } />
          </View>
          { !this.new &&
            <CallbackButton
              title="Delete"
              pressable={ {style: pageStyles.deleteButton} }
              onPress={ this.delete.bind(this) } />
          }
        </KeyboardScrollView>
      </View>
    );
  }
  onDropdownChange(item) {
    this.setState({ maintainanceTypeId: item.value }, this.getCarMaintainanceInterval.bind(this));
  }
  async getCarMaintainanceInterval() {
    if (this.state.maintainanceTypeId === 'new') {
      this.setState({ timeBetween: '' });
      return;
    }
    this.maintainanceInterval = await this.props.database.get(tables.car_maintainance_intervals).query(
      Q.where('car_id', this.props.route.params.carId),
      Q.where('maintainance_type_id', this.state.maintainanceTypeId),
    ).fetch();
    for (let i = 1; i < this.maintainanceInterval.length; i++) {
      await this.maintainanceInterval[i].deleteRecord();
    }
    if (this.maintainanceInterval.length === 1) {
      this.carMaintainanceIntervalId = this.maintainanceInterval[0].id;
      this.setState({ timeBetween: this.maintainanceInterval[0].weeksBetween });
    } else {
      this.carMaintainanceIntervalId = null;
      this.setState({ timeBetween: '' });
    }
  }
  async save(callback) {
    if (this.state.maintainanceTypeId === 'new') {
      this.maintainanceType = await this.props.database.write(async () => {
        return await this.props.database.get(tables.maintainance_types).create((record) => {
          record.name = this.state.new_maintainanceType;
        });
      });
      this.setState({ maintainanceTypeId: this.maintainanceType });
    } else if (!this.maintainanceType) {
      this.maintainanceType = await this.props.database.get(tables.maintainance_types).find(this.state.maintainanceTypeId);
    }
    this.maintainanceInterval = await this.maintainanceType.ensureCarMaintainanceInterval(this.props.route.params.carId, this.carMaintainanceIntervalId, this.state.timeBetween, this.state.maintainanceIntervalType === 'weeks');
    if (this.new) {
      await this.maintainanceType.createMaintainanceRecord({
        carId: this.props.route.params.carId,
        odometer: this.state.odometer,
        cost: this.state.cost,
        notes: this.state.notes,
      });
    } else {
      await this.maintainanceRecord.updateRecord({
        odometer: this.state.odometer,
        cost: this.state.cost,
        notes: this.state.notes,
      });
    }
    this.goBack(callback);
  }
  async delete(callback) {
    await this.maintainanceRecord.deleteRecord();
    this.goBack(callback);
  }
  goBack(callback) {
    this.props.navigation.goBack();
    callback();
  }
}

export { MaintainanceRecordForm };

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
  },
  heaader: {
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
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  deleteButton: {
    marginHorizontal: 10,
  },
});
