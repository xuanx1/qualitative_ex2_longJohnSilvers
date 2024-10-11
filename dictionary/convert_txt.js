import * as fs from 'fs';
import * as path from 'path';


// function that match "title" from filtered_data_unique.json to N= (scientific names) in common_names_dict.txt and extract its corresponding C= (common names)

function convertTxtToTable(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const lines = data.split('\n');
    const table = lines.map(line => {
      const [scientificName, commonName] = line.split(',');
      return `n=${scientificName.trim()} c=${commonName.trim()}`;
    }).join('\n');

    fs.writeFile(outputFilePath, table, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('File has been converted successfully.');
    });
  });
}

const inputFilePath = path.join(__dirname, 'common_names_cleaned.txt');
const outputFilePath = path.join(__dirname, 'converted_table.txt');

convertTxtToTable(inputFilePath, outputFilePath);

// This script reads the common_names_cleaned.txt file and converts it into a table format with 'n=' for scientific name and 'c=' for common name. The converted table is then saved to a new file named converted_table.txt.