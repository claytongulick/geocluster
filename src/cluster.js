
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
/**
 * Use the quad tree to cluster points on the map according to the passed in filters
 * @param req
 * @param res
 */
function createClusters(req, res) {
    var zoom = parseInt(req.param('zoom')) || 16;
    var filters = Filters.getFilters(req.param('filters'));


    var deaggregation_threshold = 15;
    var num_cells_x = zoom_grid[zoom.toString()][0];
    var num_cells_y = zoom_grid[zoom.toString()][1];
    var raw_cluster, raw_clusters = [];
    var clusters = [];
    var stride_y = (max_latitude - min_latitude) / num_cells_y;
    var stride_x = (max_longitude - min_longitude) / num_cells_x;
    var count = 0, x_count=0, y_count=0;
    var i,j;
    var offset_x = min_longitude;
    var offset_y = max_latitude;
    var centroid_x, centroid_y;

    //get the points in each cell
    for(i=0; i<num_cells_y; i++)
        for(j=0; j<num_cells_x;j++) {
            var bounds = {
                x1: offset_x + (j * stride_x),
                y1: offset_y - (i * stride_y),
                x2: offset_x + ((j + 1) * stride_x),
                y2: offset_y - ((i + 1) * stride_y)
            };
            raw_cluster = quadtree.query(bounds,filters);
            if(raw_cluster.length > 0)
                raw_clusters.push(raw_cluster);
        }

    //calculate the centroids of each cluster, also gather all the service coordinators
    for(i=0; i<raw_clusters.length; i++) {
        count = raw_clusters[i].length;
        //deal with deaggregation
        //TODO: make this not ghetto --ccg
        if(count <= deaggregation_threshold) {
            for (j = 0; j < count; j++) {
                clusters.push({
                    _id: raw_clusters[i][j].id,
                    sc: raw_clusters[i][j].sc,
                    u: raw_clusters[i][j].u,
                    sd: raw_clusters[i][j].sd,
                    dd: raw_clusters[i][j].dd,
                    ndd: raw_clusters[i][j].ndd,
                    nv: raw_clusters[i][j].nv,
                    address: {
                        geo: {
                            geojson: {
                                type: "Point",
                                coordinates: [raw_clusters[i][j].x, raw_clusters[i][j].y]
                            }
                        }
                    }
                })
            }
            continue;
        }
        x_count = 0;
        y_count = 0;
        for (j = 0; j < count; j++) {
            x_count += raw_clusters[i][j].x;
            y_count += raw_clusters[i][j].y;
        }
        centroid_x = x_count / count;
        centroid_y = y_count / count;
        var hull = QuickHull(raw_clusters[i]);
        hull = hull.map(
            function(point){
                return [point.x,point.y]
            });
        clusters.push({
            count: count,
            geojson: {
                type: "Point",
                coordinates: [centroid_x, centroid_y]
            },
            hull: {
                type: "Polygon",
                coordinates: [hull]
            }
        })
    }

    utility.responseHandler(res)(null, clusters);
}
