// const kmeans = require('ml-kmeans');
importScripts('ml.min.js')
const _ = require('lodash');

self.addEventListener("message", runCluster); // eslint-disable-line no-restricted-globals

function runCluster(event) {
    // console.log(event.data, self) // eslint-disable-line no-restricted-globals
    console.log(ML);
    let imageData = event.data;
    let pixels = [];
    for (var i = 0; i < imageData.length; i += 4) {
        pixels.push([imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]]);
    }

    let ans = ML.KMeans.default(pixels, 20);

    let centroids = ans.centroids;
    let palette = centroids.map(centroid => {
        return { centroid: centroid.centroid.map(value => Math.round(value)), size: centroid.size};
    });
    console.log(centroids);
    console.log(palette)

    let ratios = {};
    let whiteRatios = [];
    
    for(let i = 0; i < palette.length - 1; i++) {
        for (let j = 1; j < palette.length; j++) {
            ratios[contrast(palette[i].centroid, palette[j].centroid)] = [palette[i].centroid, palette[j].centroid];
        }
    }

    for(let i = 0; i < palette.length; i++) {
        whiteRatios.push({ ratio: contrast([255,255,255,255], palette[i].centroid), colors: [palette[i].centroid, [255,255,255,255]], size: palette[i].size});
    }

    whiteRatios = _.filter(whiteRatios, function(o) { return o.ratio > 4.5; });
    let sorted = _.orderBy(whiteRatios, ['size'], ['asc'])
    let mid = Math.round(sorted.length / 2);
    let median = sorted[mid];

    this.postMessage({
        palette: palette,
        ratios: ratios,
        backColor: `rgba(${median.colors[0][0]},${median.colors[0][1]},${median.colors[0][2]},${median.colors[0][3]})`
    });
}

function luminanace(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
    return (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05)
         / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
}