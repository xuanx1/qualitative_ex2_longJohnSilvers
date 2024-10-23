
   // Hover effect to display randomised fish info
   nodes.on("mouseover", function(event, d) {
    d3.select(this).select("rect")
      .attr("stroke", "#ac513b")
      .attr("stroke-width", 4);

    const [x, y] = d3.pointer(event);

    body.append("div") //popup window for randomised fish info - thumbnail + common names + scientific names(italics) + archetypes + depth + map
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("font-size", "14px")
      .style("font-family", "'Open Sans', sans-serif")
      .style("font-weight", "regular")
      .style("background", "white")
      .style("border", "1.5px solid #72757c")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", "0.9")
      .style("border-radius", "10px") // Add 10px radius
      .style("box-shadow", "0px 5px 5px rgba(0, 0, 0, 0.3)") // Add drop shadow
      .style("left", `${event.pageX + 20}px`)
      .style("top", `${event.pageY + 20}px`)
      .html(`
        <strong style="border-radius: 5px">${imgv2.thumbnail}</strong>
        <br/><strong style="color: #098094;">${common_name}</strong>
        <br/><i style="color: #808080; font-size: 10pt;">${title}</i>
        <br/>Archetype: <strong style="color: #098094;">${newGroup}%</strong>
        <br/>Depth: <strong style="color: #098094;">${depth} m (convert ot feet)ft</strong>
        <br/><br/><img src="https://stamen-tiles.a.ssl.fastly.net/watercolor/${longitude}/${latitude}/10/256.png" alt="Map" style="width: 100%; border-radius: 5px;"></img>
      `);
  })
  .on("mouseout", function() {
    d3.select(this).select("rect")
      .attr("stroke", "none");

    body.select(".tooltip").remove();
  });