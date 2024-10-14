//explained, corrected and refined with vscode copilot

// tree map, by oceans, depth, predator/prey (archetype)
// function that match "title" from filtered_data_unique.json to N= (scientific names) in common_names_dict.txt and extract its corresponding C= (common names)
// load json, create a treemap with the data

//ADD background fishes swimming + add intro page at the top to scroll (prompt animation) down to the treemap
//ADD animation when zoom in + out

const Predator = predatorOrders
const Prey = preyOrders
const Others = leftOrders
const archetype = [Predator, Prey, Others]

import { predatorOrders, preyOrders, leftOrders } from "./data/group_filter.js";


// Background color for the body - to add "landing page" + prompt to scroll down + parallelax land with people playing volleyball
d3.select("body")
  .style("background", "linear-gradient(to bottom, #aba398 20%, #555861 80%)");

const possiblePaths = [
  `https://github.com/user-attachments/assets/cd20375b-6246-4af2-ac05-82a7c6d82719`,
  `https://github.com/user-attachments/assets/a598e241-1452-436a-a9cd-427b5a0f0e67`,
  `https://github.com/user-attachments/assets/5e380432-852d-4f0c-8d8c-a3d65ee23a95`,
  `https://github.com/user-attachments/assets/132901dd-eeeb-4711-89d1-c77b6c1113c9`,
  `https://github.com/user-attachments/assets/b309da2e-eb60-4333-ba9c-ced71e8b6cb4`
];

const possibleColors = ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99", "#c2c2f0", "#ffb3e6"];

// Function to randomize fish paths, sizes, colors and animate them
function createSwimmingFish() {
  const fishContainer = d3.select("body").append("div")
    .attr("class", "fish-container")
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)
    .style("width", "100%")
    .style("height", "100%")
    .style("pointer-events", "none")
    .style("z-index", -1); // fishes to be behind the treemap

  for (let i = 0; i < 10; i++) {
    const fish = fishContainer.append("img")
      .attr("src", possiblePaths[Math.floor(Math.random() * possiblePaths.length)])
      .style("position", "absolute")
      .style("width", `${Math.random() * 50 + 70}px`) // Randomise size
      .style("height", "auto")
      .style("top", `${Math.random() * 100}%`)
      .style("left", `${Math.random() * 100}%`)
      .style("filter", `hue-rotate(${Math.random() * 360}deg)`) // Randomise color
      .style("transition", "transform 5s linear");

    animateFish(fish);
  }
}

function animateFish(fish) {
  const newTop = `${Math.random() * 100}%`;
  const newLeft = `${Math.random() * 100}%`;

  fish.style("transform", `translate(${newLeft}, ${newTop})`);

  setTimeout(() => animateFish(fish), 5000);
}

createSwimmingFish();




// add Function to create a parallelax land with people playing volleyball





