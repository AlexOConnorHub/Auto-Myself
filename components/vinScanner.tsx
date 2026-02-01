import { StyleSheet } from 'react-native';
import { useCameraDevice } from 'react-native-vision-camera';
import { VinFromFragments } from '@app/helpers/vin';
import { Barcode, useBarcodeScanner } from '@mgcrea/vision-camera-barcode-scanner';
import { Worklets } from 'react-native-worklets-core';
import Camera from './camera';
import { View } from './elements';

export default function VinScanner(props) {
  const device = useCameraDevice('back');
  const VinFragments = new VinFromFragments();

  const processScannedText = Worklets.createRunOnJS((newFragment: string) => {
    VinFragments.addFragment(newFragment);
    const vin = VinFragments.getVin();
    if (vin !== null) {
      props.callback(vin);
    }
  });

  const { props: cameraProps } = useBarcodeScanner({
    barcodeTypes: ['code-128', 'code-39', 'qr', 'data-matrix'],
    onBarcodeScanned: (barcodes: Barcode[]) => {
      'worklet';
      for (const { value } of barcodes) {
        processScannedText(value);
      }
    },
  });

  return (
    <View>
      <Camera device={device} isActive={true}
        style={StyleSheet.absoluteFill}
        {...cameraProps}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={pageStyles.barcodeGoal} />
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  barcodeGoal: {
    borderColor: 'white',
    borderWidth: 2,
    height: 80,
    marginTop: '15%',
    marginHorizontal: 20,
  },
});
