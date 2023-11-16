import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { ListCar } from './listCar';
import { CarForm } from './carForm';
import { Maintainance } from './maintainance';
import { MaintainanceRecord } from './maintainanceRecord';

class Home extends React.Component {
  Stack = createStackNavigator();
  render() {
    return (
      <this.Stack.Navigator initialRouteName='ListCar'>
        <this.Stack.Screen name='ListCar' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <ListCar { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='CarForm' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <CarForm { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='Maintainance' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <Maintainance { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='MaintainanceRecord' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <MaintainanceRecord { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
      </this.Stack.Navigator>
    );
  }
}

export { Home };

const pageStyles = StyleSheet.create({
  navigatorScreenOptions: {
    headerShown: false,
  },
});