//rollup
async function fetchData() {
  try {
    // Load the data
    const response = await d3.json("./data/[TO_BE_USED]updated_final_copy.json");


    // Group data by ocean and depth, the ocean is the first level of the hierarchy, and the depth type is the second level
    const data = d3.rollup(
      response, 
      v => v.length, 
      d => {
      let ocean = d.ocean.split(' ')[0].replace(/,/g, '');
      if (ocean === 'South') ocean = 'Southern';
      if (ocean === 'North') ocean = 'North Sea';
      return ocean === 'North Sea' ? ocean : ocean + " Ocean";
      },
      d => d.newGroup,
      // d => d.depth //to be add during phase 2
    );

    console.log("Predator/Prey by Oceans and(phase 2) Depths:");
    console.log(data);



// treemap title
const body = d3.select("body").style("padding", "20px");

const title = body
  .append("h1")
  .style("font-size", "32px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-weight", "regular")
  .style("color", "#098094")
  .style("text-align", "center")
  .style("padding-bottom", "20px")
  .text("Helloooo Neighbours...");

// fade-in animation for title
title.style("opacity", 0)
.transition()
.duration(1000)
.style("opacity", 1);


// description paragraph
const description = body
  .append("div")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("padding-bottom", "30px")
  .append("p")
  .style("max-width", "600px")
  .style("font-size", "15px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-weight", "regular")
  .style("color", "white")
  .style("text-align", "center")
  .style("line-height", "1.6") // Increase leading
  .html(`This treemap visualises the number of species of fish in each ocean. The oceans are represented by the top-level rectangles, and the archetypes are represented by the smaller rectangles within each ocean. The size of each rectangle corresponds to the number of species based on the total number of fishes in the database, currently totaling at 
  <strong style="color: #098094;">${response.length}</strong> species.`); //mention predator/prey, add depth in phase 2  + // Big N

// Add fade-in animation for the description
description.style("opacity", 0)
.transition()
.duration(1000)
.style("opacity", 1);

    
    // Convert the data to a hierarchical format
    const root = d3.hierarchy([null, data], ([, value]) => value)
      .sum(([, value]) => value)
      .sort((a, b) => b.value - a.value);

    // Set up the dimensions of the treemap
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const margin = {top: 20, right: 0, bottom: 20, left: 0};

    // Create the treemap layout
    const treemapLayout = d3.treemap()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .padding(2.5); // Adjust the padding between the nodes
      
    // Update the size of the SVG element
    const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("display", "block")
    .style("margin", "0 auto");

    treemapLayout(root);


    // Create a group for each node
    const nodes = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // Add fade-in and scale animation for the treemap nodes
        nodes.style("opacity", 0)
          .attr("transform", d => `translate(${d.x0},${d.y0}) scale(0.1)`)
          .transition()
          .duration(1000)
          .style("opacity", 0.9)
          .attr("transform", d => `translate(${d.x0},${d.y0}) scale(1)`);


// // Add fade-in and scale animation for the treemap nodes from bottom right
//         nodes.style("opacity", 0)
//         .attr("transform-origin", "bottom right")
//         .attr("transform", d => `translate(${d.x0},${d.y0}) scale(0.1)`)
//         .transition()
//         .duration(1000)
//         .style("opacity", 1)
//         .attr("transform", d => `translate(${d.x0},${d.y0}) scale(1)`);


    // Define colourScale
    const colourScale = d3.scaleOrdinal()
    .domain(["Pacific", "Atlantic", "Indian", "South", "North", "Arctic"])
    .range(["#fec76f", "#f5945c", "#b3be62", "#6dbfb8", "#be95be", "#72757c"]);
    
    // Append a rectangle for each node
    nodes.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => {
        const parentColor = colourScale(d.parent.data[0]);
        const shade = d3.scaleLinear()
          .domain([0, d.parent.children.length - 1])
          .range([0.1, 0.9]); // Adjust the range to change the darkness of the shade
        return d3.color(parentColor).darker(shade(d.parent.children.indexOf(d)));
      });

    // Append text labels
    nodes.append("text")
      .attr("x", 10)
      .attr("y", 25)
      .style("font-family", "'Open Sans', sans-serif")
      .style("font-weight", "regular")
      .style("fill", "white")
      .style("font-size", d => {
        const fontSize = Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 16);
        return fontSize < 10 ? "0px" : `${fontSize}px`; // Hide text if the font size is less than 10px
      })
      .text(d => d.data[0])
      .each(function(d) {
        const bbox = this.getBBox();
        if (bbox.width > (d.x1 - d.x0) || bbox.height > (d.y1 - d.y0)) {
          d3.select(this).remove();
        }
      });

           
    // Add Legend for oceans
    const legend = body.append("div")
    .attr("class", "legend")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("margin-top", "5px");

    // Sort oceans by no. of species in descending order
    const ocean = Array.from(data.entries())
      .sort((a, b) => d3.sum(b[1].values()) - d3.sum(a[1].values()))
      .map(d => d[0]);

    const legendItems = legend.selectAll(".legend-item")
    .data(ocean)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-right", (d, i) => i === ocean.length - 1 ? "0px" : "40px");

    // Add fade-in animation for the legend itsems
    legendItems.style("opacity", 0)
    .transition()
    .duration(1000)
    .style("opacity", 1);
    
    legendItems.append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("background-color", colourScale)
    .style("margin-right", "10px");

    legendItems.append("span")
    .style("font-size", "14px")
    .style("font-family", "'Open Sans', sans-serif")
    .style("font-weight", "regular")
    .style("color", "white")
    .text(d => d);
  
    // Add hover effect to display number of species
    nodes.on("mouseover", function(event, d) {
    d3.select(this).select("rect")
    .attr("stroke", "#ac513b")
    .attr("stroke-width", 4);

    const [x, y] = d3.pointer(event);

    body.append("div") //popup window for Species info
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("font-size", "16px")
      .style("font-family", "'Open Sans', sans-serif")
      .style("font-weight", "regular")
      .style("background", "white")
      .style("border", "2px solid #72757c")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", "0.9")
      .style("left", `${event.pageX + 20}px`)
      .style("top", `${event.pageY + 20}px`)
      .html(`<strong>${d.data[0]}</strong>
        <br/>Ratio - add meter
        <br/>Population: ${d.value}`);
})
.on("mouseout", function() {
  d3.select(this).select("rect")
    .attr("stroke", "none");

  body.select(".tooltip").remove();
});

// add footer + name
const footer = d3.select("body")
  .append("footer")
  .style("font-size", "12px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-weight", "regular")
  .style("color", "white")
  .style("text-align", "center")
  .style("padding-top", "50px")
  .text("Major Studio I | Exercise 2: Qualitative Representation | Hyeonjeong | Xuan");

  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

fetchData();