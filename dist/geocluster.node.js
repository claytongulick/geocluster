/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/cluster.js":
/*!************************!*\
  !*** ./src/cluster.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n/**\r\n * Represents a single cluster of points\r\n */\r\nclass Cluster {\r\n\r\n    /**\r\n     * Create a new cluster instance\r\n     * \r\n     * @param {Array} points An Array of points that the cluster is made from. Each point should have at a minimum, an x and y property.\r\n     * @param {object} aggregator An object that defines aggregate functions to use when creating the cluster. Each property of the aggregator \r\n     * object must contain a function that has the same signature as the Array.reduce function, which is what is used to perform the aggregation.\r\n     * The aggregation results will be stored as properties of the cluster.\r\n     * \r\n     * @example \r\n     * let c = new Cluster(points, {\r\n     *  average_age: (accumulator, point) => (accumulator + point.age) / points.length,\r\n     *  total_net_worth: (accumulator, point) => accumulator + point.net_worth\r\n     * });\r\n     * \r\n     * console.log(c.average_age);\r\n     * console.log(c.total_net_worth);\r\n     */\r\n    constructor(points, aggregator) {\r\n        this._points = points;\r\n        this._aggregator = aggregator;\r\n\r\n        let centroid = this.calculateCentroid();\r\n\r\n        if(aggregator)\r\n            this.aggregate();\r\n\r\n        var hull = QuickHull(raw_clusters[i]);\r\n        //convert to geojson friendly array\r\n        hull = hull.map(\r\n            function(point){\r\n                return [point.x,point.y]\r\n            });\r\n        this.count = points.length;\r\n        this.geojson = {\r\n            type: \"Point\",\r\n            coordinates: centroid\r\n        };\r\n\r\n        this.hull = {\r\n            type: \"Polygon\",\r\n            coordinates: [hull]\r\n        };\r\n\r\n    }\r\n\r\n    /**\r\n     * Apply aggregate functions\r\n     */\r\n    aggregate() {\r\n        let keys = Object.keys(this._aggregator);\r\n\r\n        for(let i=0; i<keys.length; keys++) {\r\n            let key = keys[i];\r\n            this[key] = Array.reduce(this._aggregator[key]);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Determine the centroid of the cluster of points. This is a 'quick and dirty' way of figuring out the rough center of a set\r\n     * of points, but is not the only way, especially if the points are weighted.\r\n     * \r\n     * TODO: consider providing for a pluggable mechanism to do this calculation that could potentially use things like weighting\r\n     * TODO: this one might be a good candidate for asm.js or wasm\r\n     */\r\n    calculateCentroid() {\r\n        let x_sum = 0;\r\n        let y_sum = 0;\r\n        //bring this to local scope for dereferencing speed\r\n        let points = this._points;\r\n        let count = points.length;\r\n\r\n        for (i = 0; i < count; i++) {\r\n            x_sum += points[i].x;\r\n            y_sum += points[i].y;\r\n        }\r\n\r\n        let centroid_x = x_sum / count;\r\n        let centroid_y = y_sum / count;\r\n\r\n        return [centroid_x, centroid_y];\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Cluster);\r\n\n\n//# sourceURL=webpack:///./src/cluster.js?");

/***/ }),

