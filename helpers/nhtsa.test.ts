// export const makes: () => Promise<{
//   Count: number,
//   Message: string,
//   SearchCriteria: null,
//   Results: {
//     Make_ID: number,
//     Make_Name: string,
//   }[]
// }> = async () => {
//   const uri = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes';
//   const url = new URL(uri);
//   url.searchParams.append('format', 'json');
//   return fetch(url)
//     .then(response => response.json())
//     .then(json => json)
//     .catch(error => console.error(`${url.toString()}: ${error.toString()}`));
// };

// export const models: (data: {
//   make_id: number,
//   modelyear: number|null,
// }) => Promise<{
//   Count: number,
//   Message: string,
//   SearchCriteria: null,
//   Results: {
//     Make_ID: number,
//     Make_Name: string,
//     Model_ID: number,
//     Model_Name: string,
//   }[]
// }> = async (data) => {
//   let uri = 'https://vpic.nhtsa.dot.gov/api/vehicles';
//   if (data.modelyear > 1600 && data.make_id > 0) {
//     uri += `/GetModelsForMakeIdYear/makeId/${encodeURIComponent(data.make_id)}/modelyear/${encodeURIComponent(data.modelyear)}`;
//   } else {
//     uri += `/GetModelsForMakeId/${encodeURIComponent(data.make_id || 0)}`;
//   }
//   const url = new URL(uri);
//   url.searchParams.append('format', 'json');
//   return fetch(url)
//     .then(response => response.json())
//     .then(json => json)
//     .catch(error => console.error(`${url.toString()}: ${error.toString()}`));
// };

import { makes, models } from './nhtsa';

describe('nhtsa helpers', () =>
{
  const makeId = 440; // Example Make_ID for Toyota

  test('makes fetches list of makes', async () =>
  {
    const data = await makes();
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0)
    {
      expect(data.Results[0]).toHaveProperty('Make_ID');
      expect(data.Results[0]).toHaveProperty('Make_Name');
    }
  });

  test('models fetches list of models for a make and year', async () =>
  {
    const data = await models({ make_id: makeId, modelyear: 2020 });
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0)
    {
      expect(data.Results[0]).toHaveProperty('Make_ID', makeId);
      expect(data.Results[0]).toHaveProperty('Make_Name');
      expect(data.Results[0]).toHaveProperty('Model_ID');
      expect(data.Results[0]).toHaveProperty('Model_Name');
    }
  });

  test('models fetches list of models for a make without year', async () =>
  {
    const data = await models({ make_id: makeId, modelyear: null });
    expect(data).toHaveProperty('Count');
    expect(data).toHaveProperty('Results');
    expect(Array.isArray(data.Results)).toBe(true);
    if (data.Results.length > 0)
    {
      expect(data.Results[0]).toHaveProperty('Make_ID', makeId);
      expect(data.Results[0]).toHaveProperty('Make_Name');
      expect(data.Results[0]).toHaveProperty('Model_ID');
      expect(data.Results[0]).toHaveProperty('Model_Name');
    }
  });
});
