import { makes, models, vinDecode } from './nhtsa';

describe('nhtsa helpers', () => {
  const makeId = 440; // Example Make_ID for Toyota

  test('makes', async () => {
    const data = await makes();
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0) {
      expect(data.Results[0]).toHaveProperty('Make_ID');
      expect(data.Results[0]).toHaveProperty('Make_Name');
    }
  });

  test('models', async () => {
    let data = await models({ make_id: makeId, modelyear: 2020 });
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0) {
      expect(data.Results[0]).toHaveProperty('Make_ID', makeId);
      expect(data.Results[0]).toHaveProperty('Make_Name');
      expect(data.Results[0]).toHaveProperty('Model_ID');
      expect(data.Results[0]).toHaveProperty('Model_Name');
    }

    data = await models({ make_id: makeId });
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0) {
      expect(data.Results[0]).toHaveProperty('Make_ID', makeId);
      expect(data.Results[0]).toHaveProperty('Make_Name');
      expect(data.Results[0]).toHaveProperty('Model_ID');
      expect(data.Results[0]).toHaveProperty('Model_Name');
    }
  });

  test('vinDecode', async () => {
    const data = await vinDecode('JN8AZ1FYXDW301248');
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0) {
      expect(data.Results[0]).toHaveProperty('MakeID');
      expect(data.Results[0]).toHaveProperty('ModelID');
      expect(data.Results[0]).toHaveProperty('ModelYear');
    }
  });
});
