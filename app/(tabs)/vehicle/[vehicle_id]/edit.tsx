import React from 'react';
import { KeyboardAvoidingView, ScrollView } from '@app/components/elements';
import CarNicknameInHeader from '@app/components/carHeader';
import VehicleForm from '@app/components/forms/vehicle';

export default function Edit(): React.ReactElement {
  return (
    <KeyboardAvoidingView>
      <CarNicknameInHeader />
      <ScrollView>
        <VehicleForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
