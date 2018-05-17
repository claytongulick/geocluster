var GeoCluster =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.node.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.node.js":
/*!***********************!*\
  !*** ./index.node.js ***!
  \***********************/
/*! exports provided: Cluster, ClusterGroup, QuadTree, ClusterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_cluster_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/cluster_group */ \"./src/cluster_group.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ClusterGroup\", function() { return _src_cluster_group__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _src_cluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/cluster */ \"./src/cluster.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Cluster\", function() { return _src_cluster__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _src_filtering_quad_tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/filtering_quad_tree */ \"./src/filtering_quad_tree.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"QuadTree\", function() { return _src_filtering_quad_tree__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _src_service_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/service/service */ \"./src/service/service.js\");\n/* harmony import */ var _src_service_service__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_src_service_service__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, \"ClusterService\", function() { return _src_service_service__WEBPACK_IMPORTED_MODULE_3___default.a; });\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://GeoCluster/./index.node.js?");

/***/ }),

/***/ "./src/cluster.js":
/*!************************!*\
  !*** ./src/cluster.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n/**\r\n * Represents a single cluster of points\r\n */\r\nclass Cluster {\r\n\r\n    /**\r\n     * Create a new cluster instance\r\n     * \r\n     * @param {Array} points An Array of points that the cluster is made from. Each point should have at a minimum, an x and y property.\r\n     * @param {object} aggregator An object that defines aggregate functions to use when creating the cluster. Each property of the aggregator \r\n     * object must contain a function that has the same signature as the Array.reduce function, which is what is used to perform the aggregation.\r\n     * The aggregation results will be stored as properties of the cluster.\r\n     * \r\n     * @example \r\n     * let c = new Cluster(points, {\r\n     *  average_age: (accumulator, point) => (accumulator + point.age) / points.length,\r\n     *  total_net_worth: (accumulator, point) => accumulator + point.net_worth\r\n     * });\r\n     * \r\n     * console.log(c.average_age);\r\n     * console.log(c.total_net_worth);\r\n     */\r\n    constructor(points, aggregator) {\r\n        this._points = points;\r\n        this._aggregator = aggregator;\r\n\r\n        let centroid = this.calculateCentroid();\r\n\r\n        if(aggregator)\r\n            this.aggregate();\r\n\r\n        var hull = QuickHull(raw_clusters[i]);\r\n        //convert to geojson friendly array\r\n        hull = hull.map(\r\n            function(point){\r\n                return [point.x,point.y]\r\n            });\r\n        this.count = points.length;\r\n        this.geojson = {\r\n            type: \"Point\",\r\n            coordinates: centroid\r\n        };\r\n\r\n        this.hull = {\r\n            type: \"Polygon\",\r\n            coordinates: [hull]\r\n        };\r\n\r\n    }\r\n\r\n    /**\r\n     * Apply aggregate functions\r\n     */\r\n    aggregate() {\r\n        let keys = Object.keys(this._aggregator);\r\n\r\n        for(let i=0; i<keys.length; keys++) {\r\n            let key = keys[i];\r\n            this[key] = Array.reduce(this._aggregator[key]);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Determine the centroid of the cluster of points. This is a 'quick and dirty' way of figuring out the rough center of a set\r\n     * of points, but is not the only way, especially if the points are weighted.\r\n     * \r\n     * TODO: consider providing for a pluggable mechanism to do this calculation that could potentially use things like weighting\r\n     * TODO: this one might be a good candidate for asm.js or wasm\r\n     */\r\n    calculateCentroid() {\r\n        let x_sum = 0;\r\n        let y_sum = 0;\r\n        //bring this to local scope for dereferencing speed\r\n        let points = this._points;\r\n        let count = points.length;\r\n\r\n        for (i = 0; i < count; i++) {\r\n            x_sum += points[i].x;\r\n            y_sum += points[i].y;\r\n        }\r\n\r\n        let centroid_x = x_sum / count;\r\n        let centroid_y = y_sum / count;\r\n\r\n        return [centroid_x, centroid_y];\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Cluster);\r\n\n\n//# sourceURL=webpack://GeoCluster/./src/cluster.js?");

/***/ }),

