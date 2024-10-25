//explained, corrected and refined with vscode copilot

// tree map, by oceans, predator/prey (archetype), then depth(upon zoom)
// function that match "title" from filtered_data_unique.json to N= (scientific names) in common_names_dict.txt and extract its corresponding C= (common names)
// load json, create a treemap with the data

const Predator = predatorOrders;
const Prey = preyOrders;
const Others = leftOrders;
const archetype = [Predator, Prey, Others];

import { predatorOrders, preyOrders, leftOrders } from './data/group_filter.js';

// Loading screen --------------------------------------------
const loadingScreen = d3
  .select('body')
  .append('div')
  .attr('class', 'loading-screen')
  .style('position', 'fixed')
  .style('top', 0)
  .style('left', 0)
  .style('width', '100%')
  .style('height', '100%')
  .style('background', '#373737')
  .style('display', 'flex')
  .style('justify-content', 'center')
  .style('align-items', 'center')
  .style('z-index', 1000);

// Add text clipping mask and loading wave animation
const waveText = loadingScreen
  .append('div')
  .style('color', 'white')
  .style('font-size', '18px')
  .style('font-family', "'Open Sans', sans-serif")
  .style('font-weight', 'regular')
  .style('position', 'relative')
  .style('overflow', 'hidden')
  .style('width', '200px')
  .style('height', '50px')
  .style('text-align', 'center')
  .style('line-height', '50px')
  .style('padding', '10px')
  .text('Assembling the Sea');

const wave = waveText
  .append('div')
  .style('position', 'absolute')
  .style('top', '0')
  .style('left', '-200px')
  .style('width', '200px')
  .style('height', '6px')
  .style(
    'background',
    'linear-gradient(to right, #00c6ff 0%, rgba(255, 255, 255, 0.2) 50%, #0072ff 100%)'
  )
  .style('border-radius', '10px') // Add rounded edges
  .style('animation', 'wave 2s infinite');

d3.select('head').append('style').text(`
  @keyframes wave {
    0% { left: -200px; }
    50% { left: 100px; }
    100% { left: -200px; }
  }
`);
//--------------------------------------------

// Background color for the body - to add "landing page" + prompt to scroll down + parallelax land with people playing volleyball --------------------------------------------
d3.select('body').style(
  'background',
  'linear-gradient(to bottom, #a8a4a3 20%, #555861 90%)'
);

const possiblePaths = [
  `https://github.com/user-attachments/assets/cd20375b-6246-4af2-ac05-82a7c6d82719`,
  `https://github.com/user-attachments/assets/a598e241-1452-436a-a9cd-427b5a0f0e67`,
  `https://github.com/user-attachments/assets/5e380432-852d-4f0c-8d8c-a3d65ee23a95`,
  `https://github.com/user-attachments/assets/132901dd-eeeb-4711-89d1-c77b6c1113c9`,
  `https://github.com/user-attachments/assets/b309da2e-eb60-4333-ba9c-ced71e8b6cb4`,
];

const possibleColors = [
  '#ff9999',
  '#66b3ff',
  '#99ff99',
  '#ffcc99',
  '#c2c2f0',
  '#ffb3e6',
];

