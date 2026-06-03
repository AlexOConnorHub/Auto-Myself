import React from 'react';
import VehicleForm from '@app/components/forms/vehicle';
import { KeyboardAwareScrollView } from '@app/components/elements';
import VehicleNicknameInHeader from '@app/components/hooks/vehicleHeader';

export default function Add() {

  return (
    <KeyboardAwareScrollView>
      <VehicleNicknameInHeader />
      <VehicleForm />
    </KeyboardAwareScrollView>
  );
}