/***/ "./src/cluster_group.js":
/*!******************************!*\
  !*** ./src/cluster_group.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _filtering_quad_tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filtering_quad_tree */ \"./src/filtering_quad_tree.js\");\n/* harmony import */ var _cluster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cluster */ \"./src/cluster.js\");\n\r\n\r\n\r\n/**\r\n * Represents a collection of Cluster instances with a specified bounds.\r\n * The rectangle represented by the bounds parameter will be divided up into a number of cells that will be queried individually\r\n * in order to create the points. A centroid will be taken for each region and used as the cluster location. The grid that is used\r\n * is determined by the x_resolution and y_resolution properties of the bounds parameter.\r\n * \r\n * A series of filter and aggregation functions can optionally be used to filter and to apply aggregation to each cluster.\r\n * \r\n * Note: the performance of clustering is mostly dependent on the performance and number of filter and aggregate functions used.\r\n */\r\nclass ClusterGroup {\r\n\r\n    /**\r\n     * \r\n     * @param {object} bounds An object specifying the bounds to use when querying the quad tree. The bounds object looks like:\r\n     *   var tree_bounds = {\r\n     *       x1: -159.5945515625, //the minimum x value\r\n     *       y1: 51.046627734117365, //the minumum y value\r\n     *       x2: -33.03205156249999, //the max x value\r\n     *       y2: 18.945338210762284, //the max y value\r\n     *       x_resolution: 6, //the number of cells in the x direction\r\n     *       y_resolution: 5 //the number of cells in the y direction\r\n     *   };\r\n     * @param {*} filters \r\n     * @param {*} aggregator \r\n     */\r\n    constructor(bounds, filters, aggregator) {\r\n        this._bounds = bounds;\r\n        this._filters = filters;\r\n        this._aggregator = aggregator;\r\n\r\n    }\r\n\r\n    createClusters(quadtree) {\r\n        let num_cells_x = this._bounds.x_resolution || 6;\r\n        let num_cells_y = this._bounds.y_resolution || 5;\r\n        let raw_cluster;\r\n        let stride_y = (this._bounds.y2 - this._bounds.y1) / num_cells_y;\r\n        let stride_x = (this._bounds.x2 - this._bounds.x1) / num_cells_x;\r\n        let count = 0, x_count = 0, y_count = 0;\r\n        let i, j;\r\n        let offset_x = this._bounds.x1;\r\n        let offset_y = this._bounds.y2;\r\n\r\n        let clusters = [];\r\n\r\n        //get the points in each cell\r\n        for (i = 0; i < num_cells_y; i++)\r\n            for (j = 0; j < num_cells_x; j++) {\r\n                var bounds = {\r\n                    x1: offset_x + (j * stride_x),\r\n                    y1: offset_y - (i * stride_y),\r\n                    x2: offset_x + ((j + 1) * stride_x),\r\n                    y2: offset_y - ((i + 1) * stride_y)\r\n                };\r\n                raw_cluster = quadtree.query(bounds, this._filters);\r\n                let cluster = new _cluster__WEBPACK_IMPORTED_MODULE_1__[\"default\"](raw_cluster, this._aggregator);\r\n                clusters.push(cluster);\r\n            }\r\n\r\n        return clusters;\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClusterGroup);\r\n\n\n//# sourceURL=webpack://GeoCluster/./src/cluster_group.js?");

/***/ }),

