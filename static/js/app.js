//Create initial function
function init() {

    //Grab data from JSON file
    d3.json("../../data/samples.json").then((importedData) => {
        // print data
        console.log(importedData);
        //console.log(importedData.samples[0]);
        //console.log(importedData.names);
        //console.log(importedData.metadata[0]);

        //Populate dropdown with name selections
        var inputSelect = d3.select("select");
        var dataNames = importedData.names;
        dataNames.forEach(
            function(item) {
            inputSelect.append("option").text(item);
            }
        );

        //Reset page to first ID
        var firstSelection = dataNames[0];
        createCharts(firstSelection);
    });
}

//---------------------------------------------------------------

    //Create Charts
    function createCharts(sample) {
        d3.json("../../data/samples.json").then((data) => {
            var samples = data.samples;
            var filterSamples = samples.filter(sampleItem => sampleItem.id == sample);
            var results = filterSamples[0];
            var sampleValues = results.sample_values;
            var otuIds = results.otu_ids;
            var otuLabels = results.otu_labels;

            console.log(results)
            console.log(sampleValues)

            //---------------------------------------------------

            //Trace data to Bubble Chart
            var trace = {
                x: otuIds,
                y: sampleValues,
                mode: "markers",
                marker: {
                    size: sampleValues,
                    color:  otuIds,
                    colorscale:"Viridis",
                },
                text: otuLabels
            };

            var bubbleData = [trace];

            var layout = {
                width: 1200,
                title: {
                    text: "<b>Bacteria Cultures per Sample</b>",
                     font: {size: 30},
                 } 
            }

            // Render the plot Bubble chart
            Plotly.newPlot("bubble", bubbleData, layout);

            //---------------------------------------------------

            //Update sample values 
            var sampleValues = results.sample_values.slice(0,10);
            var otuIds = results.otu_ids.slice(0,10).map(id => `OTU ID ${id}`);
            var otuLabels = results.otu_labels.slice(0,10);

            console.log(sampleValues)

            //Trace data to Bar chart
            var trace1 = {
                x: sampleValues.reverse(),
                y: otuIds.reverse(),
                text: otuLabels,
                type: "bar",
                orientation: "h"
            };

            var chartData = [trace1];

            var layout = { 
                width: 600, 
                height: 450,
                title: {
                   text: "<b>Top Ten OTUs</b>",
                    font: {size: 25},
                } 
            };

            // Render the plot bar chart
            Plotly.newPlot("bar", chartData, layout);

            //---------------------------------------------------

            //Create panel data
            var panel = d3.select("#sample-metadata");
            panel.html("");
            var metadata = data.metadata;
            var filteredData = metadata.filter(data => data.id == sample);
            var filterResults = filteredData[0];
            Object.entries(filterResults).forEach(([key, value]) => {
                panel.append("h4").text(`${key}: ${value}`)
            });

            console.log(filterResults)

            //---------------------------------------------------

            //Create Gauge chart
            var wfreq = filterResults.wfreq
            if (wfreq == null) {
                wfreq = 0;
            }


            var trace2 = {
                domain: {x: [0,1], y: [0, 1] },
                value: wfreq,
                title: {
                    text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week`
                },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { 
                        range: [null, 9],
                        tickmode: "linear",
                        tickfont: {size: 20},
                    },
                    bar: { color: "red", thickness: .35},
                    steps: [
                        { range: [0, 1], color: 'rgb(255,255,217)' },
                        { range: [1, 2], color: 'rgb(237,248,217)' },
                        { range: [2, 3], color: 'rgb(199,233,180)' },
                        { range: [3, 4], color: 'rgb(127,205,187)' },
                        { range: [4, 5], color: 'rgb(65,182,196)' },
                        { range: [5, 6], color: 'rgb(29,145,192)' },
                        { range: [6, 7], color: 'rgb(34,94,168)' },
                        { range: [7, 8], color: 'rgb(37,52,148)' },
                        { range: [8, 9], color: 'rgb(8,29,88)' },
                      ]
                }
            };

            var gaugeData = [trace2];

            var layout = { 
                width: 500, 
                height: 500, 
                margin: { t: 0, b: 0 } };
            
            // Render the plot gauge chart
            Plotly.newPlot("gauge", gaugeData, layout);

        });
    };
    
//-------------------------------------------------------------

    //Create new function to reset chart with new ID
    function optionChanged(newSample) {
        createCharts(newSample);
    };    

         
//Run initial function to start page
init();