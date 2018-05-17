import QuadTree from './filtering_quad_tree';
import Cluster from './cluster';

/**
 * Represents a collection of Cluster instances with a specified bounds.
 * The rectangle represented by the bounds parameter will be divided up into a number of cells that will be queried individually
 * in order to create the points. A centroid will be taken for each region and used as the cluster location. The grid that is used
 * is determined by the x_resolution and y_resolution properties of the bounds parameter.
 * 
 * A series of filter and aggregation functions can optionally be used to filter and to apply aggregation to each cluster.
 * 
 * Note: the performance of clustering is mostly dependent on the performance and number of filter and aggregate functions used.
 */
class ClusterGroup {

    /**
     * 
     * @param {object} bounds An object specifying the bounds to use when querying the quad tree. The bounds object looks like:
     *   var tree_bounds = {
     *       x1: -159.5945515625, //the minimum x value
     *       y1: 51.046627734117365, //the minumum y value
     *       x2: -33.03205156249999, //the max x value
     *       y2: 18.945338210762284, //the max y value
     *       x_resolution: 6, //the number of cells in the x direction
     *       y_resolution: 5 //the number of cells in the y direction
     *   };
     * @param {*} filters 
     * @param {*} aggregator 
     */
    constructor(bounds, filters, aggregator) {
        this._bounds = bounds;
        this._filters = filters;
        this._aggregator = aggregator;

    }

    createClusters(quadtree) {
        let num_cells_x = this._bounds.x_resolution || 6;
        let num_cells_y = this._bounds.y_resolution || 5;
        let raw_cluster;
        let stride_y = (this._bounds.y2 - this._bounds.y1) / num_cells_y;
        let stride_x = (this._bounds.x2 - this._bounds.x1) / num_cells_x;
        let count = 0, x_count = 0, y_count = 0;
        let i, j;
        let offset_x = this._bounds.x1;
        let offset_y = this._bounds.y2;

        let clusters = [];

        //get the points in each cell
        for (i = 0; i < num_cells_y; i++)
            for (j = 0; j < num_cells_x; j++) {
                var bounds = {
                    x1: offset_x + (j * stride_x),
                    y1: offset_y - (i * stride_y),
                    x2: offset_x + ((j + 1) * stride_x),
                    y2: offset_y - ((i + 1) * stride_y)
                };
                raw_cluster = quadtree.query(bounds, this._filters);
                let cluster = new Cluster(raw_cluster, this._aggregator);
                clusters.push(cluster);
            }

        return clusters;
    }

}

export default ClusterGroup;
