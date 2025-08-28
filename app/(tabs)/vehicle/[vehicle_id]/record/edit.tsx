import React from 'react';
import { KeyboardAvoidingView, ScrollView } from '@app/components/elements';
import CarNicknameInHeader from '@app/components/carHeader';
import RecordForm from '@app/components/forms/record';

export default function Edit(): React.ReactElement {
  return (
    <KeyboardAvoidingView>
      <CarNicknameInHeader />
      <ScrollView>
        <RecordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
