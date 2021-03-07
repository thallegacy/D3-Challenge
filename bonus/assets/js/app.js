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

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis, width) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function xScale(censusData, chosenYAxis, height) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, height]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisBottom(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var xlabel;
  var ylabel;
  
    //  For X Axis tips.
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty: ";
  } else if (chosenXAxis === "income") {
      xlabel = "Median Income: "
  } else {
      xlabel = "Age: "
  }
  // For Y Axis tips.
  if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare: ";
  } else if (chosenYAxis === "smokes") {
      ylabel = "Smokers: "
  } else {
      ylabel = "Obesity: "
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(demoData, err) {
  if (err) throw err;
  
  // Parse data.
  demoData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.income = +data.income;
      data.obesity = data.obesity;
  });
    // x and y LinearScale function above csv import
  var xLinearScale = xScale(demoData, chosenXAxis, width);
  var yLinearScale = yScale(demoData, chosenYAxis, height);
  
  // Create initial axis functions.
  var bottomAxis =d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);