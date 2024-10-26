// Explained, corrected, and refined

// Tree map by oceans, depth, predator/prey (archetype)
// Function to match "title" from filtered_data_unique.json to N= (scientific names) in common_names_dict.txt and extract its corresponding C= (common names)
// Load JSON and create a treemap with the data

// ADD background fishes swimming + add intro page at the top to scroll (prompt animation) down to the treemap
// ADD animation when zoom in + out

import { predatorOrders, preyOrders, leftOrders } from './data/group_filter.js';

const Predator = predatorOrders;
const Prey = preyOrders;
const Others = leftOrders;
const archetype = [Predator, Prey, Others];

// Background color for the body - to add "landing page" + prompt to scroll down + parallax land with people playing volleyball
d3.select('body').style(
  'background',
  'linear-gradient(to bottom, #aba398 20%, #555861 80%)'
);

const possiblePaths = [
  'https://github.com/user-attachments/assets/cd20375b-6246-4af2-ac05-82a7c6d82719',
  'https://github.com/user-attachments/assets/a598e241-1452-436a-a9cd-427b5a0f0e67',
  'https://github.com/user-attachments/assets/5e380432-852d-4f0c-8d8c-a3d65ee23a95',
  'https://github.com/user-attachments/assets/132901dd-eeeb-4711-89d1-c77b6c1113c9',
  'https://github.com/user-attachments/assets/b309da2e-eb60-4333-ba9c-ced71e8b6cb4',
];

const possibleColors = [
  '#ff9999',
  '#66b3ff',
  '#99ff99',
  '#ffcc99',
  '#c2c2f0',
  '#ffb3e6',
];

// Function to randomize fish paths, sizes, colors, and animate them
function createSwimmingFish() {
  const fishContainer = d3
    .select('body')
    .append('div')
    .attr('class', 'fish-container')
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)
    .style('width', '100%')
    .style('height', '100%')
    .style('pointer-events', 'none')
    .style('z-index', -1); // Fishes to be behind the treemap

  for (let i = 0; i < 10; i++) {
    const fish = fishContainer
      .append('img')
      .attr(
        'src',
        possiblePaths[Math.floor(Math.random() * possiblePaths.length)]
      )
      .style('position', 'absolute')
      .style('width', `${Math.random() * 50 + 70}px`) // Randomize size
      .style('height', 'auto')
      .style('top', `${Math.random() * 100}%`)
      .style('left', `${Math.random() * 100}%`)
      .style('filter', `hue-rotate(${Math.random() * 360}deg)`) // Randomize color
      .style('transition', 'transform 5s linear');

    animateFish(fish);
  }
}

function animateFish(fish) {
  const newTop = `${Math.random() * 100}%`;
  const newLeft = `${Math.random() * 100}%`;

  fish.style('transform', `translate(${newLeft}, ${newTop})`);

  setTimeout(() => animateFish(fish), 5000);
}

createSwimmingFish();

