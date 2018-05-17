/**
 * service.js
 *
 * A convenience express service for quickly getting a geospatial cluster index running.
 * This is provided as a quick-start for getting your own geospatial index and clustering service up and running,
 * though it can be used as-is for many applications.
 **/
import winston from 'winston';
import express from 'express';
import body_parser from 'body-parser';
import QuickHull from 'quickhull';
import QuadTree from '../filtering_quad_tree';
import ClusterGroup from '../cluster_group';

/**
 * The main ClusterService class
 */
class ClusterService {
    constructor(config) {
        if(!config) config = {};
        config = Object.assign({
            port: 3000,
            // let's default the bounds to the continental US
            bounds: {
                x1: -124.848974,
                y1: 49.384358,
                x2: -66.885444,
                y2: 24.396308
            },
            //this allows the resolution in the x and y directions to be determined based on zoom level on the map
            zoom_grid: { // [zoom level, cell size]
                "16": [6, 5], "15": [6, 5], "14": [6, 5],
                "13": [6, 5], "12": [6, 5], "11": [6, 5],
                "10": [6, 5], "9": [6, 5], "8": [6, 5],
                "7": [6, 5], "6": [6, 5]
            },
            //a map of functions that will be used as aggregations for each cluster.
            aggregator: {}
        }, config);
        this._config = config;
        this._aggregator = config.aggregator;
        this.init();
    }

    set aggregator(value) {
        this._aggregator = value;
    }

    get aggregator() {
        return this._aggregator;
    }


    /**
     * Set up a worker process to handle geospatial queries
     */
    init() {
        winston.info('Initializing geospatial service...');

        // Init the express application
        this._app = express();
        this._app.use(body_parser.json());
        this._app.route('/clusters').get(this.createClusters);

        this._app.route('/debug').get(this.dumpQuadTree);

        this._app.route('/data')
            .post(this.addPoint);

        this._app.route('/data/:dataId')
            .put(this.updatePoint)
            .delete(this.deletePoint);

        winston.info("Starting geospatial service...");
        // Start the app by listening on <port>
        app.listen(this._config.port);

        this.createQuadTree();
    }

    /**
     * 
     * @param {Array} data An array of data points. Each one *must* have at a minimum, an id, x and y property.
     */
    createQuadTree(data) {
        this._quadtree = new QuadTree(this._config.bounds);
        if(data && data.length)
            for(let i=0; i<data.length; i++)
                this._quadtree.insert(data[i]);

    }

    /**
     * For debugging purposes, render the entire quad tree to JSON for inspection
     * @param req
     * @param res
     */
    dumpQuadTree(req, res) {
        res.json(quadtree.inspect());
    }

    /**
     * Create the point clusters
     * @param {*} req 
     * @param {*} res 
     */
    createClusters(req, res) {
        let filters = req.body.filters;
        let bounds = req.body.bounds;
        let filter_functions = [];

        //let's create some simple filter functions based on the passed in filters object.
        //the basic theory here is that the data will be filtered based on the props in the filters object
        //this is a super basic filters representation, obviously these functions can be of arbitrary complexity,
        //just make some kind of helper that has filter functions based on the passed in values here
        if(filters)
            filter_functions = this.createFilters(filters);

        let cluster_group = new ClusterGroup(bounds, filter_functions, this._aggregator);
        res.status(200).json({status: 'ok', data: cluster_group.clusters});
    }

    /**
     * 
     * @param {Object} filters A simple object that will be used to filter data based on the properties passed in. 
     * 
     * @example {gender: 'm'} will filter data to only return points that have a property 'gender' with a value 'm'
     * {gender: 'm', age: '50'} will filter on 'gender' AND 'age'
     */
    createFilters(filters) {
        let functions = [];
        let keys = Object.keys(filters);

        keys.forEach(
            (key) => {
                let value = filters[key];
                //for this simple service, we'll only allow simple ascii values for both key and value (to prevent a nasty injection vlun)
                if(!/[a-zA-Z_$][0-9a-zA-Z_$]*/.test(key))
                    throw new Error("Invalid key in filters");
                if(!/[a-zA-Z_$][0-9a-zA-Z_$]*/.test(value))
                    throw new Error("Invalid value in filters");

                let f = new Function('point',`return point.${key} == ${value}`);
                functions.push(f);
            }
        );
        return functions;
    }

    /**
     * Add a point to the index
     * @param {*} req 
     * @param {*} res 
     */
    addPoint(req, res) {
        let data = req.body.data;
        if(!data)
            return res.status(400).json({status: 'error', message: 'missing data'});
        if(!data.id)
            return res.status(400).json({status: 'error', message: 'missing data id property'});
        if(!data.x)
            return res.status(400).json({status: 'error', message: 'missing data x property'});
        if(!data.y)
            return res.status(400).json({status: 'error', message: 'missing data y property'});

        this._quadtree.insert(data);

        res.status(200).json({status: 'ok'});

    }

    /**
     * Remove a point from the index
     * @param {*} req 
     * @param {*} res 
     */
    deletePoint(req, res) {
        let data_id = req.params.dataId;
        if (!data_id) 
            return res.status(400).json({status: 'error', message: 'missing dataId'}); 
        quadtree.remove(data_id);
        return res.status(200).json({status: 'ok'});
    }

    /**
     * Updates a point in the index
     * @param req
     * @param res
     */
    updatePoint(req, res) {
        let data_id = req.params.dataId;
        if (!data_id) 
            return res.status(400).json({status: 'error', message: 'missing dataId'}); 
        let data = req.body.data;
        data.id = data_id; //ensure the id is set on the data object to the one specified in the URL
        let found = quadtree.update(data);

        if (!found)
            return res.status(400).json({
                status: 'error',
                message: `data element with id ${data_id} was not found in the index`
            });

        return res.status(200).json({status: 'ok'});

    }

}

export default ClusterService;
