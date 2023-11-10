import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Keyboard } from 'react-native';
import { Feather, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, View } from "../../components/elements";
import { FormElement } from '../../components/formElement.js';
import { CallbackButton } from '../../components/callbackButton.js';
import { style } from '../../components/style.js';
import { tables } from '../../database/tables.js';
import Car from '../../models/car.js';
import withObservables from '@nozbe/with-observables';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.database = props.database;
    this.cars = this.database.get(tables.cars).query();
  }
  state = {
    editCar: null,
    modalVisible: false,
    modalSelectedCar: null,
    modalCar_make: '',
    modalCar_model: '',
    modalCar_year: '',
    modalCar_vin: '',
    modalCar_lpn: '',
  }
  renderCarItem = ({ cars, database }) => {
    return (
      <View>
        <ScrollView>
          {cars.map((car) => {
            return (
              <Pressable onPress={() => { this.openModal(car) }} key={ car.id } style={ pageStyles.listItem.pressable }>
                <View style={ pageStyles.listItem.cardCol }>
                  <Text style={ pageStyles.listItem.title }>{ car.nickname }</Text>
                  <Text style={ pageStyles.listItem.subtitle }>
                    { car.make } { car.model }
                    { (car.year) ? ` (${car.year})` : '' }
                  </Text>
                </View>
                <View style={ pageStyles.listItem.cardCol }>
                  {(car.vin) ? <Text style={ pageStyles.listItem.data }>VIN: { car.vin }</Text> : null}
                  {(car.lpn) ? <Text style={ pageStyles.listItem.data }>License Plate: { car.lpn }</Text> : null}
                  {(car.annualMileage) ? <Text style={ pageStyles.listItem.data }>Estimated Annual Mileage{ car.annualMileage }</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }
  enhance = withObservables(['cars'], ({ cars }) => ({
    cars,
  }));
  EnhancedListCars = this.enhance(this.renderCarItem);
  render() {
    return (
      <View style={pageStyles.container}>
        <this.EnhancedListCars database={ this.database } cars={ this.cars }/>
        
        <Pressable onPress={() => { this.openModal(); }} style={ pageStyles.modal.showPressable }>
          <Feather name='plus-circle' size={40} />
          <Text style={ pageStyles.modal.showPressableText }>Add Car</Text>
        </Pressable>
        
        <Modal animationType='slide' onRequestClose={() => { this.setState({ modalVisible: false }); }} visible={ this.state.modalVisible }>
          <Pressable onPress={Keyboard.dismiss}>
            <View style={ pageStyles.modal.modal }>
              <View style={ pageStyles.modal.modalHeaader }>
                <Pressable onPress={() => { this.setState({ modalVisible: false }); }}>
                  <Feather name='x-circle' size={40} />
                </Pressable>
                <Text style={ pageStyles.modal.modalHeaderText }>Enter Details</Text>
                <CallbackButton title={ `${this.state.modalSelectedCar === null ? 'Add' : 'Edit'} Car`} onPress={ this.submit.bind(this) } style={ pageStyles.modal.modalHeaderButton } />
              </View>
              <View>
                <KeyboardAvoidingView >
                  <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                      <FormElement value={ this.state.modalCar_nickname } onChangeText={(t) => { this.setState({ modalCar_nickname: t }); }}>Nickname</FormElement>
                      <FormElement value={ this.state.modalCar_make } onChangeText={(t) => { this.setState({ modalCar_make: t }); }}>Make</FormElement>
                      <FormElement value={ this.state.modalCar_model } onChangeText={(t) => { this.setState({ modalCar_model: t }); }}>Model</FormElement>
                      <FormElement value={ this.state.modalCar_year } onChangeText={(t) => { this.setState({ modalCar_year: t }); }} textInputProps={{keyboardType: 'numeric'}}>Year</FormElement>
                      <FormElement value={ this.state.modalCar_vin } onChangeText={(t) => { this.setState({ modalCar_vin: t }); }}>VIN</FormElement>
                      <FormElement value={ this.state.modalCar_lpn } onChangeText={(t) => { this.setState({ modalCar_lpn: t }); }}>License Plate</FormElement>
                      <FormElement value={ this.state.modalCar_annualMileage } onChangeText={(t) => { this.setState({ modalCar_annualMileage: t }); }} textInputProps={{keyboardType: 'numeric'}}>Estimated Annual Milage</FormElement>
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }
  closeModal() {
    this.setState({ modalVisible: false });
  }
  openModal(car=null) {
    if (car) {
      this.setState({ modalCar_nickname: car.nickname });
      this.setState({ modalCar_make: car.make });
      this.setState({ modalCar_model: car.model });
      this.setState({ modalCar_year: car.year });
      this.setState({ modalCar_vin: car.vin });
      this.setState({ modalCar_lpn: car.lpn });
      this.setState({ modalCar_annual_mileage: car.annualMileage });
      this.setState({ modalSelectedCar: car });
    } else {
      this.setState({ modalCar_nickname: '' });
      this.setState({ modalCar_make: '' });
      this.setState({ modalCar_model: '' });
      this.setState({ modalCar_year: '' });
      this.setState({ modalCar_vin: '' });
      this.setState({ modalCar_lpn: '' });
      this.setState({ modalCar_annualMileage: '' });
      this.setState({ modalSelectedCar: null });
    }
    this.setState({ modalVisible: true, modalNewCar: true });
  }
  async submit(callback) {
    const { database } = this.props;
    if (this.state.modalSelectedCar === null) {
      await new Car(database.get(tables.cars), {
        nickname: this.state.modalCar_nickname,
        make: this.state.modalCar_make,
        model: this.state.modalCar_model,
        year: parseInt(this.state.modalCar_year),
        vin: this.state.modalCar_vin,
        lpn: this.state.modalCar_lpn,
        annualMileage: parseInt(this.state.modalCar_annualMileage),
      }).addCar();
    } else {
      await this.state.modalSelectedCar.updateCar({
        nickname: this.state.modalCar_nickname,
        make: this.state.modalCar_make,
        model: this.state.modalCar_model,
        year: this.state.modalCar_year,
        vin: this.state.modalCar_vin,
        lpn: this.state.modalCar_lpn,
        annualMileage: this.state.modalCar_annualMileage,
      });
    }
    callback();
    this.setState({ modalVisible: false });
  };
}

export { Home };

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  navigatorScreenOptions: {
    headerShown: false,
    cardStyle: {
      backgroundColor: style.colors.background,
    },
  },
  listItem: {
    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 15,
      marginRight: '10%',
      marginLeft: '5%',
      width: '85%',
      borderRadius: 12,
    },
    cardCol: {
      flexDirection: 'column',
    },
    title: {
      fontSize: 24,
      backgroundColor: style.button.color,
    },
    subtitle: {
      fontSize: 18,
      backgroundColor: style.button.color,
    },
    data: {
      fontSize: 16,
      backgroundColor: style.button.color,
    },
  },
  modal: {
    view: {
      alignItems: 'center',
    },
    modal: {
      height: '100%',
    },
    showPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 10,
      width: '95%',
      position: 'absolute',
      bottom: 0,
    },
    showPressableText: {
      fontSize: 24,
      color: style.text.button.color,
      paddingLeft: 10,
    },
    modalHeaader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    modalHeaderText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    modalHeaderButton: {
      fontSize: 24,
      color: style.text,
    },
  },
});
