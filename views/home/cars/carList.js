import React from "react";
import { StyleSheet } from "react-native";
import withObservables from '@nozbe/with-observables';
import { View, Text, Pressable, FlatList, Modal } from "../../../components/elements";
import { CarCard } from "./carCard";
import { tables } from "../../../database/tables";
import { CallbackButton } from "../../../components/callbackButton";

class CarList extends React.Component {
  state = {
    modalVisible: false,
  }
  modal = {
    carId: null,
  }
  RenderCarCard = (car) =>
    <CarCard key={ car.id } car={ car } navigation={ this.props.navigation } triggerModal={ this.triggerModal.bind(this) } closeModal={ this.closeModal.bind(this) }/>
  RenderCarList = ({ cars }) => (
    <View style={ pageStyles.container }>
      <View style={ pageStyles.container }>
        <FlatList
          data={ cars }
          // data={ [] }
          renderItem={({ item }) => this.RenderCarCard(item) }
          ListEmptyComponent={() => (
            <Text style={ pageStyles.emptyText }>Add a car to get started!</Text>
            )}
        />
      </View>
      <Pressable onPress={() => { this.props.navigation.navigate('CarForm'); }} style={ pageStyles.addCarButton }>
        <Text style={ pageStyles.addCarText }>Add Car</Text>
      </Pressable>
      <Modal visible={ this.state.modalVisible } animationType="slide" onRequestClose={ this.closeModal.bind(this) } transparent={true}>
        {/* TODO: Make this modal appear immediatly, and the view within animate slide up */}
        <Pressable style={ pageStyles.modal.container } onPress={ this.closeModal.bind(this) }>
          <View style={ pageStyles.modal.list }>
            <Pressable style={ pageStyles.modal.listItem } onPress={ this.closeModal.bind(this) }>
              <Text style={ pageStyles.modal.listText }>Cancel</Text>
            </Pressable>
            <Pressable style={ pageStyles.modal.listItem } onPress={ () => this.modalEditCar() }>
              <Text style={ pageStyles.modal.listText }>Edit Car</Text>
            </Pressable>
            <Pressable style={ pageStyles.modal.listItem } onPress={ () => this.modalDeleteCar() }>
              <Text style={ pageStyles.modal.listText }>Delete Car</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
  enhance = withObservables(['cars'], ({ cars }) => ({ cars }));
  EnhancedCarList = this.enhance(this.RenderCarList);
  render() {
    return (
      <this.EnhancedCarList cars={ this.props.database.get(tables.cars).query() }/>
    );
  }
  triggerModal(carID) {
    this.setState({ modalVisible: true });
    this.modal.carId = carID;
  }
  closeModal() {
    this.setState({ modalVisible: false });
    this.modal.carId = null;
  }
  modalEditCar() {
    this.props.navigation.navigate('CarForm', { carId: this.modal.carId });
    this.closeModal();
  }
  async modalDeleteCar() {
    let car = await this.props.database.get(tables.cars).find(this.modal.carId);
    await car.deleteRecord();
    this.closeModal();
  }
}

export { CarList };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText : {
    fontSize: 24,
    alignSelf: 'center',
  },
  addCarButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  addCarText: {
    fontSize: 24,
    paddingLeft: 10,
  },
  modal: {
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    list: {
      backgroundColor: 'white',
      width: '100%',
      padding: 10,
      position: 'absolute',
      bottom: 0,
    },
    listItem: {
      paddingVertical: 5,
      marginVertical: 5,
    },
    listText: {
      fontSize: 24,
      alignSelf: 'center',
    },
  },
});
