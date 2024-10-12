import fs from 'fs';

// Read the JSON file
fs.readFile('data2.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading JSON:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Filtering and processing average values
    let processedData = jsonData.filter((item) => {
      const depth = item.depth;

      // Remove data in the format "0 - 0.*"
      if (depth.startsWith('0 - 0')) {
        return false;
      }

      // Convert depth ranges to average value
      const depthRange = depth.split(' - ');
      if (depthRange.length === 2) {
        let minDepth = parseFloat(depthRange[0]);
        let maxDepth = parseFloat(depthRange[1]);

        // Calculate the average and round it
        let avgDepth = Math.round((minDepth + maxDepth) / 2);
        item.depth = avgDepth.toString();
      }

      return true; // Keep the rest of the entries
    });

    // Save the processed data back to a JSON file
    fs.writeFile(
      'processed_data.json',
      JSON.stringify(processedData, null, 2),
      (err) => {
        if (err) {
          console.error('Error writing the file:', err);
        } else {
          console.log('Processed data saved to processed_data.json');
        }
      }
    );
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});
