// Use D3 to read the samples.json from the URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
function initialize() {
    let dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            dropdown.append("option")
                .text(sample)
                .property("value", sample);
        });

        let firstSample = sampleNames[0];
        demoInfo(firstSample);
        buildBarChart(firstSample);
        buildBubbleChart(firstSample);
    });
}

// Update charts when a new sample is selected
function optionChanged(newSample) {
    demoInfo(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
}

// Display sample metadata
function demoInfo(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let result = metadata.filter(obj => obj.id == sample)[0];

        let panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Build bar chart for top 10 OTUs
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let result = samples.filter(obj => obj.id == sample)[0];

        let otu_ids = result.otu_ids;
        let sample_values = result.sample_values;
        let otu_labels = result.otu_labels;

        let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xValues = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        let barData = [{
            y: yTicks,
            x: xValues,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        let layout = {
            title: "Top 10 OTUs Found",
            margin: { t: 30, l: 100 }
        };

        Plotly.newPlot("bar", barData, layout);
    });
}

// Build bubble chart
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let result = samples.filter(obj => obj.id == sample)[0];

        let otu_ids = result.otu_ids;
        let sample_values = result.sample_values;
        let otu_labels = result.otu_labels;

        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        let layout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" },
            hovermode: "closest"
        };

        Plotly.newPlot("bubble", bubbleData, layout);
    });
}

// Initialize the dashboard
initialize();