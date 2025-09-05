import React from 'react';
import { KeyboardAwareScrollView } from '@app/components/elements';
import CarNicknameInHeader from '@app/components/carHeader';
import RecordForm from '@app/components/forms/record';

export default function Edit(): React.ReactElement {
  return (
    <KeyboardAwareScrollView>
      <CarNicknameInHeader />
      <RecordForm />
    </KeyboardAwareScrollView>
  );
}
