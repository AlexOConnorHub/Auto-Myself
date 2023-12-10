import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { CarList } from './cars/carList';
import { CarForm } from './cars/carForm';
import { MaintainanceRecordList } from './maintainanceRecords/maintainanceRecordList';
import { MaintainanceRecordForm } from './maintainanceRecords/maintainanceRecordForm';

class Home extends React.Component {
  Stack = createStackNavigator();
  render() {
    return (
      <this.Stack.Navigator initialRouteName='CarList'>
        <this.Stack.Screen name='CarList' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <CarList { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='CarForm' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <CarForm { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='MaintainanceRecordList' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <MaintainanceRecordList { ...props } database={ this.props.database }/> }
        </this.Stack.Screen>
        <this.Stack.Screen name='MaintainanceRecordForm' options={ pageStyles.navigatorScreenOptions }>
          { (props) => <MaintainanceRecordForm { ...props } database={ this.props.database }/> }
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
