// // put your API key here;
// const apiKey = "";  

// // Access to individual objects by ID
// const objectBaseURL = "https://api.si.edu/openaccess/api/v1.0/content/";

// //fetches content based on id of an object.
// function fetchContentDataById(id) {
//   let url = objectBaseURL + id + "?api_key="+apiKey;
//   window
//   .fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log("Here's the content data of the specified object:", data.response);
//   })
//   .catch(error => {
//     console.log(error);
//   })
// }

// fetchContentDataById("ld1-1643414028222-1643414083560-0");


// https://collections.si.edu/search/results.htm?view=grid&fq=online_media_type%3A%22Images%22&fq=data_source%3A%22NMNH+-+Vertebrate+Zoology+-+Fishes+Division%22&q=photograph&media.CC0=true

// edanmdm:nmnhvz_5011879

// https://api.si.edu/openaccess/api/v1.0/content/ld1-1643414028222-1643414083560-0?api_key=dV7TydkbDMlYKUl0lg3qO5nS4wy6J2nMYt4jFIZK






// "online_media": {
//           "media": [
//             {
//               "guid": "http://n2t.net/ark:/65665/m354cfd86e-9eec-45b3-86d5-17fc2e6e35ef",
//               "type": "Images",
//               "idsId": "ark:/65665/m354cfd86e9eec45b386d517fc2e6e35ef",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m354cfd86e9eec45b386d517fc2e6e35ef",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m354cfd86e9eec45b386d517fc2e6e35ef/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m3b03e8807-6508-4847-9c8c-d0222d651536",
//               "type": "Images",
//               "idsId": "ark:/65665/m3b03e8807650848479c8cd0222d651536",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m3b03e8807650848479c8cd0222d651536",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m3b03e8807650848479c8cd0222d651536/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m31dd4934c-0562-43c1-aec2-c5e0e48c3396",
//               "type": "Images",
//               "idsId": "ark:/65665/m31dd4934c056243c1aec2c5e0e48c3396",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m31dd4934c056243c1aec2c5e0e48c3396",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m31dd4934c056243c1aec2c5e0e48c3396/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m30ca2400f-13f7-45e1-a2fa-2ac99b8182ce",
//               "type": "Images",
//               "idsId": "ark:/65665/m30ca2400f13f745e1a2fa2ac99b8182ce",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m30ca2400f13f745e1a2fa2ac99b8182ce",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m30ca2400f13f745e1a2fa2ac99b8182ce/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m358eda9ba-ca9f-4f8d-8fb3-1b8c1d2bdcc0",
//               "type": "Images",
//               "idsId": "ark:/65665/m358eda9baca9f4f8d8fb31b8c1d2bdcc0",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m358eda9baca9f4f8d8fb31b8c1d2bdcc0",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m358eda9baca9f4f8d8fb31b8c1d2bdcc0/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m387c5193c-f0f8-4182-81d8-79af24b78d0b",
//               "type": "Images",
//               "idsId": "ark:/65665/m387c5193cf0f8418281d879af24b78d0b",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m387c5193cf0f8418281d879af24b78d0b",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m387c5193cf0f8418281d879af24b78d0b/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m309197d7d-377b-4af0-b6d3-ddaadd5e092c",
//               "type": "Images",
//               "idsId": "ark:/65665/m309197d7d377b4af0b6d3ddaadd5e092c",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m309197d7d377b4af0b6d3ddaadd5e092c",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m309197d7d377b4af0b6d3ddaadd5e092c/90"
//             },
//             {
//               "guid": "http://n2t.net/ark:/65665/m3ef2f1e3a-0157-4de7-a857-01fca08ee922",
//               "type": "Images",
//               "idsId": "ark:/65665/m3ef2f1e3a01574de7a85701fca08ee922",
//               "usage": {
//                 "access": "CC0"
//               },
//               "content": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m3ef2f1e3a01574de7a85701fca08ee922",
//               "thumbnail": "https://ids.si.edu/ids/deliveryService/id/ark:/65665/m3ef2f1e3a01574de7a85701fca08ee922/90"
//             }
//           ],
//           "mediaCount": 8
//         },
//         "metadata_usage": {
//           "access": "CC0"



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
  
  // const tax_class =
  //   objectData.content?.indexedStructured?.tax_class?.[0] ?? 'N/A';
  // const tax_order =
  //   objectData.content?.indexedStructured?.tax_order?.[0] ?? 'N/A';
  // const tax_family =
  //   objectData.content?.indexedStructured?.tax_family?.[0] ?? 'N/A';
  // const tax_phylum =
  //   objectData.content?.indexedStructured?.tax_phylum?.[0] ?? 'N/A';


  const record_link =
    objectData.content?.descriptiveNonRepeating?.record_link ?? 'N/A';

  const thumbnail =
  objectData.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.guid ?? 'N/A';

  myArray.push({
    id: id,
    // tax_class: tax_class,
    // tax_order: tax_order,
    // tax_family: tax_family,
    // tax_phylum: tax_phylum,
    record_link: record_link,
    thumbnail: thumbnail,
  });
}

fetchSearchData(search);