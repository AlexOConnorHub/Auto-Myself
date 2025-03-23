export const makes: () => Promise<{
  Count: number,
  Message: string,
  SearchCriteria: null,
  Results: {
    Make_ID: number,
    Make_Name: string,
  }[]
}> = async () => {
  let uri = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes';
  let url = new URL(uri);
  url.searchParams.append('format', 'json');
  return fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(error => console.error(`${url.toString()}: ${error.toString()}`));
}

export const models: (data: {
  make_id: number,
  modelyear: number|null,
}) => Promise<{
  Count: number,
  Message: string,
  SearchCriteria: null,
  Results: {
    Make_ID: number,
    Make_Name: string,
    Model_ID: number,
    Model_Name: string,
  }[]
}> = async (data) => {
  let uri = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  if (data.modelyear > 1600 && data.make_id > 0) {
    uri += `/GetModelsForMakeIdYear/makeId/${encodeURIComponent(data.make_id)}/modelyear/${encodeURIComponent(data.modelyear)}`;
  } else {
    uri += `/GetModelsForMakeId/${encodeURIComponent(data.make_id || 0)}`;
  }
  let url = new URL(uri);
  url.searchParams.append('format', 'json');
  return fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(error => console.error(`${url.toString()}: ${error.toString()}`));
};
