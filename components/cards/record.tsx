import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@app/components/elements';
import { router } from 'expo-router';
import ConditionalText from '@app/components/conditionalText';
import Accordion from '../accordion';
import { OptionButtons } from '../optionButtons';
import { useDistanceUnit } from '../distanceUnit';
import { costFormatter, formatDate, numberFormatter } from '@app/helpers/numbers';

export default function RecordCard(props): React.ReactElement {
  const record = props.record;

  const distanceUnit = useDistanceUnit();

  return (
    <Accordion title={[formatDate(record.date), record.type].join(' ')}>
      <View style={pageStyles.cardRow}>
        <ConditionalText condition={record.odometer}>Odometer: {numberFormatter.format(record.odometer)} {distanceUnit}</ConditionalText>
        <ConditionalText condition={record.interval}>Maintenance Interval: {numberFormatter.format(record.interval)} {record.interval_unit === 'dist' ? distanceUnit : record.interval_unit}</ConditionalText>
        <ConditionalText condition={record.cost}>Cost: {costFormatter.format(record.cost)}</ConditionalText>
        <ConditionalText condition={record.notes}>{record.notes}</ConditionalText>
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
          ]}
          onSelect={() => {
            router.push(`/vehicle/${record.car_id}/record/edit?record_id=${record.id}`);
          }}
          highlightAll={true}
        />
      </View>
    </Accordion>
  );
}

const pageStyles = StyleSheet.create({
  cardRow: {
    marginHorizontal: 10,
  },
});
