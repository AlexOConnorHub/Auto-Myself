import React from "react";
import { Alert, Keyboard, StyleSheet } from "react-native";
import { View, Text, KeyboardScrollView } from "../../components/elements";
import { FormElement } from "../../components/formElement";
import { CallbackButton } from "../../components/callbackButton";
import { tables } from "../../database/tables";
import Car from "../../models/car";

class CarForm extends React.Component {
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
  car = null
  new = true
  state = {
    nickname: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    lpn: '',
    annualMileage: '',
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
    {
      label: 'Estimated Annual Mileage',
      model: 'annualMileage',
      keyboardType: 'numeric',
    },
  ]
  async postConstruct() {
    this.car = await this.props.database.get(tables.cars).find(this.props.route.params.carId);
    this.setState( this.formData.reduce((state, data) => {
      state[data.model] = this.car[data.model];
      return state;
    }, {}) );
  }
  render() {
    return (
      <View style={ pageStyles.container }>
        <View style={ pageStyles.heaader }>
          <CallbackButton
            title="Back"
            onPress={ this.goBack.bind(this) } />
          { this.new ? 
            <Text style={ pageStyles.headerText }>
              Add Car
            </Text>
            :
            <CallbackButton
              title="Delete"
              onPress={ this.delete.bind(this) } />
          }
          <CallbackButton
            title={ 'Save' }
            onPress={ this.save.bind(this) } />
        </View>
        <KeyboardScrollView>
          { this.formData.map((item) => (
            <FormElement
              key={ item.model }
              value={ this.state[item.model] }
              onChangeText={(text) => this.setState({ [item.model]: text })}
              textInputProps={{keyboardType: item.keyboardType}}>
                { item.label }
            </FormElement>
          )) }
        </KeyboardScrollView>
      </View>
    )
  }
  async save(callback) {
    const formStates = this.formData.reduce((state, data) => {
      state[data.model] = this.state[data.model];
      return state;
    }, {});
    if (this.new) {
      let newCar = new Car(this.props.database.get(tables.cars), formStates);
      await newCar.addCar();
    } else {
      await this.car.updateCar(formStates);
    }
    this.goBack(callback);
  }
  async delete(callback) {
    Alert.alert(
      "Delete Car",
      "Are you sure you want to delete this car?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Delete", style: 'destructive', onPress: async () => {
            await this.car.deleteCar();
            this.goBack(callback);
          }
        }
      ],
      { cancelable: false }
    );
  }
  goBack(callback) {
    Keyboard.dismiss();
    callback();
    this.props.navigation.goBack();
  }
}

export { CarForm };

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
});
