import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@app/components/elements';
import { router } from 'expo-router';
import ConditionalView from '@app/components/elements/conditionalView';
import Accordion from '@app/components/elements/accordion';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { useDistanceUnit } from '@app/components/hooks/distanceUnit';
import { costFormatter, formatDate, numberFormatter } from '@app/helpers/numbers';
import { useRow } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';

export default function RecordCard(props): React.ReactElement {
  const record = useRow(tables.maintenance_records, props.record_id);

  const distanceUnit = useDistanceUnit();

  return (
    <Accordion title={[formatDate(record.date as string), record.type].join(' ')}>
      <View style={pageStyles.cardRow}>
        <ConditionalView condition={record.odometer}><Text>Odometer: {numberFormatter.format(record.odometer as number)} {distanceUnit}</Text></ConditionalView>
        <ConditionalView condition={record.interval}><Text>Maintenance Interval: {numberFormatter.format(record.interval as number)} {record.interval_unit === 'dist' ? distanceUnit : record.interval_unit}</Text></ConditionalView>
        <ConditionalView condition={record.cost}><Text>Cost: {costFormatter.format(record.cost as number)}</Text></ConditionalView>
        <ConditionalView condition={record.notes}><Text>{record.notes}</Text></ConditionalView>
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
          ]}
          onSelect={(key, enable) => {
            router.push(`/vehicle/${record.car_id}/record/edit?record_id=${props.record_id}`);
            enable();
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