/***/ "./src/cluster_group.js":
/*!******************************!*\
  !*** ./src/cluster_group.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filtering_quad_tree */ \"./src/filtering_quad_tree.js\");\n/* harmony import */ var _cluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cluster */ \"./src/cluster.js\");\n\r\n\r\n\r\n/**\r\n * Represents a collection of Cluster instances with a specified bounds.\r\n * The rectangle represented by the bounds parameter will be divided up into a number of cells that will be queried individually\r\n * in order to create the points. A centroid will be taken for each region and used as the cluster location. The grid that is used\r\n * is determined by the x_resolution and y_resolution properties of the bounds parameter.\r\n * \r\n * A series of filter and aggregation functions can optionally be used to filter and to apply aggregation to each cluster.\r\n * \r\n * Note: the performance of clustering is mostly dependent on the performance and number of filter and aggregate functions used.\r\n */\r\nclass ClusterGroup {\r\n\r\n    /**\r\n     * \r\n     * @param {object} bounds An object specifying the bounds to use when querying the quad tree. The bounds object looks like:\r\n     *   var tree_bounds = {\r\n     *       x1: -159.5945515625, //the minimum x value\r\n     *       y1: 51.046627734117365, //the minumum y value\r\n     *       x2: -33.03205156249999, //the max x value\r\n     *       y2: 18.945338210762284, //the max y value\r\n     *       x_resolution: 6, //the number of cells in the x direction\r\n     *       y_resolution: 5 //the number of cells in the y direction\r\n     *   };\r\n     * @param {*} filters \r\n     * @param {*} aggregator \r\n     */\r\n    constructor(bounds, filters, aggregator) {\r\n        this._bounds = bounds;\r\n        this._filters = filters;\r\n        this._aggregator = aggregator;\r\n\r\n    }\r\n\r\n    createClusters(quadtree) {\r\n        let num_cells_x = this._bounds.x_resolution || 6;\r\n        let num_cells_y = this._bounds.y_resolution || 5;\r\n        let raw_cluster;\r\n        let stride_y = (this._bounds.y2 - this._bounds.y1) / num_cells_y;\r\n        let stride_x = (this._bounds.x2 - this._bounds.x1) / num_cells_x;\r\n        let count = 0, x_count = 0, y_count = 0;\r\n        let i, j;\r\n        let offset_x = this._bounds.x1;\r\n        let offset_y = this._bounds.y2;\r\n\r\n        let clusters = [];\r\n\r\n        //get the points in each cell\r\n        for (i = 0; i < num_cells_y; i++)\r\n            for (j = 0; j < num_cells_x; j++) {\r\n                var bounds = {\r\n                    x1: offset_x + (j * stride_x),\r\n                    y1: offset_y - (i * stride_y),\r\n                    x2: offset_x + ((j + 1) * stride_x),\r\n                    y2: offset_y - ((i + 1) * stride_y)\r\n                };\r\n                raw_cluster = quadtree.query(bounds, this._filters);\r\n                let cluster = new _cluster__WEBPACK_IMPORTED_MODULE_1__[\"default\"](raw_cluster, this._aggregator);\r\n                clusters.push(cluster);\r\n            }\r\n\r\n        return clusters;\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClusterGroup);\r\n\n\n//# sourceURL=webpack:///./src/cluster_group.js?");

/***/ }),

