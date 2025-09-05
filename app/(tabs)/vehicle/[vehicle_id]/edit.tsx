import React from 'react';
import { KeyboardAwareScrollView } from '@app/components/elements';
import CarNicknameInHeader from '@app/components/carHeader';
import VehicleForm from '@app/components/forms/vehicle';

export default function Edit(): React.ReactElement {
  return (
    <KeyboardAwareScrollView>
      <CarNicknameInHeader />
      <VehicleForm />
    </KeyboardAwareScrollView>
  );
}
