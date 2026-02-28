import React from 'react';
import { KeyboardAwareScrollView } from '@app/components/elements';
import VehicleNicknameInHeader from '@app/components/hooks/vehicleHeader';
import RecordForm from '@app/components/forms/record';

export default function Edit(): React.ReactElement {
  return (
    <KeyboardAwareScrollView>
      <VehicleNicknameInHeader />
      <RecordForm />
    </KeyboardAwareScrollView>
  );
}