// Rollup and fetch data
async function fetchData() {
  try {
    // Load the data
    const response = await d3.json(
      './data/[TO_BE_USED]updated_final_copy.json'
    );

    // Group data by ocean and depth
    const groupedData = d3.rollups(
      response,
      (v) => ({
        count: v.length, // Number of items in the group
        avgDepth: d3.mean(v, (d) => d.depth), // Average depth of the group
      }),
      (d) => {
        let ocean = d.ocean.split(' ')[0].replace(/,/g, '');
        if (ocean === 'South') ocean = 'Southern';
        if (ocean === 'North') ocean = 'North Sea';
        return ocean === 'North Sea' ? ocean : ocean + ' Ocean';
      },
      (d) => d.newGroup
    );

    const data = groupedData;

    // Create an object to hold the number of Prey, Predator, and Others in each ocean
    const oceanGroupCounts = {};

    // Iterate over the response data
    response.forEach((d) => {
      // change the ocean name to match the oceanGroupCounts object
      let ocean = d.ocean.split(' ')[0].replace(/,/g, '');
      if (ocean === 'South') ocean = 'Southern';
      if (ocean === 'North') ocean = 'North Sea';
      ocean = ocean === 'North Sea' ? ocean : ocean + ' Ocean';

      const group = d.newGroup;

      if (!['Prey', 'Predator', 'Others'].includes(group)) {
        console.warn(`Unexpected group value: ${group}`);
        return;
      }
      // Reset if the ocean doesn't exist in the object
      if (!oceanGroupCounts[ocean]) {
        oceanGroupCounts[ocean] = { Prey: 0, Predator: 0, Others: 0, total: 0 };
      }

      // Increase the count by group
      oceanGroupCounts[ocean][group]++;

      oceanGroupCounts[ocean].total++;
    });

    // Treemap title
    const body = d3.select('body').style('padding', '20px');

    const title = body
      .append('h1')
      .style('font-size', '32px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', '#098094')
      .style('text-align', 'center')
      .style('padding-bottom', '20px')
      .text('Helloooo Neighbours...');

    // Fade-in animation for title
    title.style('opacity', 0).transition().duration(1000).style('opacity', 1);

    // Description paragraph
    const description = body
      .append('div')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('padding-bottom', '30px')
      .append('p')
      .style('max-width', '600px')
      .style('font-size', '15px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', 'white')
      .style('text-align', 'center')
      .style('line-height', '1.6') // Increase leading
      .html(`This treemap visualizes the number of species of fish in each ocean. The oceans are represented by the top-level rectangles, and the archetypes are represented by the smaller rectangles within each ocean. The size of each rectangle corresponds to the number of species based on the total number of fishes in the database, currently totaling at 
      <strong style="color: #098094;">${response.length}</strong> species.`);

    // Add fade-in animation for the description
    description
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Convert the data to a hierarchical format
    const root = d3
      .hierarchy([null, data], ([, value]) => value)
      .sum(([, value]) => value.count)
      .sort((a, b) => b.value - a.value);

    // Set up the dimensions of the treemap
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const margin = { top: 20, right: 0, bottom: 20, left: 0 };

    // Create the treemap layout
    const treemapLayout = d3
      .treemap()
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ])
      .padding(2.5);

    // Update the size of the SVG element
    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('margin', '0 auto');

    treemapLayout(root);

    // Create a group for each node
    const nodes = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Add fade-in and scale animation for the treemap nodes
    nodes
      .style('opacity', 0)
      .attr('transform', (d) => `translate(${d.x0},${d.y0}) scale(0.1)`)
      .transition()
      .duration(1000)
      .style('opacity', 0.9)
      .attr('transform', (d) => `translate(${d.x0},${d.y0}) scale(1)`);

    // Define colorScale
    const colourScale = d3
      .scaleOrdinal()
      .domain(['Pacific', 'Atlantic', 'Indian', 'South', 'North', 'Arctic'])
      .range([
        '#fec76f',
        '#f5945c',
        '#b3be62',
        '#6dbfb8',
        '#be95be',
        '#72757c',
      ]);

    // // Append a rectangle for each node
    // nodes
    //   .append('rect')
    //   .attr('width', (d) => d.x1 - d.x0)
    //   .attr('height', (d) => d.y1 - d.y0)
    //   .attr('fill', (d) => {
    //     const parentColor = colourScale(d.parent.data[0]);
    //     const shade = d3
    //       .scaleLinear()
    //       .domain([0, d.parent.children.length - 1])
    //       .range([0.1, 0.9]);
    //     return d3
    //       .color(parentColor)
    //       .darker(shade(d.parent.children.indexOf(d)));
    //   });

    const oceanGroupColors = {
      'Pacific Ocean': {
        Prey: '#EBBB6E',
        Predator: '#B49057',
        Others: '#C79F5E',
      },
      'Atlantic Ocean': {
        Prey: '#C97D54',
        Predator: '#E3915E',
        Others: '#AA6A47',
      },
      'Indian Ocean': {
        Prey: '#7D864B',
        Predator: '#8F9953',
        Others: '#A4AE60',
      },
      'Arctic Ocean': {
        Predator: '#5E6168',
      },
      'North Sea': {
        Predator: '#AC8CAF',
        Others: '#846A87',
      },
      'Southern Ocean': {
        Predator: '#508782',
        Others: '#67AFAB',
      },
    };

    // // Append a rectangle for each node
    // nodes
    //   .append('rect')
    //   .attr('width', (d) => d.x1 - d.x0)
    //   .attr('height', (d) => d.y1 - d.y0)
    //   .attr('fill', (d) => {
    //     const parentColor = colourScale(d.parent.data[0]);
    //     const shade = d3
    //       .scaleLinear()
    //       .domain([0, d.parent.children.length - 1])
    //       .range([0.1, 0.9]);
    //     return d3
    //       .color(parentColor)
    //       .darker(shade(d.parent.children.indexOf(d)));
    //   });

    // Append a rectangle for each node
    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => {
        const ocean = d.parent.data[0];
        const group = d.data[0];

        // Get the colors of the corresponding oceans and groups from oceanGroupColors.
        const groupColors = oceanGroupColors[ocean];
        if (groupColors && groupColors[group]) {
          return groupColors[group];
        } else {
          // Set default color if no color is defined (e.g., gray)
          return '#cccccc';
        }
      });

    // Append text labels
    nodes
      .append('text')
      .attr('x', 10)
      .attr('y', 25)
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('fill', 'white')
      .style('font-size', (d) => {
        const fontSize = Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 16);
        return fontSize < 10 ? '0px' : `${fontSize}px`;
      })
      .text((d) => d.data[0])
      .each(function (d) {
        const bbox = this.getBBox();
        if (bbox.width > d.x1 - d.x0 || bbox.height > d.y1 - d.y0) {
          d3.select(this).remove();
        }
      });

    // Add Legend for oceans
    const legend = body
      .append('div')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('margin-top', '5px');

    // Sort oceans by number of species in descending order
    const ocean = data.sort((a, b) => b[1].count - a[1].count).map((d) => d[0]);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(ocean)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('margin-right', (d, i) =>
        i === ocean.length - 1 ? '0px' : '40px'
      );

    // Add fade-in animation for the legend items
    legendItems
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    legendItems
      .append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('background-color', (d) => colourScale(d))
      .style('margin-right', '10px');

    legendItems
      .append('span')
      .style('font-size', '14px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', 'white')
      .text((d) => d);

    // Add hover effect to display number of species
    nodes
      .on('mouseover', function (event, d) {
        d3.select(this)
          .select('rect')
          .attr('stroke', '#ac513b')
          .attr('stroke-width', 4);

        const ocean = d.parent.data[0];
        const group = d.data[0];
        const hoveredGroup = group;

        // avgDepth calculation
        const avgDepth = data
          .find(([o]) => o === ocean)[1]
          .find(([g]) => g === group)[1].avgDepth;

        // formattedAvgDepth
        const formattedAvgDepth = avgDepth
          ? Math.round(avgDepth).toLocaleString()
          : 'N/A';

        // Get counts and totals for each group in that ocean
        const counts = oceanGroupCounts[ocean];
        const total = counts.total;

        // Calculate the percentages for each group (sum to 10)
        const totalRatio = 10;

        let preyRatio = total > 0 ? (counts.Prey / total) * totalRatio : 0;
        let predatorRatio =
          total > 0 ? (counts.Predator / total) * totalRatio : 0;
        let othersRatio = total > 0 ? (counts.Others / total) * totalRatio : 0;

        // Rounding without decimals
        preyRatio = Math.round(preyRatio);
        predatorRatio = Math.round(predatorRatio);
        othersRatio = Math.round(othersRatio);

        //  Calculate totals after rounding
        let ratioSum = preyRatio + predatorRatio + othersRatio;

        // Adjust the total to equal 10
        if (ratioSum !== totalRatio) {
          const difference = totalRatio - ratioSum;
          // Fit totals by adding or subtracting differences to the group with the largest proportion
          const ratios = [
            { name: 'Prey', value: preyRatio },
            { name: 'Predator', value: predatorRatio },
            { name: 'Others', value: othersRatio },
          ];

          // Sort the ratios in descending order by value.
          ratios.sort((a, b) => b.value - a.value);

          // add the difference to the largest ratio
          ratios[0].value += difference;

          // reassign the modified ratios to variables
          preyRatio = ratios.find((r) => r.name === 'Prey').value;
          predatorRatio = ratios.find((r) => r.name === 'Predator').value;
          othersRatio = ratios.find((r) => r.name === 'Others').value;
        }

        // color the bars
        let barColors = oceanGroupColors[ocean];

        // set default color if barColors is undefined
        if (!barColors) {
          console.warn(
            `No colors defined for ocean: ${ocean}. Using default colors.`
          );
          barColors = {
            Prey: '#cccccc',
            Predator: '#999999',
            Others: '#666666',
          };
        }
        // Set the color for each group
        const preyColor = barColors.Prey || '#cccccc';
        const predatorColor = barColors.Predator || '#999999';
        const othersColor = barColors.Others || '#666666';

        // Style the text for each group
        const preyTextStyle =
          hoveredGroup === 'Prey' ? 'font-weight: bold; color: black;' : '';
        const predatorTextStyle =
          hoveredGroup === 'Predator' ? 'font-weight: bold; color: black;' : '';
        const othersTextStyle =
          hoveredGroup === 'Others' ? 'font-weight: bold; color: black;' : '';
        //  maximum width of the bar
        const maxBarWidth = 360;

        // calculate the width of the bar for each proportion
        const preyBarWidth = (preyRatio / totalRatio) * maxBarWidth;
        const predatorBarWidth = (predatorRatio / totalRatio) * maxBarWidth;
        const othersBarWidth = (othersRatio / totalRatio) * maxBarWidth;

        // *Create a tooltip element
        const tooltip = body
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('font-size', '14px')
          .style('font-family', "'Open Sans', sans-serif")
          .style('background', 'white')
          .style('border', '2px solid #72757c')
          .style('padding', '10px')
          .style('pointer-events', 'none')
          .style('opacity', '0.9')
          .style('left', `${event.pageX + 20}px`)
          .style('top', `${event.pageY + 20}px`)
          .style('max-width', '400px');

        // create tooltip content
        tooltip.html(`
            <div style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">${ocean}</div>
            <div style="margin-bottom: 5px;">
              <strong>Population</strong>
              <span style="margin-left: 20px;">${d.value}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Average Depth</strong>
              <span style="margin-left: 20px;">${formattedAvgDepth} m</span>
            </div>
            <div style="width: ${maxBarWidth}px; display: flex; align-items: center;">
              <div style="display: flex; flex-direction: row; width: 100%;">
                ${
                  counts.Prey > 0
                    ? `
                <div style="width: ${preyBarWidth}px; background-color: ${preyColor}; color: white; text-align: center; height: 20px; line-height: 20px; margin-right: 2px;">
                  <span style="${preyTextStyle}">Prey (${preyRatio})</span>
                </div>`
                    : ''
                }
                ${
                  counts.Predator > 0
                    ? `
                <div style="width: ${predatorBarWidth}px; background-color: ${predatorColor}; color: white; text-align: center; height: 20px; line-height: 20px; margin-right: 2px;">
                  <span style="${predatorTextStyle}">Predator (${predatorRatio})</span>
                </div>`
                    : ''
                }
                ${
                  counts.Others > 0
                    ? `
                <div style="width: ${othersBarWidth}px; background-color: ${othersColor}; color: white; text-align: center; height: 20px; line-height: 20px;">
                  <span style="${othersTextStyle}">Others (${othersRatio})</span>
                </div>`
                    : ''
                }
              </div>
            </div>
          `);
      })
      .on('mouseout', function () {
        d3.select(this).select('rect').attr('stroke', 'none');
        body.select('.tooltip').remove();
      });
    // Add footer and name
    const footer = d3
      .select('body')
      .append('footer')
      .style('font-size', '12px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', 'white')
      .style('text-align', 'center')
      .style('padding-top', '50px')
      .text(
        'Major Studio I | Exercise 2: Qualitative Representation | Hyeonjeong | Xuan'
      );
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

fetchData();
