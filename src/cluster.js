
/**
 * Represents a single cluster of points
 */
class Cluster {

    /**
     * Create a new cluster instance
     * 
     * @param {Array} points An Array of points that the cluster is made from. Each point should have at a minimum, an x and y property.
     * @param {object} aggregator An object that defines aggregate functions to use when creating the cluster. Each property of the aggregator 
     * object must contain a function that has the same signature as the Array.reduce function, which is what is used to perform the aggregation.
     * The aggregation results will be stored as properties of the cluster.
     * 
     * @example 
     * let c = new Cluster(points, {
     *  average_age: (accumulator, point) => (accumulator + point.age) / points.length,
     *  total_net_worth: (accumulator, point) => accumulator + point.net_worth
     * });
     * 
     * console.log(c.average_age);
     * console.log(c.total_net_worth);
     */
    constructor(points, aggregator) {
        this._points = points;
        this._aggregator = aggregator;

        let centroid = this.calculateCentroid();

        if(aggregator)
            this.aggregate();

        var hull = QuickHull(raw_clusters[i]);
        //convert to geojson friendly array
        hull = hull.map(
            function(point){
                return [point.x,point.y]
            });
        this.count = points.length;
        this.geojson = {
            type: "Point",
            coordinates: centroid
        };

        this.hull = {
            type: "Polygon",
            coordinates: [hull]
        };

    }

    /**
     * Apply aggregate functions
     */
    aggregate() {
        let keys = Object.keys(this._aggregator);

        for(let i=0; i<keys.length; keys++) {
            let key = keys[i];
            this[key] = Array.reduce(this._aggregator[key]);
        }
    }

    /**
     * Determine the centroid of the cluster of points. This is a 'quick and dirty' way of figuring out the rough center of a set
     * of points, but is not the only way, especially if the points are weighted.
     * 
     * TODO: consider providing for a pluggable mechanism to do this calculation that could potentially use things like weighting
     * TODO: this one might be a good candidate for asm.js or wasm
     */
    calculateCentroid() {
        let x_sum = 0;
        let y_sum = 0;
        //bring this to local scope for dereferencing speed
        let points = this._points;
        let count = points.length;

        for (i = 0; i < count; i++) {
            x_sum += points[i].x;
            y_sum += points[i].y;
        }

        let centroid_x = x_sum / count;
        let centroid_y = y_sum / count;

        return [centroid_x, centroid_y];
    }
}

export default Cluster;
