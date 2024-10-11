
// This script reads the filtered_data_unique.json file and the common_names_cleaned.txt file, and adds a commonName property to each item in the data array if the title(scientificName) property matches a N= in the dictionary.

async function matchTitlesToCommonNames() {
  try {
    const dictResponse = await fetch("common_names_cleaned.txt");
    if (!dictResponse.ok) {
      throw new Error(`HTTP error! status: ${dictResponse.status}`);
    }
    const dictText = await dictResponse.text();
    const commonNamesDict = dictText.split('\n').reduce((acc, line) => {
      const [title, commonName] = line.split('=');
      acc[title.trim()] = commonName.trim();
      return acc;
    }, {});

    const dataResponse = await fetch("filtered_data_unique.json");
    if (!dataResponse.ok) {
      throw new Error(`HTTP error! status: ${dataResponse.status}`);
    }
    const data = await dataResponse.json();

    data.forEach(item => {
      if (commonNamesDict[item.title]) {
        item.commonName = commonNamesDict[item.title];
      }
    });

    console.log('Data with common names:', data);
  } catch (error) {
    console.error('Error matching titles to common names:', error);
  }
}
matchTitlesToCommonNames();
 