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


    //Create Bar Chart
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

            //Trace data to plot
            var trace1 = {
                x: sampleValues,
                y: otuIds,
                text: otuLabels,
                type: "bar",
                orientation: "h"
            };

            var chartData = [trace1];

            // Render the plot bar chart
            Plotly.newPlot("bar", chartData);
        });
    };
    
    //Create new function to reset chart with new ID
    function optionChanged(newSample) {
        createCharts(newSample);
    };    

         
//Run initial function to start page
init();