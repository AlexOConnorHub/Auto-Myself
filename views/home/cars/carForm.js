import React from "react";
import { Keyboard, StyleSheet } from "react-native";
import { View, Text, KeyboardScrollView, TextInput } from "../../../components/elements";
import { FormElement } from "../../../components/formElement";
import { CallbackButton } from "../../../components/callbackButton";
import { tables } from "../../../database/tables";
import { SettingsContext } from "../../../helpers/settingsContext";
import { convertIntervalForStorage, convertIntervalForDisplay } from "../../../helpers/functions";

class CarForm extends React.Component {
  static contextType = SettingsContext
  car = null
  new = true
  state = {
    nickname: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    lpn: '',
    annualUsage: '',
  }
  formData = [
    {
      label: 'Nickname',
      model: 'nickname',
      keyboardType: 'default',
    },
    {
      label: 'Make',
      model: 'make',
      keyboardType: 'default',
    },
    {
      label: 'Model',
      model: 'model',
      keyboardType: 'default',
    },
    {
      label: 'Year',
      model: 'year',
      keyboardType: 'numeric',
    },
    {
      label: 'VIN',
      model: 'vin',
      keyboardType: 'default',
    },
    {
      label: 'License Plate',
      model: 'lpn',
      keyboardType: 'default',
    },
  ]
  constructor(props) {
    super(props);
    if (props.route.params !== undefined && props.route.params.carId !== undefined) {
      this.new = false;
    }
  }
  componentDidMount() {
    if (!this.new) {
      this.postConstruct();
    }
  }
  async postConstruct() {
    this.car = await this.props.database.get(tables.cars).find(this.props.route.params.carId);
    this.setState( this.formData.reduce((state, data) => {
      state[data.model] = this.car[data.model];
      return state;
    }, {}) );
    this.setState({ annualUsage: convertIntervalForDisplay(this.car.annualUsage, 'dist', this.context.distanceUnit) });
  }
  render() {
    return (
      <View style={ pageStyles.container }>
        <View style={ pageStyles.heaader }>
          <CallbackButton
            title="Back"
            onPress={ this.goBack.bind(this) } />
          <Text style={ pageStyles.headerText }>
            { this.new ? 'Add' : 'Edit' } Car
          </Text>
          <CallbackButton
            title={ 'Save' }
            onPress={ this.save.bind(this) } />
        </View>
        <KeyboardScrollView>
          { this.formData.map((item) => (
            <FormElement label={ item.label }
              key={ item.model }>
              <TextInput
                onChangeText={(text) => { this.setState({ [item.model]: text }); }}
                value={ this.state[item.model] }
                keyboardType={ item.keyboardType } />
            </FormElement>
          )) }
          <FormElement label={ `Estimated Annual Usage (${this.context.distanceUnit})` } key='annualUsage'>
            <TextInput
              onChangeText={(text) => { this.setState({ annualUsage: text }); }}
              value={ this.state.annualUsage }
              keyboardType='numeric' />
          </FormElement>
        </KeyboardScrollView>
      </View>
    )
  }
  async save(callback) {
    const formStates = this.formData.reduce((state, data) => {
      state[data.model] = this.state[data.model];
      return state;
    }, {});
    formStates.annualUsage = convertIntervalForStorage(this.state.annualUsage, 'dist', this.context.distanceUnit);
    if (this.new) {
      this.car = await this.props.database.write(async () => {
        return await this.props.database.get(tables.cars).create((record) => {
          for (let key in formStates) {
            record[key] = formStates[key];
          }
        });
      });
    } else {
      await this.car.updateRecord(formStates);
    }
    this.goBack(callback);
  }
  goBack(callback) {
    Keyboard.dismiss();
    this.props.navigation.goBack();
    callback();
  }
}

export { CarForm };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
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
});
