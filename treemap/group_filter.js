import fs from 'fs';

const predatorOrders = [
  'Etmopteridae',
  'Oxynotidae',
  'Squalidae',
  'Dalatiidae',
  'Carcharhinidae',
  'Sphyrnidae',
  'Rajidae',
  'Dasyatidae',
  'Torpedinidae',
  'Hexanchidae',
  'Squatinidae',
  'Stomiidae',
  'Antennariidae',
  'Himantolophidae',
  'Ceratiidae',
  'Ogcocephalidae',
  'Gigantactinidae',
  'Thaumatichthyidae',
  'Ophichthidae',
  'Muraenidae',
  'Congridae',
  'Synaphobranchidae',
  'Nemichthyidae',
  'Macrouridae',
  'Moridae',
  'Phycidae',
  'Merlucciidae',
  'Balistidae',
  'Tetraodontidae',
  'Aulostomidae',
  'Scorpaenidae',
  'Lethrinidae',
  'Istiophoridae',
  'Serranidae',
  'Lutjanidae',
  'Pseudochromidae',
  'Pinguipedidae',
  'Plesiopidae',
  'Cirrhitidae',
  'Synanceiidae',
  'Tetrarogidae',
  'Carangidae',
  'Coryphaenidae',
  'Scombridae',
  'Fistulariidae',
  'Synodontidae',
  'Sphyraenidae',
  'Triglidae',
  'Chlopsidae',
  'Batrachoididae',
  'Belonidae',
  'Zeidae',
  'Priacanthidae',
  'Caproidae',
  'Trachinidae',
  'Gempylidae',
  'Scyliorhinidae',
  'Zoarcidae',
  'Pentanchidae',
  'Anoplogastridae',
  'Polymixiidae',
  'Bramidae',
  'Paralepididae',
  'Platycephalidae',
  'Eurypharyngidae',
  'Triakidae',
  'Aulopidae',
  'Paralichthyidae',
  'Acropomatidae',
  'Nettastomatidae',
  'Uranoscopidae',
  'Oneirodidae',
  'Setarchidae',
  'Pleuronectidae',
  'Malacanthidae',
  'Cottidae',
  'Percichthyidae',
  'Chiasmodontidae',
  'Latidae',
  'Symphysanodontidae',
  'Sebastidae',
  'Trachipteridae',
];

const preyOrders = [
  'Gobiidae',
  'Mullidae',
  'Apogonidae',
  'Ptereleotridae',
  'Atherinidae',
  'Holocentridae',
  'Pomacentridae',
  'Creediidae',
  'Haemulidae',
  'Tripterygiidae',
  'Kuhliidae',
  'Epigonidae',
  'Myctophidae',
  'Clupeidae',
  'Gerreidae',
  'Callionymidae',
  'Microdesmidae',
  'Ammodytidae',
  'Grammatidae',
  'Xenisthmidae',
  'Percophidae',
  'Pempheridae',
  'Albulidae',
  'Engraulidae',
  'Emmelichthyidae',
  'Caesionidae',
  'Sternoptychidae',
  'Trichonotidae',
  'Chlorophthalmidae',
  'Nomeidae',
  'Hemiramphidae',
  'Phosichthyidae',
  'Melanonidae',
  'Stephanoberycidae',
  'Gibberichthyidae',
  'Notosudidae',
  'Atherinopsidae',
  'Cepolidae',
  'Ariommatidae',
  'Gonostomatidae',
  'Draconettidae',
  'Polynemidae',
  'Sciaenidae',
  'Sparidae',
  'Labridae',
];

const leftOrders = [
  'Liparidae',
  'Bythitidae',
  'Syngnathidae',
  'Acanthuridae',
  'Monacanthidae',
  'Scaridae',
  'Diodontidae',
  'Ostraciidae',
  'Pomacanthidae',
  'Chaetodontidae',
  'Kyphosidae',
  'Soleidae',
  'Gobiesocidae',
  'Blenniidae',
  'Ophidiidae',
  'Mugilidae',
  'Labrisomidae',
  'Bothidae',
  'Zanclidae',
  'Chaenopsidae',
  'Moringuidae',
  'Centriscidae',
  'Dactylopteridae',
  'Achiridae',
  'Dactyloscopidae',
  'Opistognathidae',
  'Chaunacidae',
  'Ipnopidae',
  'Siganidae',
  'Rhinochimaeridae',
  'Caristiidae',
  'Parazenidae',
  'Triacanthodidae',
  'Carapidae',
  'Menidae',
  'Chanidae',
  'Cichlidae',
  'Oreosomatidae',
  'Narcinidae',
  'Diretmidae',
  'Peristediidae',
  'Halosauridae',
  'Macroramphosidae',
  'Notacanthidae',
  'Pholidichthyidae',
  'Grammicolepididae',
  'Eleotridae',
  'Terapontidae',
  'Ephippidae',
  'Aploactinidae',
  'Nemipteridae',
  'Samaridae',
  'Isonidae',
  'Solenostomidae',
  'Aracanidae',
  'Zenionidae',
  'Centrolophidae',
  'Cryptacanthodidae',
  'Bembridae',
  'Cynoglossidae',
  'Clinidae',
  'Trachichthyidae',
  'Echeneidae',
  'Radiicephalidae',
  'Branchiostomatidae',
  'Colocongridae',
  'Evermannellidae',
];

// Read the JSON file
fs.readFile('depth.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading JSON:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Add newGroup based on tax_family
    const updatedData = jsonData.map((item) => {
      let newGroup = 'Other'; // Default value

      if (predatorOrders.includes(item.tax_family)) {
        newGroup = 'Predator';
      } else if (preyOrders.includes(item.tax_family)) {
        newGroup = 'Prey';
      } else if (leftOrders.includes(item.tax_family)) {
        newGroup = 'Others'; // Other category
      }

      return { ...item, newGroup }; // Add the new field
    });

    // Save the updated data back to a new JSON file
    fs.writeFile(
      'groups.json',
      JSON.stringify(updatedData, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error('Error writing updated JSON:', writeErr);
          return;
        }

        console.log('JSON file has been successfully updated.');
      }
    );
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
