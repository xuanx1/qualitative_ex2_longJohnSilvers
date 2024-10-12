import fs from 'fs';

// read JSON file
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading JSON:', err);
    return;
  }

  try {
    // JSON data parsing
    const jsonData = JSON.parse(data);

    // null, undefined, N/A, empty string delete
    const filteredData = jsonData.filter((item) => {
      const hasValidId =
        item.id !== null &&
        item.id !== undefined &&
        item.id !== '' &&
        item.id !== 'N/A';
      const hasValidTitle =
        item.title !== null &&
        item.title !== undefined &&
        item.title !== '' &&
        item.title !== 'N/A';
      const hasValidTaxOrder =
        item.tax_order !== null &&
        item.tax_order !== undefined &&
        item.tax_order !== '' &&
        item.tax_order !== 'N/A';
      const hasValidTaxFamily =
        item.tax_family !== null &&
        item.tax_family !== undefined &&
        item.tax_family !== '' &&
        item.tax_family !== 'N/A';

      const geoLocation = item.geoLocation || {};
      const hasValidGeoLocation =
        geoLocation.latitude?.content !== null &&
        geoLocation.latitude?.content !== undefined &&
        geoLocation.latitude?.content !== '' &&
        geoLocation.latitude?.content !== 'N/A' &&
        geoLocation.longitude?.content !== null &&
        geoLocation.longitude?.content !== undefined &&
        geoLocation.longitude?.content !== '' &&
        geoLocation.longitude?.content !== 'N/A';
        geoLocation.continent !== null &&
        geoLocation.continent !== undefined &&
        geoLocation.continent !== '' &&
        geoLocation.continent !== 'N/A' &&
        geoLocation.country !== null &&
        geoLocation.country !== undefined &&
        geoLocation.country !== '' &&
        geoLocation.country !== 'N/A' &&
        geoLocation.state !== null &&
        geoLocation.state !== undefined &&
        geoLocation.state !== '' &&
        geoLocation.state !== 'N/A' &&
        // geoLocation.locality !== null &&
        // geoLocation.locality !== undefined &&
        // geoLocation.locality !== '' &&
        // geoLocation.locality !== 'N/A' &&
        geoLocation.latitude !== null &&
        geoLocation.latitude !== undefined &&
        geoLocation.latitude !== '' &&
        geoLocation.latitude !== 'N/A' &&
        geoLocation.longitude !== null &&
        geoLocation.longitude !== undefined &&
        geoLocation.longitude !== '' &&
        geoLocation.longitude !== 'N/A';

      const hasValidRecordLink =
        item.record_link !== null &&
        item.record_link !== undefined &&
        item.record_link !== '' &&
        item.record_link !== 'N/A';

      const hasValidDepth =
        item.depth !== null &&
        item.depth !== undefined &&
        item.depth !== '' &&
        item.depth !== 'N/A' &&
        item.depth !== '0 - 0';

      // "Ocean/Sea/Gulf" check field
      const oceanObject = item.ocean;

      // oceanObject "N/A"
      const hasValidOcean =
        oceanObject !== null &&
        oceanObject !== undefined &&
        oceanObject !== '' &&
        oceanObject !== 'N/A';

      // check if all fields are valid
      return (
        hasValidId &&
        hasValidTitle &&
        hasValidOcean &&
        hasValidDepth &&
        hasValidTaxClass &&
        hasValidTaxOrder &&
        hasValidTaxFamily &&
        hasValidGeoLocation &&
        hasValidRecordLink &&
        hasValidDepth &&
        hasValidOcean
      );
    });


    // duplicate title delete
    const uniqueTitleMap = new Map();
    filteredData.forEach((item) => {
      if (!uniqueTitleMap.has(item.title)) {
        uniqueTitleMap.set(item.title, item);
      }
    });
    const uniqueData = Array.from(uniqueTitleMap.values());

    // save filtered and unique data
    fs.writeFile('data1.json', JSON.stringify(uniqueData, null, 2), (err) => {
      if (err) {
        console.error('Error writing filtered JSON:', err);
        return;
      }
      console.log('Filtered and unique data saved successfully.');
    });
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});



