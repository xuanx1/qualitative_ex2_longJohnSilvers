const apiKey = 'dV7TydkbDMlYKUl0lg3qO5nS4wy6J2nMYt4jFIZK';
const searchBaseURL = 'https://api.si.edu/openaccess/api/v1.0/search';
const search =
  'Photograph AND unit_code:"NMNHFISHES" AND online_media_type:"Images"';
let myArray = [];
let jsonString = '';

function fetchSearchData(searchTerm) {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  let url = `${searchBaseURL}?api_key=${apiKey}&q=${encodedSearchTerm}`;
  console.log('Initial Search URL:', url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.response || typeof data.response.rowCount !== 'number') {
        throw new Error('Invalid response structure');
      }

      const pageSize = 1000;
      const numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      console.log(
        `Total Rows: ${data.response.rowCount}, Number of Queries: ${numberOfQueries}`
      );

      for (let i = 0; i < numberOfQueries; i++) {
        const rows =
          i === numberOfQueries - 1
            ? data.response.rowCount - i * pageSize
            : pageSize;
        let searchAllURL = `${searchBaseURL}?api_key=${apiKey}&q=${encodedSearchTerm}&start=${
          i * pageSize
        }&rows=${rows}`;
        console.log(`Search URL ${i + 1}:`, searchAllURL);
        fetchAllData(searchAllURL);
      }
    })
    .catch((error) => {
      console.error('Error in fetchSearchData:', error);
    });
}

function fetchAllData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.response || !Array.isArray(data.response.rows)) {
        throw new Error('Invalid data structure in fetchAllData');
      }

      data.response.rows.forEach(function (n) {
        try {
          addObject(n);
        } catch (error) {
          console.error(`Error processing object ID ${n.id}:`, error);
        }
      });
      jsonString = JSON.stringify(myArray, null, 2);
      console.log('Current Array:', myArray);
    })
    .catch((error) => {
      console.error('Error in fetchAllData:', error);
    });
}

function addObject(objectData) {
  const id = objectData.id ?? 'N/A';
  const title =
    objectData.content?.descriptiveNonRepeating?.title?.content ?? 'N/A';

    //
  const ocean = objectData.content?.freetext?.name?.find(item => item.label === 'Ocean/Sea/Gulf')?.content ?? 'N/A';
  const depth = objectData.content?.freetext?.physicalDescription?.[0]?.content ?? 'N/A';
    //
  
  const tax_class =
    objectData.content?.indexedStructured?.tax_class?.[0] ?? 'N/A';
  const tax_order =
    objectData.content?.indexedStructured?.tax_order?.[0] ?? 'N/A';
  const tax_family =
    objectData.content?.indexedStructured?.tax_family?.[0] ?? 'N/A';
  const tax_phylum =
    objectData.content?.indexedStructured?.tax_phylum?.[0] ?? 'N/A';

  const geoLocation =
    objectData.content?.indexedStructured?.geoLocation?.[0] ?? {};
  const continent = geoLocation?.L1?.content ?? 'N/A';
  const country = geoLocation?.L2?.content ?? 'N/A';
  const state = geoLocation?.L3?.content ?? 'N/A';
  // const locality = geoLocation?.Other?.content ?? 'N/A';
  const latitude = geoLocation?.points?.point?.latitude?.content ?? 'N/A';
  const longitude = geoLocation?.points?.point?.longitude?.content ?? 'N/A';

  const record_link =
    objectData.content?.descriptiveNonRepeating?.record_link ?? 'N/A';

    // remove if ocean is N/A
    if (ocean === 'N/A') {
      return;
    }

    // Convert depth range to integer by choosing a random number within the range
    let depthValue = 'N/A';
    if (depth !== 'N/A') {
      const depthRange = depth.match(/(\d+)-(\d+)/);
      if (depthRange) {
        const minDepth = parseInt(depthRange[1], 10);
        const maxDepth = parseInt(depthRange[2], 10);
        depthValue = Math.floor(Math.random() * (maxDepth - minDepth + 1)) + minDepth;
      } else {
        depthValue = parseInt(depth, 10);
      }
    }

    // Remove entries if depth is 0
    if (depthValue === 0) {
      return;
    }


  myArray.push({
    id: id,
    title: title,
    ocean: ocean,
    depth: depthValue,
    tax_class: tax_class,
    tax_order: tax_order,
    tax_family: tax_family,
    tax_phylum: tax_phylum,
    geoLocation: {
      continent: continent,
      country: country,
      state: state,
      // locality: locality,
      latitude: latitude,
      longitude: longitude,
    },
    record_link: record_link,
  });
}

fetchSearchData(search);