/***/ "./src/filtering_quad_tree.js":
/*!************************************!*\
  !*** ./src/filtering_quad_tree.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n * filteringQuadTree.js\r\n *\r\n * This is an implementation of a quad tree that allows points to be compared to a set of filters\r\n * in addition to the standard bounds queries\r\n *\r\n * @author Clayton Gulick <claytongulick@gmail.com>\r\n */\r\n\r\n\r\n/**\r\n * QuadTree with filters\r\n * @param {Object} bounds - object {x1,x2,y1,y2} - the bounds of the quad tree\r\n * @constructor\r\n */\r\nlet QuadTree = function(bounds, node_depth) {\r\n    //max number of objects in each bucket\r\n    var max_node_size = 4;\r\n\r\n    //max depth of the tree\r\n    var max_depth = 6;\r\n\r\n    //the child quad regions\r\n    var ne,nw,se,sw;\r\n\r\n    //the objects stored in this node. each object must have the properties x1,y1,x2,y2 and may have others\r\n    //for use in matching filter criteria\r\n    var objects = [];\r\n\r\n    //the depth of the node in the tree. root is 0\r\n    var depth = node_depth | 0;\r\n\r\n    var node_bounds = bounds;\r\n\r\n    /**\r\n     * For debugging purposes, returns internal variables of the node\r\n     * @returns {{max_node_side: number, max_depth: number, ne: *, nw: *, se: *, sw: *, objects: Array, depth: number, node_bounds: Object}}\r\n     */\r\n    function inspect() {\r\n        return {\r\n            max_node_side: max_node_size,\r\n            max_depth: max_depth,\r\n            ne: ne ? ne.inspect() : null,\r\n            nw: nw ? nw.inspect() : null,\r\n            se: se ? se.inspect() : null,\r\n            sw: sw ? sw.inspect() : null,\r\n            objects: objects,\r\n            depth: depth,\r\n            node_bounds: node_bounds\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Insert an object into the quad tree. Object must have properties x,y\r\n     * @param {Object} object\r\n     */\r\n    function insert(object) {\r\n        //if the point is out of bounds, bail\r\n        if(!containsPoint(object)) return false;\r\n\r\n        //if we have children, add it to one of them\r\n        if(nw) {\r\n            if(ne.insert(object)) return true;\r\n            if(nw.insert(object)) return true;\r\n            if(se.insert(object)) return true;\r\n            if(sw.insert(object)) return true;\r\n        }\r\n\r\n        //no children, add it to our own collection\r\n        objects.push(object);\r\n\r\n        if(objects.length <= max_node_size || depth >= max_depth) return true;\r\n\r\n        //if we're overflowing, split and move the points to the children nodes\r\n        split();\r\n\r\n        return true;\r\n    }\r\n\r\n    /**\r\n     * Updates an object in the quad tree. It is expected that there will be an id property in the passed in object,\r\n     * this is what will be used to locate the existing item and update it. This is going to execute in roughly O(n).\r\n     * @param {Object} object\r\n     */\r\n    function update(object) {\r\n        for(var i=0; i<objects.length; i++) {\r\n            if(objects[i].id.toString() == object.id.toString()) {\r\n                objects[i] = object;\r\n                return true;\r\n            }\r\n        }\r\n        \r\n        if(nw && nw.update(object)) return true;\r\n        if(ne && ne.update(object)) return true;\r\n        if(sw && sw.update(object)) return true;\r\n        if(se && se.update(object)) return true;\r\n\r\n        return false;\r\n    }\r\n    \r\n    /**\r\n     * Remove an object from the tree based on the provided id\r\n     */\r\n    function remove(id) {\r\n        for(var i=0; i<objects.length; i++) {\r\n            if(objects[i].id.toString() == id.toString()) {\r\n                objects.splice(i,1);\r\n                return true;\r\n            }\r\n        }\r\n        \r\n        if(nw && nw.remove(id)) return true;\r\n        if(ne && ne.remove(id)) return true;\r\n        if(sw && sw.remove(id)) return true;\r\n        if(se && se.remove(id)) return true;\r\n\r\n        return false;\r\n    }\r\n\r\n    /**\r\n     * Split the current node into child quads and move the points the the children\r\n     */\r\n    function split() {\r\n        var centerX = (node_bounds.x1 + node_bounds.x2) / 2;\r\n        var centerY = (node_bounds.y1 + node_bounds.y2) / 2;\r\n\r\n        nw = new QuadTree({x1: node_bounds.x1, y1: node_bounds.y1, x2: centerX, y2: centerY}, depth + 1);\r\n        ne = new QuadTree({x1: centerX, y1: node_bounds.y1, x2: node_bounds.x2, y2: centerY}, depth + 1);\r\n        sw = new QuadTree({x1: node_bounds.x1, y1: centerY, x2: centerX, y2: node_bounds.y2}, depth + 1);\r\n        se = new QuadTree({x1: centerX, y1: centerY, x2: node_bounds.x2, y2: node_bounds.y2}, depth + 1);\r\n\r\n        for(var i=0; i<objects.length; i++) {\r\n            var object = objects[i];\r\n            if(ne.insert(object)) continue;\r\n            if(nw.insert(object)) continue;\r\n            if(se.insert(object)) continue;\r\n            if(sw.insert(object)) continue;\r\n            throw \"Unable to allocate to subtree\";\r\n        }\r\n\r\n        objects = [];\r\n    }\r\n\r\n    /**\r\n     * Test to see if this node intersects or overlaps the specified bounds\r\n     * @param {Object} test_bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points\r\n     */\r\n    function intersects(test_bounds) {\r\n        if(test_bounds.x1 > node_bounds.x2) return false;\r\n        if(test_bounds.x2 < node_bounds.x1) return false;\r\n        if(test_bounds.y1 < node_bounds.y2) return false;\r\n        if(test_bounds.y2 > node_bounds.y1) return false;\r\n\r\n        return true;\r\n    }\r\n\r\n    /**\r\n     * Test to see if point lies inside the node. We're assuming y increases moving up on the y axis (as in latitude\r\n     * above the equator)\r\n     * @param point - object an object that has properties x and y\r\n     */\r\n    function containsPoint(point) {\r\n        return (point.x >= node_bounds.x1) && (point.x <= node_bounds.x2) && (point.y <= node_bounds.y1) && (point.y >= node_bounds.y2);\r\n    }\r\n\r\n    /**\r\n     * Get all points in the quad tree that lie inside the bounds {x1,y1,x2,y2} and match the filter criteria\r\n     * @param {Object} bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points\r\n     * @param {Array} filters - array an array of filter functions that will be applied to each point to test for inclusion\r\n     */\r\n    function query(bounds, filters) {\r\n        var found_objects = [];\r\n\r\n        //first make sure this node is in bounds\r\n        if(!intersects(bounds)) return found_objects;\r\n\r\n        if(nw) { //if we have children, recurse\r\n            found_objects = found_objects.concat(nw.query(bounds, filters));\r\n            found_objects = found_objects.concat(ne.query(bounds, filters));\r\n            found_objects = found_objects.concat(sw.query(bounds, filters));\r\n            found_objects = found_objects.concat(se.query(bounds, filters));\r\n        }\r\n        else {\r\n            for(var i=0; i<objects.length; i++) {\r\n                var point = objects[i];\r\n                if(\r\n                    (point.x >= bounds.x1) &&\r\n                    (point.x <= bounds.x2) &&\r\n                    (point.y <= bounds.y1) &&\r\n                    (point.y >= bounds.y2)\r\n                )\r\n                    found_objects.push(point);\r\n            }\r\n\r\n            //apply the filters\r\n            filters.forEach(\r\n                function(filter) {\r\n                    found_objects = found_objects.filter(filter);\r\n                }\r\n            );\r\n        }\r\n        return found_objects;\r\n    }\r\n\r\n\r\n    //Public API\r\n    this.inspect = inspect;\r\n    this.insert = insert;\r\n    this.query = query;\r\n    this.update = update;\r\n    this.remove = remove;\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (QuadTree);\r\n\n\n//# sourceURL=webpack:///./src/filtering_quad_tree.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Cluster, ClusterGroup, QuadTree, ClusterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cluster_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cluster_group */ \"./src/cluster_group.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ClusterGroup\", function() { return _cluster_group__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _cluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cluster */ \"./src/cluster.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Cluster\", function() { return _cluster__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filtering_quad_tree */ \"./src/filtering_quad_tree.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"QuadTree\", function() { return _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _service_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./service/service */ \"./src/service/service.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ClusterService\", function() { return _service_service__WEBPACK_IMPORTED_MODULE_3__[\"default\"]; });\n\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/service/service.js":
/*!********************************!*\
  !*** ./src/service/service.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! winston */ \"winston\");\n/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(winston__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var quickhull__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! quickhull */ \"quickhull\");\n/* harmony import */ var quickhull__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(quickhull__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../filtering_quad_tree */ \"./src/filtering_quad_tree.js\");\n/* harmony import */ var _cluster_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cluster_group */ \"./src/cluster_group.js\");\n/**\r\n * service.js\r\n *\r\n * A convenience express service for quickly getting a geospatial cluster index running.\r\n * This is provided as a quick-start for getting your own geospatial index and clustering service up and running,\r\n * though it can be used as-is for many applications.\r\n **/\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n/**\r\n * The main ClusterService class\r\n */\r\nclass ClusterService {\r\n    constructor(config) {\r\n        if(!config) config = {};\r\n        config = Object.assign({\r\n            port: 3000,\r\n            // let's default the bounds to the continental US\r\n            bounds: {\r\n                x1: -124.848974,\r\n                y1: 49.384358,\r\n                x2: -66.885444,\r\n                y2: 24.396308\r\n            },\r\n            //this allows the resolution in the x and y directions to be determined based on zoom level on the map\r\n            zoom_grid: { // [zoom level, cell size]\r\n                \"16\": [6, 5], \"15\": [6, 5], \"14\": [6, 5],\r\n                \"13\": [6, 5], \"12\": [6, 5], \"11\": [6, 5],\r\n                \"10\": [6, 5], \"9\": [6, 5], \"8\": [6, 5],\r\n                \"7\": [6, 5], \"6\": [6, 5]\r\n            },\r\n            //a map of functions that will be used as aggregations for each cluster.\r\n            aggregator: {}\r\n        }, config);\r\n        this._config = config;\r\n        this._aggregator = config.aggregator;\r\n        this.init();\r\n    }\r\n\r\n    set aggregator(value) {\r\n        this._aggregator = value;\r\n    }\r\n\r\n    get aggregator() {\r\n        return this._aggregator;\r\n    }\r\n\r\n\r\n    /**\r\n     * Set up a worker process to handle geospatial queries\r\n     */\r\n    init() {\r\n        winston__WEBPACK_IMPORTED_MODULE_0___default.a.info('Initializing geospatial service...');\r\n\r\n        // Init the express application\r\n        this._app = express__WEBPACK_IMPORTED_MODULE_1___default()();\r\n        this._app.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.json());\r\n        this._app.route('/clusters').get(this.createClusters);\r\n\r\n        this._app.route('/debug').get(this.dumpQuadTree);\r\n\r\n        this._app.route('/data')\r\n            .post(this.addPoint);\r\n\r\n        this._app.route('/data/:dataId')\r\n            .put(this.updatePoint)\r\n            .delete(this.deletePoint);\r\n\r\n        winston__WEBPACK_IMPORTED_MODULE_0___default.a.info(\"Starting geospatial service...\");\r\n        // Start the app by listening on <port>\r\n        app.listen(this._config.port);\r\n\r\n        this.createQuadTree();\r\n    }\r\n\r\n    /**\r\n     * \r\n     * @param {Array} data An array of data points. Each one *must* have at a minimum, an id, x and y property.\r\n     */\r\n    createQuadTree(data) {\r\n        this._quadtree = new _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_4__[\"default\"](this._config.bounds);\r\n        if(data && data.length)\r\n            for(let i=0; i<data.length; i++)\r\n                this._quadtree.insert(data[i]);\r\n\r\n    }\r\n\r\n    /**\r\n     * For debugging purposes, render the entire quad tree to JSON for inspection\r\n     * @param req\r\n     * @param res\r\n     */\r\n    dumpQuadTree(req, res) {\r\n        res.json(quadtree.inspect());\r\n    }\r\n\r\n    /**\r\n     * Create the point clusters\r\n     * @param {*} req \r\n     * @param {*} res \r\n     */\r\n    createClusters(req, res) {\r\n        let filters = req.body.filters;\r\n        let bounds = req.body.bounds;\r\n        let filter_functions = [];\r\n\r\n        //let's create some simple filter functions based on the passed in filters object.\r\n        //the basic theory here is that the data will be filtered based on the props in the filters object\r\n        //this is a super basic filters representation, obviously these functions can be of arbitrary complexity,\r\n        //just make some kind of helper that has filter functions based on the passed in values here\r\n        if(filters)\r\n            filter_functions = this.createFilters(filters);\r\n\r\n        let cluster_group = new _cluster_group__WEBPACK_IMPORTED_MODULE_5__[\"default\"](bounds, filter_functions, this._aggregator);\r\n        res.status(200).json({status: 'ok', data: cluster_group.clusters});\r\n    }\r\n\r\n    /**\r\n     * \r\n     * @param {Object} filters A simple object that will be used to filter data based on the properties passed in. \r\n     * \r\n     * @example {gender: 'm'} will filter data to only return points that have a property 'gender' with a value 'm'\r\n     * {gender: 'm', age: '50'} will filter on 'gender' AND 'age'\r\n     */\r\n    createFilters(filters) {\r\n        let functions = [];\r\n        let keys = Object.keys(filters);\r\n\r\n        keys.forEach(\r\n            (key) => {\r\n                let value = filters[key];\r\n                //for this simple service, we'll only allow simple ascii values for both key and value (to prevent a nasty injection vlun)\r\n                if(!/[a-zA-Z_$][0-9a-zA-Z_$]*/.test(key))\r\n                    throw new Error(\"Invalid key in filters\");\r\n                if(!/[a-zA-Z_$][0-9a-zA-Z_$]*/.test(value))\r\n                    throw new Error(\"Invalid value in filters\");\r\n\r\n                let f = new Function('point',`return point.${key} == ${value}`);\r\n                functions.push(f);\r\n            }\r\n        );\r\n        return functions;\r\n    }\r\n\r\n    /**\r\n     * Add a point to the index\r\n     * @param {*} req \r\n     * @param {*} res \r\n     */\r\n    addPoint(req, res) {\r\n        let data = req.body.data;\r\n        if(!data)\r\n            return res.status(400).json({status: 'error', message: 'missing data'});\r\n        if(!data.id)\r\n            return res.status(400).json({status: 'error', message: 'missing data id property'});\r\n        if(!data.x)\r\n            return res.status(400).json({status: 'error', message: 'missing data x property'});\r\n        if(!data.y)\r\n            return res.status(400).json({status: 'error', message: 'missing data y property'});\r\n\r\n        this._quadtree.insert(data);\r\n\r\n        res.status(200).json({status: 'ok'});\r\n\r\n    }\r\n\r\n    /**\r\n     * Remove a point from the index\r\n     * @param {*} req \r\n     * @param {*} res \r\n     */\r\n    deletePoint(req, res) {\r\n        let data_id = req.params.dataId;\r\n        if (!data_id) \r\n            return res.status(400).json({status: 'error', message: 'missing dataId'}); \r\n        quadtree.remove(data_id);\r\n        return res.status(200).json({status: 'ok'});\r\n    }\r\n\r\n    /**\r\n     * Updates a point in the index\r\n     * @param req\r\n     * @param res\r\n     */\r\n    updatePoint(req, res) {\r\n        let data_id = req.params.dataId;\r\n        if (!data_id) \r\n            return res.status(400).json({status: 'error', message: 'missing dataId'}); \r\n        let data = req.body.data;\r\n        data.id = data_id; //ensure the id is set on the data object to the one specified in the URL\r\n        let found = quadtree.update(data);\r\n\r\n        if (!found)\r\n            return res.status(400).json({\r\n                status: 'error',\r\n                message: `data element with id ${data_id} was not found in the index`\r\n            });\r\n\r\n        return res.status(200).json({status: 'ok'});\r\n\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClusterService);\r\n\n\n//# sourceURL=webpack:///./src/service/service.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "quickhull":
/*!****************************!*\
  !*** external "quickhull" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"quickhull\");\n\n//# sourceURL=webpack:///external_%22quickhull%22?");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"winston\");\n\n//# sourceURL=webpack:///external_%22winston%22?");

/***/ })

/******/ });