import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { View } from '@app/components/elements';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { deleteFile } from '@app/helpers/delete';
import { useStore } from 'tinybase/ui-react';
import { shareAsFile } from '@app/helpers/export';
import { MergeableStore } from 'tinybase';

export default function ImageWithPreview(props) {
  const [open, setOpen] = useState(false);
  const source = { uri: props.data.local_path };
  const store = useStore() as MergeableStore;
  const close = () => setOpen(false);

  return (
    open ?
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>

          <Pressable style={styles.horizontalBand} onPress={close} />

          <Pressable onPress={close} style={styles.imageWrapper}>
            <Image source={source} style={styles.image} resizeMode="contain" />
          </Pressable>

          <View style={styles.horizontalBand}>
            <OptionButtons options={[
              { label: 'Delete', key: 'delete' },
              { label: 'Download', key: 'download' },
            ]}
            onSelect={ (newValue: string, callback: () => void) => {
              if (newValue === 'delete') {
                deleteFile(store, props.data.fileId);
                if (props.onDelete) {
                  props.onDelete(props.data.fileId);
                }
              } else if (newValue === 'download') {
                shareAsFile({ file: props.data.local_path }, { mimeType: 'image/jpeg', dialogTitle: 'Download Image' });
              }
              callback();
              close();
            } }
            />
          </View>
        </View>
      </Modal>
      :
      <Pressable onPress={() => setOpen(true)}>
        <Image source={source} style={styles.thumb} />
      </Pressable>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 120,
    height: 120,
    borderRadius: 6,
    margin: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  horizontalBand: {
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  maxAvailable: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  touchPadding: {
    margin: 8,
  },
});
