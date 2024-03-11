import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '../../components/elements';
import { OptionButtons } from '../../components/optionButtons';
import { kvStorage } from '../../helpers/kvStorage';
import { FormElement } from '../../components/formElement';
import { SettingsContext } from '../../helpers/settingsContext';
/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Settings extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <View style={pageStyles.container}>
        <Text style={pageStyles.header}>Settings</Text>
        <FormElement label="Distance Unit">
          <OptionButtons
            options={[
              { label: 'Miles', key: 'Miles' },
              { label: 'Kilometers', key: 'Kilometers' },
            ]}
            value={ this.context.distanceUnit }
            onSelect={ this.toggleDistanceUnit }
          />
        </FormElement>
        <FormElement label="Theme">
          <OptionButtons
            options={[
              { label: 'Dark', key: 'dark' },
              { label: 'Light', key: 'light' },
            ]}
            value={ this.context.colors.key }
            onSelect={ this.toggleTheme }
          />
        </FormElement>
      </View>
    );
  }
  toggleDistanceUnit(key) {
    kvStorage.set('display.units', key);
  }
  toggleTheme(key) {
    kvStorage.set('display.theme', key);
  }
}

export { Settings };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
