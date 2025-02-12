import React, { useEffect, useState } from "react";
import { StyleSheet, Keyboard, KeyboardType, } from "react-native";
import { Pressable, View, Text, ScrollView, TextInput, KeyboardAvoidingView } from "../../../components/elements";
import FormElement from "../../../components/formElement";
import CallbackButton from "../../../components/callbackButton";
import { convertIntervalForStorage } from "../../../helpers/functions";
import { useAddRowCallback, useCell, useDelRowCallback, useRow, useSetRowCallback, useStore } from "tinybase/ui-react";
import { useNavigation } from "@react-navigation/native";
import { tables } from "../../../database/schema";

export default function Edit(props: { route: { params: { id: string }}}): React.ReactElement {
  const navigation = useNavigation();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');

  let isNewCar = props.route.params.id === undefined;
  let formDataGenerator: { label: string, model: string, keyboardType: KeyboardType, }[] = [
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
      label: `Estimated Annual Usage (${distanceUnit})`,
      model: 'annualUsage',
      keyboardType: 'numeric',
    }
  ];

  const row = useRow(tables.cars, props.route.params.id);
  const [formData, setFormData] = useState(() => formDataGenerator.reduce((state, data) => {
    state[data.model] = row[data.model] || '';
    return state;
  }, {}));

  useEffect(() => {
    if (!isNewCar) {
      navigation.setOptions({ title: row.nickname || 'Edit Car' });
    }
  }, [row.nickname]);

  const store = useStore();
  const saveFunction = () => {
    const newRow = formDataGenerator.reduce((state, data) => {
      state[data.model] = formData[data.model];
      return state;
    }, {} as { annualUsage: string });
    newRow.annualUsage = convertIntervalForStorage(newRow.annualUsage, 'dist', distanceUnit as "Miles" | "Kilometers");
    return newRow;
  };
  const save = isNewCar ?
    useAddRowCallback(tables.cars, saveFunction, [formData], store, () => goBack(() => {}), []) :
    useSetRowCallback(tables.cars, props.route.params.id, saveFunction, [formData], store, () => goBack(() => {}), []);
  const goBack = (callback) => {
    Keyboard.dismiss();
    navigation.goBack();
    callback();
  }
  const remove = useDelRowCallback(tables.cars, props.route.params.id, store, () => goBack(() => {}), []);
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        { formDataGenerator.map((element) => (
          <FormElement label={ element.label }
            key={ element.model }>
            <TextInput
              onChangeText={(text) => { setFormData({ ...formData, [element.model]: text }); }}
              value={ formData[element.model] }
              keyboardType={ element.keyboardType } />
          </FormElement>
        )) }
        <View style={ pageStyles.view }>
          {
            !isNewCar &&
            <Pressable
              key='delete'
              onPress={ remove.bind(this) }
              style={[
                pageStyles.pressable,
              ]}>
              <Text style={pageStyles.text}>Delete</Text>
            </Pressable>
          }
          <Pressable
            key='save'
            onPress={ save.bind(this) }
            style={[
              pageStyles.pressable,
            ]}>
            <Text style={pageStyles.text}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const pageStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  view: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});
