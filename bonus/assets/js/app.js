// Set the width, height amd margins for the SVG canvas
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//create the width and height using the margins and parameters
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
function yScale(censusData, chosenYAxis, height) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

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

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;
  
    //  Labels for the x Axis Tool Tips
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty: ";
  } else if (chosenXAxis === "income") {
      xlabel = "Median Income: ";
  } else {
      xlabel = "Age: ";
  }
  //  Labels for the y Axis Tool Tips
  if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare: ";
  } else if (chosenYAxis === "smokes") {
      ylabel = "Smokers: ";
  } else {
      ylabel = "Obesity: ";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);
  
  // onmouseover event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;
  
  // Parse data.
  censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.income = +data.income;
      data.obesity = data.obesity;
  });
    // x and y LinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis, width);
  var yLinearScale = yScale(censusData, chosenYAxis, height);

  // Create initial axes functions
  var bottomAxis =d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);
  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 15)
  .classed("stateCircle", true);

  // append circle text
  chartGroup.append("g")
  .selectAll('text')
  .data(censusData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .text(d => d.abbr)
  .classed("stateText", true);
 

  // append x labels
  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var povertyLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");
  
  var ageLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");
  
  var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");

  // Add y labels group and labels.
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");
  
  var healthcareLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 60 - margin.left)
  .attr("dy", "1em")
  .attr("value", "healthcare")
  .classed("active", true)
  .text("Lacks Healthcare (%)");
  
  var smokesLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 40 - margin.left)
  .attr("dy", "1em")
  .attr("value", "smokes")
  .classed("inactive", true)
  .text("Smokes (%)");
  
  var obesityLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 20 - margin.left)
  .attr("dy", "1em")
  .attr("value", "obesity")
  .classed("inactive", true)
  .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
  .on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    console.log(chosenXAxis);

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(censusData, chosenXAxis, width);

    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel
          .classed("active", true)
          .classed("inactive", false);
      ageLabel
          .classed("active", false)
          .classed("inactive", true);
      incomeLabel
          .classed("active", false)
          .classed("inactive", true);
    } else if (chosenXAxis === "age") {
      povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      ageLabel
          .classed("active", true)
          .classed("inactive", false);
      incomeLabel
          .classed("active", false)
          .classed("inactive", true);
    } else {
      povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      ageLabel
          .classed("active", false)
          .classed("inactive", true)
      incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
});

  ylabelsGroup.selectAll("text")
  .on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    console.log(chosenYAxis);
    
    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(censusData, chosenYAxis, height);

    // updates y axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new y values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      obesityLabel
          .classed("active", false)
          .classed("inactive", true);
  } else if (chosenYAxis === "smokes"){
      healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      obesityLabel
          .classed("active", false)
          .classed("inactive", true);
  } else {
      healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      obesityLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
});
}).catch(function(error) {
  console.log(error);
});