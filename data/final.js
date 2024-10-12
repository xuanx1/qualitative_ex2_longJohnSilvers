const fs = require('fs');

// Reading the original JSON file
fs.readFile('groups.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parsing the JSON data
  const originalData = JSON.parse(data);

  // Extracting only the required fields
  const filteredData = originalData.map((item) => ({
    id: item.id,
    title: item.title,
    latitude: item.geoLocation.latitude.content,
    longitude: item.geoLocation.longitude.content,
    depth: item.depth,
    ocean: item.ocean,
    record_link: item.record_link,
    newGroup: item.newGroup,
  }));

  // Saving the filtered data into a new JSON file
  fs.writeFile('final.json', JSON.stringify(filteredData, null, 4), (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log("Filtered data saved to 'final.json'.");
  });
});