/***/ "./src/filtering_quad_tree.js":
/*!************************************!*\
  !*** ./src/filtering_quad_tree.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n * filteringQuadTree.js\r\n *\r\n * This is an implementation of a quad tree that allows points to be compared to a set of filters\r\n * in addition to the standard bounds queries\r\n *\r\n * @author Clayton Gulick <claytongulick@gmail.com>\r\n */\r\n\r\n\r\n/**\r\n * QuadTree with filters\r\n * @param {Object} bounds - object {x1,x2,y1,y2} - the bounds of the quad tree\r\n * @constructor\r\n */\r\nlet QuadTree = function(bounds, node_depth) {\r\n    //max number of objects in each bucket\r\n    var max_node_size = 4;\r\n\r\n    //max depth of the tree\r\n    var max_depth = 6;\r\n\r\n    //the child quad regions\r\n    var ne,nw,se,sw;\r\n\r\n    //the objects stored in this node. each object must have the properties x1,y1,x2,y2 and may have others\r\n    //for use in matching filter criteria\r\n    var objects = [];\r\n\r\n    //the depth of the node in the tree. root is 0\r\n    var depth = node_depth | 0;\r\n\r\n    var node_bounds = bounds;\r\n\r\n    /**\r\n     * For debugging purposes, returns internal variables of the node\r\n     * @returns {{max_node_side: number, max_depth: number, ne: *, nw: *, se: *, sw: *, objects: Array, depth: number, node_bounds: Object}}\r\n     */\r\n    function inspect() {\r\n        return {\r\n            max_node_side: max_node_size,\r\n            max_depth: max_depth,\r\n            ne: ne ? ne.inspect() : null,\r\n            nw: nw ? nw.inspect() : null,\r\n            se: se ? se.inspect() : null,\r\n            sw: sw ? sw.inspect() : null,\r\n            objects: objects,\r\n            depth: depth,\r\n            node_bounds: node_bounds\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Insert an object into the quad tree. Object must have properties x,y\r\n     * @param {Object} object\r\n     */\r\n    function insert(object) {\r\n        //if the point is out of bounds, bail\r\n        if(!containsPoint(object)) return false;\r\n\r\n        //if we have children, add it to one of them\r\n        if(nw) {\r\n            if(ne.insert(object)) return true;\r\n            if(nw.insert(object)) return true;\r\n            if(se.insert(object)) return true;\r\n            if(sw.insert(object)) return true;\r\n        }\r\n\r\n        //no children, add it to our own collection\r\n        objects.push(object);\r\n\r\n        if(objects.length <= max_node_size || depth >= max_depth) return true;\r\n\r\n        //if we're overflowing, split and move the points to the children nodes\r\n        split();\r\n\r\n        return true;\r\n    }\r\n\r\n    /**\r\n     * Updates an object in the quad tree. It is expected that there will be an id property in the passed in object,\r\n     * this is what will be used to locate the existing item and update it. This is going to execute in roughly O(n).\r\n     * @param {Object} object\r\n     */\r\n    function update(object) {\r\n        for(var i=0; i<objects.length; i++) {\r\n            if(objects[i].id.toString() == object.id.toString()) {\r\n                objects[i] = object;\r\n                return true;\r\n            }\r\n        }\r\n        \r\n        if(nw && nw.update(object)) return true;\r\n        if(ne && ne.update(object)) return true;\r\n        if(sw && sw.update(object)) return true;\r\n        if(se && se.update(object)) return true;\r\n\r\n        return false;\r\n    }\r\n    \r\n    /**\r\n     * Remove an object from the tree based on the provided id\r\n     */\r\n    function remove(id) {\r\n        for(var i=0; i<objects.length; i++) {\r\n            if(objects[i].id.toString() == id.toString()) {\r\n                objects.splice(i,1);\r\n                return true;\r\n            }\r\n        }\r\n        \r\n        if(nw && nw.remove(id)) return true;\r\n        if(ne && ne.remove(id)) return true;\r\n        if(sw && sw.remove(id)) return true;\r\n        if(se && se.remove(id)) return true;\r\n\r\n        return false;\r\n    }\r\n\r\n    /**\r\n     * Split the current node into child quads and move the points the the children\r\n     */\r\n    function split() {\r\n        var centerX = (node_bounds.x1 + node_bounds.x2) / 2;\r\n        var centerY = (node_bounds.y1 + node_bounds.y2) / 2;\r\n\r\n        nw = new QuadTree({x1: node_bounds.x1, y1: node_bounds.y1, x2: centerX, y2: centerY}, depth + 1);\r\n        ne = new QuadTree({x1: centerX, y1: node_bounds.y1, x2: node_bounds.x2, y2: centerY}, depth + 1);\r\n        sw = new QuadTree({x1: node_bounds.x1, y1: centerY, x2: centerX, y2: node_bounds.y2}, depth + 1);\r\n        se = new QuadTree({x1: centerX, y1: centerY, x2: node_bounds.x2, y2: node_bounds.y2}, depth + 1);\r\n\r\n        for(var i=0; i<objects.length; i++) {\r\n            var object = objects[i];\r\n            if(ne.insert(object)) continue;\r\n            if(nw.insert(object)) continue;\r\n            if(se.insert(object)) continue;\r\n            if(sw.insert(object)) continue;\r\n            throw \"Unable to allocate to subtree\";\r\n        }\r\n\r\n        objects = [];\r\n    }\r\n\r\n    /**\r\n     * Test to see if this node intersects or overlaps the specified bounds\r\n     * @param {Object} test_bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points\r\n     */\r\n    function intersects(test_bounds) {\r\n        if(test_bounds.x1 > node_bounds.x2) return false;\r\n        if(test_bounds.x2 < node_bounds.x1) return false;\r\n        if(test_bounds.y1 < node_bounds.y2) return false;\r\n        if(test_bounds.y2 > node_bounds.y1) return false;\r\n\r\n        return true;\r\n    }\r\n\r\n    /**\r\n     * Test to see if point lies inside the node. We're assuming y increases moving up on the y axis (as in latitude\r\n     * above the equator)\r\n     * @param point - object an object that has properties x and y\r\n     */\r\n    function containsPoint(point) {\r\n        return (point.x >= node_bounds.x1) && (point.x <= node_bounds.x2) && (point.y <= node_bounds.y1) && (point.y >= node_bounds.y2);\r\n    }\r\n\r\n    /**\r\n     * Get all points in the quad tree that lie inside the bounds {x1,y1,x2,y2} and match the filter criteria\r\n     * @param {Object} bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points\r\n     * @param {Array} filters - array an array of filter functions that will be applied to each point to test for inclusion\r\n     */\r\n    function query(bounds, filters) {\r\n        var found_objects = [];\r\n\r\n        //first make sure this node is in bounds\r\n        if(!intersects(bounds)) return found_objects;\r\n\r\n        if(nw) { //if we have children, recurse\r\n            found_objects = found_objects.concat(nw.query(bounds, filters));\r\n            found_objects = found_objects.concat(ne.query(bounds, filters));\r\n            found_objects = found_objects.concat(sw.query(bounds, filters));\r\n            found_objects = found_objects.concat(se.query(bounds, filters));\r\n        }\r\n        else {\r\n            for(var i=0; i<objects.length; i++) {\r\n                var point = objects[i];\r\n                if(\r\n                    (point.x >= bounds.x1) &&\r\n                    (point.x <= bounds.x2) &&\r\n                    (point.y <= bounds.y1) &&\r\n                    (point.y >= bounds.y2)\r\n                )\r\n                    found_objects.push(point);\r\n            }\r\n\r\n            //apply the filters\r\n            filters.forEach(\r\n                function(filter) {\r\n                    found_objects = found_objects.filter(filter);\r\n                }\r\n            );\r\n        }\r\n        return found_objects;\r\n    }\r\n\r\n\r\n    //Public API\r\n    this.inspect = inspect;\r\n    this.insert = insert;\r\n    this.query = query;\r\n    this.update = update;\r\n    this.remove = remove;\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (QuadTree);\r\n\n\n//# sourceURL=webpack://GeoCluster/./src/filtering_quad_tree.js?");

/***/ }),

/***/ "./src/service/service.js":
/*!********************************!*\
  !*** ./src/service/service.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// empty (null-loader)\n\n//# sourceURL=webpack://GeoCluster/./src/service/service.js?");

/***/ })

/******/ });