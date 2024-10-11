import fs from 'fs';

// read Json file
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading JSON:', err);
    return;
  }

  try {
    // JSON data parsing
    const jsonData = JSON.parse(data);

    // null, undefined, N/A delete
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
      
        // 
      const hasValidOcean =
        item.ocean !== null &&
        item.tioceantle !== undefined &&
        item.ocean !== '' &&
        item.ocean !== 'N/A';

      const hasValidDepth =
        item.depth !== null &&
        item.depth !== undefined &&
        item.depth !== '' &&
        item.depth !== 'N/A';
        // 
      
      const hasValidTaxClass =
        item.tax_class !== null &&
        item.tax_class !== undefined &&
        item.tax_class !== '' &&
        item.tax_class !== 'N/A';
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
      const hasValidTaxPhylum =
        item.tax_phylum !== null &&
        item.tax_phylum !== undefined &&
        item.tax_phylum !== '' &&
        item.tax_phylum !== 'N/A';

      const geoLocation = item.geoLocation || {};
      const hasValidGeoLocation =
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

      // check if all fields are valid
      return (
        hasValidId &&
        hasValidTitle &&
        hasValidOcean &&
        hasValidDepth &&
        hasValidTaxClass &&
        hasValidTaxOrder &&
        hasValidTaxFamily &&
        hasValidTaxPhylum &&
        hasValidGeoLocation &&
        hasValidRecordLink
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
    fs.writeFile(
      'filtered_data_unique.json',
      JSON.stringify(uniqueData, null, 2),
      (err) => {
        if (err) {
          console.error('Error writing filtered JSON:', err);
          return;
        }
        console.log('Filtered and unique data saved successfully.');
      }
    );
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});



