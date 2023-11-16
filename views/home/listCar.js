import React from "react";
import { StyleSheet } from "react-native";
import withObservables from '@nozbe/with-observables';
import { View, Text, Pressable, FlatList } from "../../components/elements";
import { CarCard } from "./carCard";
import { tables } from "../../database/tables";

class ListCar extends React.Component {
  RenderCarCard = (car) =>
    <CarCard key={ car.id } car={ car } navigation={ this.props.navigation }/>
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
    </View>
  );
  enhance = withObservables(['cars'], ({ cars }) => ({
    cars,
  }));
  EnhancedListCars = this.enhance(this.RenderCarList);
  render() {
    return (
      <this.EnhancedListCars cars={ this.props.database.get(tables.cars).query() }/>
    );
  }
}

export { ListCar };

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
});

