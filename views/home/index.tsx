import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './cars';
import EditCar from './cars/edit';
import EditRecord from './records/edit';
// import { MaintenanceRecordList } from './records';
// import { MaintenanceRecordForm } from './records/edit';
import Records from './records';
import { useTheme } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Home(): React.ReactElement {
  const theme = useTheme();
  return (
    <Stack.Navigator initialRouteName='Index' screenOptions={{
      headerTitleStyle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.colors.text,
      },
      headerBackTitleVisible: false,
    }}>
      <Stack.Screen name='Index' component={ Index } options={{ title: 'Auto Myself' }} />
      <Stack.Screen name='EditCar' component={ EditCar } options={{ title: 'Add Car' }}/>
      <Stack.Screen name='Records' component={ Records } options={{ title: 'History' }} />
      <Stack.Screen name='EditRecord' component={ EditRecord } options={{ title: 'Add Record' }} />
    </Stack.Navigator>
  );
}
