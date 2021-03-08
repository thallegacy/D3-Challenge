// Set the width, height amd margins for the SVG canvas
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group to the scatter id
// to hold the chart
// and shift the latter by left and top margins.
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Function to pull data from CSV
d3.csv("assets/data/data.csv").then(function (censusData) {
    //console check
    console.log(censusData);
    
    // Set data used for chart as numbers
   
    censusData.forEach(function (data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          
          //console check
          //console.log("x is ", data.poverty);
          //console.log("y is ", data.healthcare);
          
      });
    
    // Create the scales for the axes
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) * 0.8,
      d3.max(censusData, d => d.poverty) * 1.2
    ])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) * 0.8,
      d3.max(censusData, d => d.healthcare) * 1.2
    ])
    .range([height, 0]);


    // Create the axes based on the scales
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .classed("stateCircle", true);
    

    // append text to the circles
    chartGroup.append("g")
    .selectAll('text')
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 3)
    .classed("stateText", true);
 
    // append text titles to the axes

    // bottom (x) Axis
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .text("In Poverty (%)")
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .style("font-weight", "bold");

    // left (y) Axis
    chartGroup.append("text")
    .attr("y", 0 - ((margin.left / 2) + 2))
    .attr("x", 0 - (height / 2))
    .text("Lacks Healthcare (%)")
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .attr("transform", "rotate(-90)");
    
});