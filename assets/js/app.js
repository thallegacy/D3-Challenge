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
          console.log(data.poverty);
          console.log(data.healthcare);
          
      });
    
    // Create the scales for the axes
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.poverty))
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
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
    .attr("r", 17)
    .attr("fill", "rgb(12,200,223)")
    .attr("opacity", ".5");

    // append text to the circles
    chartGroup.append("g")
    .selectAll('text')
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .classed(".stateText", true)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "10px")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "central");
 

});