import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Text, View } from '@app/components/elements';
import { router } from 'expo-router';
import ConditionalView from '@app/components/elements/conditionalView';
import Accordion from '@app/components/elements/accordion';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { useDistanceUnit } from '@app/components/hooks/distanceUnit';
import { costFormatter, formatDate, numberFormatter } from '@app/helpers/numbers';
import { useRow, useSliceRowIds, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import { MergeableStore } from 'tinybase';
import ImageWithPreview from '@app/components/elements/imageWithPreview';

export default function RecordCard(props): React.ReactElement {
  const record_id = props.record_id;
  const store = useStore() as MergeableStore;
  const record = useRow(tables.maintenance_records, record_id);

  const distanceUnit = useDistanceUnit();

  const fileIds = useSliceRowIds('byRecord', record_id);
  const filesMapped = fileIds.map((id) => ({ fileId: id, local_path: store.getCell(tables.files, id, 'local_path'), related_table: store.getCell(tables.files, id, 'related_table') }))
    .filter((file_data) => file_data.related_table === tables.maintenance_records);

  return (
    <Accordion title={[formatDate(record.date as string), record.type].join(' ')}>
      <View style={pageStyles.cardRow}>
        <ConditionalView condition={record.odometer}><Text>Odometer: {numberFormatter.format(record.odometer as number)} {distanceUnit}</Text></ConditionalView>
        <ConditionalView condition={record.interval}><Text>Maintenance Interval: {numberFormatter.format(record.interval as number)} {record.interval_unit === 'dist' ? distanceUnit : record.interval_unit}</Text></ConditionalView>
        <ConditionalView condition={record.cost}><Text>Cost: {costFormatter.format(record.cost as number)}</Text></ConditionalView>
        <ConditionalView condition={record.notes}><Text>{record.notes}</Text></ConditionalView>

        <FlatList
          horizontal={true}
          keyExtractor={(_, index) => `${index}`}
          data={filesMapped}
          renderItem={({ item }) => <ImageWithPreview data={item} />}
        />
        <OptionButtons
          options={[
            { label: 'Edit', key: 'edit' },
          ]}
          onSelect={(key, enable) => {
            router.push(`/vehicle/${record.vehicle_id}/record/edit?record_id=${props.record_id}`);
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