// Function to randomize fish paths, sizes, colors and animate them
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
    .style('z-index', -1); // fishes to be behind the treemap

  for (let i = 0; i < 10; i++) {
    const fish = fishContainer
      .append('img')
      .attr(
        'src',
        possiblePaths[Math.floor(Math.random() * possiblePaths.length)]
      )
      .style('position', 'absolute')
      .style('width', `${Math.random() * 50 + 70}px`) // Randomise size
      .style('height', 'auto')
      .style('top', `${Math.random() * 100}%`)
      .style('left', `${Math.random() * 100}%`)
      .style('filter', `hue-rotate(${Math.random() * 360}deg)`) // Randomise color
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
//--------------------------------------------

// Rollup --------------------------------------------
// Remove loading screen 2s after data is fetched, then rollup
async function fetchData() {
  setTimeout(() => {
    loadingScreen.transition().duration(800).style('opacity', 0).remove();
  }, 2000);
}
{
  try {
    // Load the data
    const response = await d3.json(
      './data/[TO_BE_USED]updated_final_copy.json'
    );

    //Depth range
    function getDepthRange(depth) {
      if (depth <= 100) {
        // 0-100 meters: 20-meter increments
        if (depth <= 20) return '0-20m';
        else if (depth <= 40) return '20-40m';
        else if (depth <= 60) return '40-60m';
        else if (depth <= 80) return '60-80m';
        else return '80-100m';
      } else if (depth <= 1000) {
        // 100-1000 meters: 100-meter increments
        const lowerBound = Math.floor(depth / 100) * 100;
        return `${lowerBound}-${lowerBound + 100}m`;
      } else {
        //  Over 1000 meters: Break into 500-meter increments
        const lowerBound = Math.floor(depth / 500) * 500;
        return `${lowerBound}-${lowerBound + 500}m`;
      }
    }

    // Group data by ocean and depth, the ocean is the first level of the hierarchy, and the depth type is the second level
    const data = d3.rollup(
      response,
      (v) => v.length,
      (d) => {
        let ocean = d.ocean.split(' ')[0].replace(/,/g, '');
        if (ocean === 'South') ocean = 'Southern';
        if (ocean === 'North') ocean = 'North Sea';
        return ocean === 'North Sea' ? ocean : ocean + ' Ocean';
      },
      (d) => d.newGroup
      //d => d.depth //to be add during phase 2
    );

    console.log('Predator/Prey by Oceans, then Depths:');
    console.log(data);

    // Phase 2: Group data by depth
    // Pacific

    const pacificPredator = response.filter(
      (d) => d.ocean.includes('Pacific') && d.newGroup === 'Predator'
    );

    const pPredator = d3.rollup(
      pacificPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const pacificPrey = response.filter(
      (d) => d.ocean.includes('Pacific') && d.newGroup === 'Prey'
    );
    const pPrey = d3.rollup(
      pacificPrey,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const pacificOthers = response.filter(
      (d) => d.ocean.includes('Pacific') && d.newGroup === 'Others'
    );

    const pOthers = d3.rollup(
      pacificOthers,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(pPredator);
    console.log(pPrey);
    console.log(pOthers);

    // Atlantic
    const atlanticPredator = response.filter(
      (d) => d.ocean.includes('Atlantic') && d.newGroup === 'Predator'
    );
    const atPredator = d3.rollup(
      atlanticPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const atlanticPrey = response.filter(
      (d) => d.ocean.includes('Atlantic') && d.newGroup === 'Prey'
    );

    const atPrey = d3.rollup(
      atlanticPrey,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const atlanticOthers = response.filter(
      (d) => d.ocean.includes('Atlantic') && d.newGroup === 'Others'
    );
    const atOthers = d3.rollup(
      atlanticOthers,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(atPredator);
    console.log(atPrey);
    console.log(atOthers);

    // Indian
    const indianPredator = response.filter(
      (d) => d.ocean.includes('Indian') && d.newGroup === 'Predator'
    );
    const iPredator = d3.rollup(
      indianPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const indianPrey = response.filter(
      (d) => d.ocean.includes('Indian') && d.newGroup === 'Prey'
    );

    const iPrey = d3.rollup(
      indianPrey,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const indianOthers = response.filter(
      (d) => d.ocean.includes('Indian') && d.newGroup === 'Others'
    );

    const iOthers = d3.rollup(
      indianOthers,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(iPredator);
    console.log(iPrey);
    console.log(iOthers);

    // Southern
    const southPredator = response.filter(
      (d) => d.ocean.includes('South') && d.newGroup === 'Predator'
    );

    const sPredator = d3.rollup(
      southPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const southOthers = response.filter(
      (d) => d.ocean.includes('South') && d.newGroup === 'Others'
    );

    const sOthers = d3.rollup(
      southOthers,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(sPredator);
    console.log(sOthers);

    // North
    const northPredator = response.filter(
      (d) => d.ocean.includes('North') && d.newGroup === 'Predator'
    );

    const nPredator = d3.rollup(
      northPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    const northOthers = response.filter(
      (d) => d.ocean.includes('North') && d.newGroup === 'Others'
    );

    const nOthers = d3.rollup(
      northOthers,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(nPredator);
    console.log(nOthers);

    // Arctic
    const arcticPredator = response.filter(
      (d) => d.ocean.includes('Arctic') && d.newGroup === 'Predator'
    );

    const arPredator = d3.rollup(
      arcticPredator,
      (v) => v.length,
      (d) => getDepthRange(d.depth)
    );

    console.log(arPredator);

    //const for child tree map rollup
    // pPredator
    // pPrey
    // pOthers

    // atPredator
    // atPrey
    // atOthers

    // iPredator
    // iPrey
    // iOthers

    // sPredator
    // sOthers

    // nPredator
    // nOthers

    // arPredator

    //--------------------------------------------

    // Treemap --------------------------------------------
    // title
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

    // fade-in animation for title
    title.style('opacity', 0).transition().duration(1000).style('opacity', 1);

    // description paragraph
    const description = body
      .append('div')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('padding-bottom', '30px')
      .append('p')
      .style('max-width', '700px')
      .style('font-size', '15px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', 'white')
      .style('text-align', 'center')
      .style('line-height', '1.6') // Increase leading
      .html(`This treemap visualises the number of species of fish in each ocean. The oceans are represented by the top-level rectangles, and the archetypes are represented by the smaller rectangles within each ocean. The size of each rectangle corresponds to the number of species based on the total number of fishes in the database, currently totaling at 
  <strong style="color: #098094;">${response.length}</strong> species.`); //mention predator/prey, add depth in phase 2  + // Big N

    // Add fade-in animation for the description
    description
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Convert the data to a hierarchical format
    const root = d3
      .hierarchy([null, data], ([, value]) => value)
      .sum(([, value]) => value)
      .sort((a, b) => b.value - a.value);

    console.log(root);

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
      .padding(3); // padding between the nodes

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

    console.log(root.leaves());

    // Create a group for each node
    const nodes = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('class', (d, i) => {
        return root.leaves()[i].parent.data[0]; // Assuming this returns the class name
      })
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Define colourScale
    const colourScale = d3
      .scaleOrdinal()
      .domain(['Pacific', 'Atlantic', 'Indian', 'South', 'North', 'Arctic'])
      .range([
        '#fec76f',
        '#f5945c',
        '#b3be62',
        '#6dbfb8',
        '#be95be',
        '#373737',
      ]);
    //.reverse());
    //.range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

    // Add a pattern for the overlay - fish motif?

    // Append a rectangle for each node
    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => {
        const parentColor = colourScale(d.parent.data[0]);
        const shade = d3
          .scaleLinear()
          .domain([0, d.parent.children.length - 1])
          .range([0.1, 0.5]); // Adjust the range to change the darkness of the shade
        return d3
          .color(parentColor)
          .darker(shade(d.parent.children.indexOf(d)));
      })
      .attr('fill-opacity', 0.9)
      .attr('stroke', 'none');

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
        return fontSize < 10 ? '0px' : `${fontSize}px`; // Hide text if the font size is less than 10px
      })
      .text((d) => d.data[0])
      .each(function (d) {
        const bbox = this.getBBox();
        if (bbox.width > d.x1 - d.x0 || bbox.height > d.y1 - d.y0) {
          d3.select(this).remove();
        }
      });

    // Add fade-in and scale animation for the treemap nodes
    setTimeout(() => {
      nodes
        .style('opacity', 0)
        .attr('transform', (d) => `translate(${d.x0},${d.y0}) scale(0.1)`)
        .transition()
        .duration(1500)
        .style('opacity', 0.9)
        .attr('transform', (d) => `translate(${d.x0},${d.y0}) scale(1)`);
    }, 2000); // Delay the animation to start after the loading animation is done

    // Add fade-in and scale animation for the treemap nodes from bottom right
    // nodes.style("opacity", 0)
    // .attr("transform-origin", "bottom right")
    // .attr("transform", d => `translate(${d.x0},${d.y0}) scale(0.1)`)
    // .transition()
    // .duration(1000)
    // .style("opacity", 1)
    // .attr("transform", d => `translate(${d.x0},${d.y0}) scale(1)`);

    //--------------------------------------------

    //Parent/Primary Legend --------------------------------------------
    // Add Legend for oceans
    const legend = body
      .insert('div', 'svg') // Insert legend above the treemap but below the description
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('margin-top', '5px')
      .style('padding-bottom', '30px');

    // Sort oceans by no. of species in descending order
    const ocean = Array.from(data.entries())
      .sort((a, b) => d3.sum(b[1].values()) - d3.sum(a[1].values()))
      .map((d) => d[0]);

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
      .style('width', '15px')
      .style('height', '15px')
      .style('background-color', colourScale)
      .style('margin-right', '10px')
      .style('border-radius', '3px');

    legendItems
      .append('span')
      .style('font-size', '14px')
      .style('font-family', "'Open Sans', sans-serif")
      .style('font-weight', 'regular')
      .style('color', 'white')
      .text((d) => d);

    // Hover effect for legend to highlight the corresponding ocean
    legendItems
      .on('mouseover', function (event, d) {
        // Highlight the corresponding ocean nodes
        nodes
          .filter((node) => node.parent.data[0] === d)
          .select('rect')
          .attr('stroke', '#0072ff') //#00c6ff / #0072ff
          .attr('stroke-width', 4);

        // Highlight the legend item
        d3.select(this).style('font-weight', 'bold').style('color', '#0072ff');

        const oceans = [
          {
            name: 'Pacific Ocean',
            area: '63.8 million mi²',
            metric: '(165.25 million km²)',
            depth: '14,040 ft',
            metricd: '(4,280 m)',
            description:
              "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions.",
          },
          {
            name: 'Atlantic Ocean',
            area: '41.1 million mi²',
            metric: '(106.46 million km²)',
            depth: '12,080 ft',
            metricd: '(3,682 m)',
            description:
              "The Atlantic Ocean is the second-largest of the world's oceans.",
          },
          {
            name: 'Indian Ocean',
            area: '27.2 million mi²',
            metric: '(70.56 million km²)',
            depth: '12,990 ft',
            metricd: '(3,960 m)',
            description:
              "The Indian Ocean is the third-largest of the world's oceanic divisions.",
          },
          {
            name: 'Southern Ocean',
            area: '7.8 million mi²',
            metric: '(20.23 million km²)',
            depth: '13,100 ft',
            metricd: '(4,000 m)',
            description:
              'The Southern Ocean, also known as the Antarctic Ocean, is the fourth-largest ocean.',
          },
          {
            name: 'Arctic Ocean',
            area: '5.4 million mi²',
            metric: '(13.98 million km²)',
            depth: '3,953 ft',
            metricd: '(1,205 m)',
            description:
              "The Arctic Ocean is the smallest and shallowest of the world's five major oceans.",
          },
          {
            name: 'North Sea',
            area: '220,000 mi²',
            metric: '(570,000 km²)',
            depth: '308 ft',
            metricd: '(94 m)',
            description:
              'The North Sea is a marginal sea of the Atlantic Ocean located between Great Britain, Scandinavia, Germany, the Netherlands, Belgium, and France.',
          },
        ];

        // Display ocean introduction text box
        const oceanInfo = oceans.find((ocean) => ocean.name === d);

        body
          .append('div')
          .attr('class', 'ocean-intro')
          .style('position', 'absolute')
          .style('font-size', '14px')
          .style('font-family', "'Open Sans', sans-serif")
          .style('font-weight', 'regular')
          .style('background', 'white')
          .style('border-radius', '7px')
          .style('padding', '10px')
          .style('pointer-events', 'none')
          .style('border', '1.5px solid #72757c')
          .style('opacity', '0.9')
          .style('left', `${event.pageX + 20}px`)
          .style('top', `${event.pageY - 100}px`)
          .style('box-shadow', '0px 5px 5px rgba(0, 0, 0, 0.3)') // Drop shadow
          .html(
            `<strong style="color: #098094;">${oceanInfo.name}</strong><br/>Area: <strong style="color: #098094;">${oceanInfo.area}</strong> <em style="color: grey;">${oceanInfo.metric}</em><br/>Depth: <strong style="color: #098094;">${oceanInfo.depth}</strong>  <em style="color: grey;">${oceanInfo.metricd}</em><br/><br/>${oceanInfo.description}`
          );
      })
      .on('mouseout', function (event, d) {
        // Remove highlight from the corresponding ocean nodes
        nodes
          .filter((node) => node.parent.data[0] === d)
          .select('rect')
          .attr('stroke', 'none');

        // Remove highlight from the legend item
        d3.select(this).style('font-weight', 'regular').style('color', 'white');

        // Remove ocean introduction text box
        body.select('.ocean-intro').remove();
      });

    //--------------------------------------------

    //More info for each treemap rect/node --------------------------------------------
    // Hover effect to display total number + proportion of species deactivate hover effect for node info displaying total number + proportion of species when zoomed in and activate when zoomed out
    nodes
      .on('mouseover', function (event, d) {
        if (d.depth < 5) {
          // Only show tooltip for top-level nodes
          d3.select(this)
            .select('rect')
            .attr('stroke', '#ac513b')
            .attr('stroke-width', 4);

          const [x, y] = d3.pointer(event);

          body
            .append('div') //popup window for Species info
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('font-size', '14px')
            .style('font-family', "'Open Sans', sans-serif")
            .style('font-weight', 'regular')
            .style('background', 'white')
            .style('border', '1.5px solid #72757c')
            .style('padding', '10px')
            .style('pointer-events', 'none')
            .style('opacity', '0.9')
            .style('border-radius', '10px') // Add 10px radius
            .style('box-shadow', '0px 5px 5px rgba(0, 0, 0, 0.3)') // Add drop shadow
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY + 20}px`).html(`
                  <strong style="color: #098094;">${d.data[0]}</strong>
                  <br/>Ocean: <strong style="color: #098094;">${
                    d.parent.data[0]
                  }</strong>
                  <br/><br/>Proportion: <strong style="color: #098094;">${Math.round(
                    (d.value / d.parent.value) * 100
                  )}%</strong>
                  <div style="width: 100%; background: #ddd; border-radius: 5px; margin-top: 5px;">
                    <div style="width: ${Math.round(
                      (d.value / d.parent.value) * 100
                    )}%; background: #098094; height: 10px; border-radius: 5px;"></div>
                  </div>
                  <br/>Species Count: <strong style="color: #098094;">${
                    d.value
                  }</strong>
                `);
        }
      })
      .on('mouseout', function () {
        d3.select(this).select('rect').attr('stroke', 'none');

        body.select('.tooltip').remove();
      });

    //--------------------------------------------

    //Transition from Parent - Child in the treemap -Zoom function --------------------------------------------
    // the part clicked will further fragment the treemap and present data from the "getdetaileddata" and fades out when zooming out

    function getDetailedData(ocean) {
      switch (ocean) {
        case 'Pacific':
          return {
            Predator: pPredator,
            Prey: pPrey,
            Others: pOthers,
          };
        case 'Atlantic':
          return {
            Predator: atPredator,
            Prey: atPrey,
            Others: atOthers,
          };
        case 'Indian':
          return {
            Predator: iPredator,
            Prey: iPrey,
            Others: iOthers,
          };
        case 'South':
          return {
            Predator: sPredator,
            Others: sOthers,
          };
        case 'North':
          return {
            Predator: nPredator,
            Others: nOthers,
          };
        case 'Arctic':
          return {
            Predator: arPredator,
          };
        default:
          return {};
      }
    }

    function zoom(d, width, height, margin, svg, nodes) {
      const x = d3.scaleLinear().domain([d.x0, d.x1]).range([0, width]);
      const y = d3.scaleLinear().domain([d.y0, d.y1]).range([0, height]);

      svg.transition().duration(750).attr('viewBox', `0 0 ${width} ${height}`);

      nodes
        .transition()
        .duration(750)
        .attr('transform', (node) => `translate(${x(node.x0)},${y(node.y0)})`)
        .select('rect')
        .attr('width', (node) => x(node.x1) - x(node.x0))
        .attr('height', (node) => y(node.y1) - y(node.y0));

      nodes
        .select('text')
        .transition()
        .duration(750)
        .attr('x', 10)
        .attr('y', 25)
        .style('font-size', (node) => {
          const fontSize = Math.min(
            (x(node.x1) - x(node.x0)) / 5,
            (y(node.y1) - y(node.y0)) / 5,
            16
          );
          return fontSize < 10 ? '0px' : `${fontSize}px`;
        })
        .text((node) => node.data[0]);

      //legend disappear when zoom in
      legend.transition().duration(500).style('opacity', 0);

      //tree map description disappear when zoom in
      description.transition().duration(500).style('opacity', 0);

      // Secondary Legend, appears when zoomed in and hides when zoom out --------------------------------------------
      // Depth
      const legendDepth = {
        gradientBar: {
          x: 40,
          y: 10,
          width: 15,
          height: 80,
          colorStart: d3.color(colourScale(d.parent.data[0])).brighter(0),
          colorEnd: d3.color(colourScale(d.parent.data[0])).darker(3),
        },
      };

      const svgDepth = d3
        .select('body')
        .append('svg')
        .attr('width', 50)
        .attr('height', 100)
        .style('background-color', 'transparent')
        .style('position', 'absolute')
        .style('top', '22%')
        .style('transform', 'translate(-200%, -50%)');

      const gradient = svgDepth
        .append('defs')
        .append('linearGradient')
        .attr('id', 'gradientBar')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', legendDepth.gradientBar.colorStart);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', legendDepth.gradientBar.colorEnd);

      svgDepth
        .append('rect')
        .attr('x', legendDepth.gradientBar.x)
        .attr('y', legendDepth.gradientBar.y)
        .attr('width', legendDepth.gradientBar.width)
        .attr('height', legendDepth.gradientBar.height)
        .attr('fill', 'url(#gradientBar)');

      // Add hover effect for elaborate legend info
      svgDepth
        .append('rect')
        .attr('x', legendDepth.gradientBar.x)
        .attr('y', legendDepth.gradientBar.y)
        .attr('width', legendDepth.gradientBar.width)
        .attr('height', legendDepth.gradientBar.height)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', function (event) {
          const [x, y] = d3.pointer(event);

          d3.select('body')
            .append('div')
            .attr('class', 'tooltip-depth')
            .style('position', 'absolute')
            .style('font-size', '14px')
            .style('font-family', "'Open Sans', sans-serif")
            .style('font-weight', 'regular')
            .style('background', 'white')
            .style('border', '1.5px solid #72757c')
            .style('padding', '10px')
            .style('pointer-events', 'none')
            .style('opacity', '0.9')
            .style('border-radius', '10px') // radius
            .style('box-shadow', '0px 5px 5px rgba(0, 0, 0, 0.3)') // drop shadow
            .style('left', `${x + 20}px`)
            .style('top', `${y - 20}px`)
            .html(
              `<strong style="color: #098094;">Depth</strong><br/>The darker the shade, the greater the depth.<br/>*Cube within 20m intervals/bands.`
            )
            .style(
              'transform',
              `translate(${event.pageX - 40}px, ${event.pageY - 40}px)`
            );
        })
        .on('mouseout', function () {
          d3.select('.tooltip-depth').remove();
        });

      // Species population size legend
      const legendSize = {
        squares: [
          {
            x: 10,
            y: 10,
            size: 80,
            color: d3.color(colourScale(d.parent.data[0])).brighter(0),
          },
          {
            x: 10,
            y: 30,
            size: 60,
            color: d3.color(colourScale(d.parent.data[0])).darker(1),
          },
          {
            x: 10,
            y: 50,
            size: 40,
            color: d3.color(colourScale(d.parent.data[0])).darker(2),
          },
        ],
        draw: function (svg) {
          svg
            .selectAll('rect')
            .data(this.squares)
            .enter()
            .append('rect')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y)
            .attr('width', (d) => d.size)
            .attr('height', (d) => d.size)
            .attr('fill', (d) => d.color)
            .on('mouseover', function (event, d) {
              const [x, y] = d3.pointer(event);
              d3.select('body')
                .append('div')
                .attr('class', 'tooltip-size')
                .style('position', 'absolute')
                .style('font-size', '14px')
                .style('font-family', "'Open Sans', sans-serif")
                .style('font-weight', 'regular')
                .style('background', 'white')
                .style('border', '2px solid #72757c')
                .style('padding', '10px')
                .style('pointer-events', 'none')
                .style('opacity', '0.9')
                .style('border-radius', '10px') // radius
                .style('box-shadow', '0px 5px 5px rgba(0, 0, 0, 0.3)') // drop shadow
                .style('left', `${x + 20}px`)
                .style('top', `${y + 20}px`)
                .html(
                  `<strong style="color: #098094;">Species Volume</strong><br/>The larger the cube,<br/>the greater the volume of species.`
                )
                .style(
                  'transform',
                  `translate(${event.pageX - 40}px, ${event.pageY - 40}px)`
                );
            })
            .on('mouseout', function () {
              d3.select('.tooltip-size').remove();
            });

          svg
            .append('line')
            .attr('x1', 50)
            .attr('y1', 50)
            .attr('x2', 90)
            .attr('y2', 10)
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 6');
        },
      };

      const svgSize = d3
        .select('body')
        .append('svg')
        .attr('width', 100)
        .attr('height', 100)
        .style('background-color', 'transparent')
        .style('position', 'absolute')
        .style('left', '49%')
        .style('top', '22%') // translate y axis
        .style('transform', 'translate(10%, -50%)');

      legendSize.draw(svgSize);

      // Group legendDepth, legendSize legends
      const legendGroup = d3
        .select('body')
        .append('div')
        .attr('class', 'legend-group')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('padding-bottom', '30px')
        .style('opacity', 0.9)
        .style('transform', 'scale(1.5)')
        .style('position', 'absolute')
        .style('top', '23%')
        .style('left', '49%');

      legendGroup
        .append(() => svgDepth.node())
        .style('opacity', 0)
        .transition()
        .duration(1200)
        .style('opacity', 1);

      legendGroup
        .append(() => svgSize.node())
        .style('opacity', 0)
        .transition()
        .duration(1200)
        .style('opacity', 1);

      // Fetch detailed data and update the treemap
      const detailedData = getDetailedData(
        'Pacific',
        'Atlantic',
        'Indian',
        'South',
        'North',
        'Arctic'
      );
      console.log('Detailed Data:', detailedData);

      if (Object.keys(detailedData).length > 0) {
        const detailedRoot = d3
          .hierarchy({
            children: Object.entries(detailedData).map(([key, value]) => ({
              name: key,
              children: Array.from(value, ([depthRange, count]) => ({
                name: getDepthRange(depthRange),
                value: count,
              })),
            })),
          })
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value);

        console.log('Detailed Root:', detailedRoot);

        treemapLayout(detailedRoot);

        const detailedNodes = svg.selectAll(".detailed-node")
          .data(detailedRoot.leaves())
          .enter()
          .append("g")
          .attr("class", "detailed-node")
          .attr("transform", node => `translate(${node.x0},${node.y0})`);


        detailedNodes.append("rect")
          .attr("width", node => node.x1 - node.x0)
          .attr("height", node => node.y1 - node.y0)
          .attr("fill", node => {
            const parentColor = colourScale(node.parent.data.name);
            const shade = d3.scaleLinear()
          .domain([0, (detailedRoot.children ? detailedRoot.children.length : 1) - 1])
          .range([0.3, 0.7]); // Make the shade range darker and wider
            return d3.color(parentColor).darker(shade(detailedRoot.children ? detailedRoot.children.indexOf(node) : 1));
          })
          .attr("fill-opacity", 1)
          .attr("stroke", "none");

        detailedNodes.append("text")
          .attr("x", 10)
          .attr("y", 25)
          .style("font-family", "'Open Sans', sans-serif")
          .style("font-weight", "regular")
          .style("fill", "white")
          .style("font-size", node => {
            const fontSize = Math.min((node.x1 - node.x0) / 5, (node.y1 - node.y0) / 5, 16);
            return fontSize < 10 ? "0px" : `${fontSize}px`;
          })
          .text(node => getDepthRange(node.data.value))
          .each(function(node) {
            const bbox = this.getBBox();
      if (bbox.width > (node.x1 - node.x0) || bbox.height > (node.y1 - node.y0)) {
        d3.select(this).remove();
            }
          });

        // Add fade-in and scale animation for the detailed nodes
        setTimeout(() => {
          detailedNodes.style("opacity", 0)
            .attr("transform", node => `translate(${x(node.x0)},${y(node.y0)}) scale(0.1)`)
            .transition()
            .duration(1500)
            .style("opacity", 0.9)
            .attr("transform", node => `translate(${x(node.x0)},${y(node.y0)}) scale(1)`);
        }, 2000);

          detailedNodes.append("text")
            .attr("x", 10)
            .attr("y", 25)
            .style("font-family", "'Open Sans', sans-serif")
            .style("font-weight", "regular")
            .style("fill", "white")
            .style("font-size", node => {
              const fontSize = Math.min((x(node.x1) - x(node.x0)) / 5, (y(node.y1) - y(node.y0)) / 5, 16);
              return fontSize < 10 ? "0px" : `${fontSize}px`;
            })
            .text(node => getDepthRange(node.data.name))
            .each(function(node) {
              const bbox = this.getBBox();
              if (bbox.width > (x(node.x1) - x(node.x0)) || bbox.height > (y(node.y1) - y(node.y0))) {
                d3.select(this).remove();
              }
            });
      }
    }

    nodes.on('click', function (event, d) {
      zoom(d, width, height, margin, svg, nodes);
    });

    d3.select('body').on('click', function (event) {
      if (!event.target.closest('svg')) {
        svg
          .transition()
          .duration(750)
          .attr('viewBox', `0 0 ${width} ${height}`);
        nodes
          .transition()
          .duration(750)
          .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
          .select('rect')
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .style('filter', 'none');

        nodes
          .select('text')
          .transition()
          .duration(750)
          .attr('x', 10)
          .attr('y', 25)
          .style('font-size', (d) => {
            const fontSize = Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 16);
            return fontSize < 10 ? '0px' : `${fontSize}px`;
          })
          .text((d) => d.data[0]);
      }
    });

    //--------------------------------------------
    // after clicking on a node and zoom in, Randomized fishes path fade in swimming while confined within the node, like in an aquarium, scaled to 150% of its original size - but in front of the treemap,

    function createZoomedFish(node) {
      const fishContainer = d3
        .select('body')
        .append('div')
        .attr('class', 'zoomed-fish-container')
        .style('position', 'flexible')
        .style('top', `${node.y0 + (node.y1 - node.y0) * 0.1}px`)
        .style('left', `${node.x0 + (node.x1 - node.x0) * 0.1}px`)
        .style('width', `${(node.x1 - node.x0) * 0.8}px`)
        .style('height', `${(node.y1 - node.y0) * 0.8}px`)
        .style('pointer-events', 'auto')
        .style('z-index', 1); // fishes in front of the treemap

      for (let i = 0; i < 15; i++) {
        const fish = fishContainer
          .append('img')
          .attr(
            'src',
            possiblePaths[Math.floor(Math.random() * possiblePaths.length)]
          )
          .style('position', 'absolute')
          .style('width', `${Math.random() * 50 + 80}px`) // Randomize size, scaled to 200%
          .style('height', 'auto')
          .style('top', `${Math.random() * 80 + 35}%`) // Disperse fish within the node
          .style('left', `${Math.random() * 80 + 0}%`) // Disperse fish within the node
          .style('filter', `hue-rotate(${Math.random() * 360}deg)`) // Randomize color
          .style('pointer-events', 'auto') // Enable pointer events for the fish
          .style('cursor', 'pointer')
          .style('transition', 'transform 5s linear');

        fish
          .on('mouseover', async function (event, d) {
            const [x, y] = d3.pointer(event);

            const fishData = await d3.json(
              './data/[TO_BE_USED]updated_final_copy.json'
            );
            const imgData = await d3.json('./data/imgv2.json');

            // Merge fish data with their thumbnails using the 'id' field
            const mergedData = fishData.map((fish) => ({
              ...fish,
              thumbnail:
                imgData.find((img) => img.id === fish.id)?.thumbnail ||
                'default_image.jpg',
            }));

            console.log('Merged Fish Data:', mergedData);

            // Hover over each fish img to show more info - image thumbnail + common names + scientific names(italics) + archetypes + depth + map
            d3.select('body')
              .append('div')
              .attr('class', 'tooltip-fish')
              .style('position', 'absolute')
              .style('font-size', '18px')
              .style('font-family', "'Open Sans', sans-serif")
              .style('font-weight', 'regular')
              .style('background', 'white')
              .style('border', '1.5px solid #72757c')
              .style('padding', '10px')
              .style('pointer-events', 'none')
              .style('opacity', '0.9')
              .style('border-radius', '10px') // Add 10px radius
              .style('box-shadow', '0px 5px 5px rgba(0, 0, 0, 0.3)') // Add drop shadow
              .style('left', `${x + 800}px`)
              .style('top', `${y + 500}px`)
              .html(
                //find a way to make it flexible
                `
              <a href="${mergedData.record_link}" target="_blank">
              <img src="${mergedData.thumbnail}" alt="Fish Thumbnail" style="width: 100px; height: auto; border-radius: 5px;"></a>
              <br/><strong style="color: #098094;">${mergedData.common_name}</strong>
              <br/><i style="color: #808080; font-size: 10pt;">${mergedData.title}</i>
              <br/>Archetype: <strong style="color: #098094;">${mergedData.newGroup}</strong>
              <br/>Depth: <strong style="color: #098094;">${mergedData.depth} m</strong>
              <br/><br/><img src="https://stamen-tiles.a.ssl.fastly.net/watercolor/${mergedData.longitude}/${mergedData.latitude}/10/256.png" alt="Map" style="width: 100%; border-radius: 5px;">
            `
              );
          })
          .on('mouseout', function () {
            d3.select('.tooltip-fish').remove();
          });
        animateFish(fish);
      }
    }

    //zoom in
    nodes.on('click', function (event, d) {
      d3.selectAll('.fish-container')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .on('end', function () {
          d3.select(this).style('display', 'none');
        }); // Fade out background fish

      d3.selectAll('.zoomed-fish-container').remove(); // Remove previous zoomed fish

      createZoomedFish(d);

      d3.selectAll('.zoomed-fish-container')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1); // Fade in zoomed fish

      zoom(d, width, height, margin, svg, nodes);
    });

    //zoom out
    d3.select('body').on('click', function (event) {
      if (!event.target.closest('svg')) {
        d3.selectAll('.zoomed-fish-container')
          .transition()
          .duration(500)
          .style('opacity', 0)
          .on('end', function () {
            d3.select(this).remove(); // Remove zoomed fish
          });

        d3.selectAll('.fish-container')
          .style('display', 'block')
          .transition()
          .duration(500)
          .style('opacity', 1); // Fade in background fish

        svg
          .transition()
          .duration(750)
          .attr('viewBox', `0 0 ${width} ${height}`);
        nodes
          .transition()
          .duration(750)
          .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
          .select('rect')
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .style('filter', 'none');

        nodes
          .select('text')
          .transition()
          .duration(750)
          .attr('x', 10)
          .attr('y', 25)
          .style('font-size', (d) => {
            const fontSize = Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 16);
            return fontSize < 10 ? '0px' : `${fontSize}px`;
          })
          .text((d) => d.data[0]);

        // Remove detailed nodes
        svg.selectAll('.detailed-node').remove();

        // Remove secondary legend when zoomed out
        d3.selectAll('.legend-group, .tooltip-depth, .tooltip-size')
          .transition()
          .duration(400)
          .style('opacity', 0)
          .remove();

        // legend return when exit treemap
        legend.transition().duration(750).style('opacity', 1);

        // tree map description return when exit treemap
        description.transition().duration(750).style('opacity', 1);
      }
    });

    //--------------------------------------------

    //Footer --------------------------------------------
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
        'Major Studio I | Exercise 2: Qualitative Representation | Tak | Bella | Xuan'
      );
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

fetchData();
