import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, FlatList } from '@app/components/elements';
import RecordCard from '@app/components/cards/record';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from 'tinybase/ui-react';
import { schema, tables } from '@app/database/schema';
import { createQueries } from 'tinybase';
import CarNicknameInHeader from '@app/components/hooks/carHeader';
import CallbackButton from '@app/components/elements/callbackButton';

export default function Records(): React.ReactElement {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();
  const store = useStore();
  const queries = createQueries(store);

  const [records, setRecords] = useState({});

  useEffect(() => {
    const toRemove = queries.addResultTableListener('vehicleRecords', (queries) => {
      setRecords(queries.getResultTable('vehicleRecords'));
    });

    queries.setQueryDefinition(
      'vehicleRecords',
      tables.maintenance_records,
      ({ select, where }) => {
        for (const column of Object.keys(schema.maintenance_records)) {
          select(column);
        }
        where('car_id', vehicle_id);
      },
    );

    return () => {
      queries.delListener(toRemove);
      queries.delQueryDefinition('vehicleRecords');
    };
  }, [vehicle_id]);

  return (
    <View style={ pageStyles.container }>
      <CarNicknameInHeader />
      <FlatList
        data={ Object.keys(records).sort((a, b) => {
          return records[a].date < records[b].date ? 1 : -1;
        }).map((key) => {
          return { ...records[key], id: key };
        }) }
        renderItem={({ item }) => <RecordCard key={ (item as { id: string }).id } record={ item } /> }
        ListEmptyComponent={
          <Text style={ pageStyles.emptyText }>No records</Text>
        }
      />
      <View style={ pageStyles.actionButtonSection }>
        <CallbackButton
          pressable={{ style: pageStyles.actionButton }}
          text={{ style: pageStyles.actionButtonText }}
          title="Add Maintenance"
          onPress={(callback) => {
            router.push(`/vehicle/${vehicle_id}/record/add`);
            callback();
          }}
        />
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  emptyText: {
    alignSelf: 'center',
  },
  actionButtonSection: {
    marginVertical: 8,
  },
  actionButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 3,
    width: '95%',
  },
  actionButtonText: {
    paddingLeft: 10,
  },
});
