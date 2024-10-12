//explained, corrected and refined with vscode copilot

// tree map, by oceans, depth, predator/prey (archetype)
// function that match "title" from filtered_data_unique.json to N= (scientific names) in common_names_dict.txt and extract its corresponding C= (common names)
// load json, create a treemap with the data

//ADD background fishes swimming
//ADD animation when zoom in + out

const Predator = predatorOrders
const Prey = preyOrders
const Others = leftOrders
const archetype = [Predator, Prey, Others]

import { predatorOrders, preyOrders, leftOrders } from "./data/group_filter.js";

// Background color for the body
d3.select("body")
  .style("background-color", "#3c3c3c");

async function fetchData() {
  try {
    // Load the data
    const response = await d3.json("./data/[TO_BE_USED]updated_final_copy.json");



    // Group data by ocean and depth, the ocean is the first level of the hierarchy, and the depth type is the second level
    const data = d3.rollup(
      response, 
      v => v.length, 
      d => d.ocean,
      d => d.archetype,
      d => d.depth

    );

    console.log("Predator/Prey by Oceans and Depths:");
    console.log(data);

    
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
      .padding(1);

      
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
          .style("opacity", 1)
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
    .domain(["BRONX", "BROOKLYN", "MANHATTAN", "QUEENS", "STATEN ISLAND", "Unspecified"])
    .range(["#fec76f", "#f5945c", "#b3be62", "#6dbfb8", "#be95be", "#72757c"]);
    
    // Append a rectangle for each node
    nodes.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => {
        const parentColor = colourScale(d.parent.data[0]);
        const shade = d3.scaleLinear()
          .domain([0, d.parent.children.length - 1])
          .range([0.1, 3]);
        return d3.color(parentColor).darker(shade(d.parent.children.indexOf(d)));
      });

    // Append text labels
    nodes.append("text")
    .attr("x", 10)
    .attr("y", 25)
    .style("font-family", "'Open Sans', sans-serif")
    .style("font-weight", "medium")
    .style("fill", "white")
    .style("font-size", d => `${Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5, 16)}px`)
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

    // Sort boroughs by total complaints in descending order
    const boroughs = Array.from(data.entries())
      .sort((a, b) => d3.sum(b[1].values()) - d3.sum(a[1].values()))
      .map(d => d[0]);

    const legendItems = legend.selectAll(".legend-item")
    .data(boroughs)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-right", (d, i) => i === boroughs.length - 1 ? "0px" : "40px");

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
  
    // Add hover effect to display number of complaints
    nodes.on("mouseover", function(event, d) {
    d3.select(this).select("rect")
    .attr("stroke", "#ac513b")
    .attr("stroke-width", 3);

    const [x, y] = d3.pointer(event);

    body.append("div") //popup window for Species info
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "2px solid #72757c")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", "0.9")
      .style("left", `${event.pageX + 20}px`)
      .style("top", `${event.pageY + 20}px`)
      .html(`<strong>${d.data[0]}</strong><br/>Species: ${d.value}`);
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
  .style("font-weight", "bold")
  .style("color", "white")
  .style("text-align", "center")
  .style("padding-top", "50px")
  .text("Major Studio I | Exercise 2: Qualitative Representation | Hyeonjeong | Xuan");

  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

fetchData();

// add title to the treemap
const body = d3.select("body").style("padding", "20px");

const title = body
  .append("h1")
  .style("font-size", "32px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-weight", "regular")
  .style("color", "white")
  .style("text-align", "center")
  .style("padding-bottom", "20px")
  .text("Helloooo Neighbours...");

// Add fade-in animation for the title
title.style("opacity", 0)
.transition()
.duration(1000)
.style("opacity", 1);


// add description
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
  .text("This treemap visualises the number of ----. The oceans are represented by the top-level rectangles, and the acrhetypes types are represented by the smaller rectangles within each ocean. The size of each rectangle corresponds to the number of species."); //tba change to ocean, depth, predator/prey


