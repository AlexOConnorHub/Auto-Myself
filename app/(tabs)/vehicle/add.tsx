import React from 'react';
import VehicleForm from '@app/components/forms/vehicle';
import { KeyboardAwareScrollView } from '@app/components/elements';
import CarNicknameInHeader from '@app/components/hooks/carHeader';

export default function Add() {

  return (
    <KeyboardAwareScrollView>
      <CarNicknameInHeader />
      <VehicleForm />
    </KeyboardAwareScrollView>
  );
}
