import kmeans from 'ml-kmeans';

self.addEventListener("message", runCluster);

function runCluster(event) {
    console.log(event.data, self)
    let imageData = event.data;
    let pixels = [];
    for (var i = 0; i < imageData.length; i += 4) {
        pixels.push([imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]]);
    }

    let ans = kmeans(pixels, 10);

    let centroids = ans.centroids;
    console.log(centroids);
    let palette = centroids.map(centroid => {
        return centroid.centroid.map(value => Math.round(value));
    });
    console.log(centroids);

    this.postMessage(palette);
}