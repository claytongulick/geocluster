'use module';

/**
 * filteringQuadTree.js
 *
 * This is an implementation of a quad tree that allows points to be compared to a set of filters
 * in addition to the standard bounds queries
 *
 * @author Clayton Gulick <claytongulick@gmail.com>
 */


/**
 * QuadTree with filters
 * @param {Object} bounds - object {x1,x2,y1,y2} - the bounds of the quad tree
 * @constructor
 */
let QuadTree = function(bounds, node_depth) {
    //max number of objects in each bucket
    var max_node_size = 4;

    //max depth of the tree
    var max_depth = 6;

    //the child quad regions
    var ne,nw,se,sw;

    //the objects stored in this node. each object must have the properties x1,y1,x2,y2 and may have others
    //for use in matching filter criteria
    var objects = [];

    //the depth of the node in the tree. root is 0
    var depth = node_depth | 0;

    var node_bounds = bounds;

    /**
     * For debugging purposes, returns internal variables of the node
     * @returns {{max_node_side: number, max_depth: number, ne: *, nw: *, se: *, sw: *, objects: Array, depth: number, node_bounds: Object}}
     */
    function inspect() {
        return {
            max_node_side: max_node_size,
            max_depth: max_depth,
            ne: ne ? ne.inspect() : null,
            nw: nw ? nw.inspect() : null,
            se: se ? se.inspect() : null,
            sw: sw ? sw.inspect() : null,
            objects: objects,
            depth: depth,
            node_bounds: node_bounds
        }
    }

    /**
     * Insert an object into the quad tree. Object must have properties x,y
     * @param {Object} object
     */
    function insert(object) {
        //if the point is out of bounds, bail
        if(!containsPoint(object)) return false;

        //if we have children, add it to one of them
        if(nw) {
            if(ne.insert(object)) return true;
            if(nw.insert(object)) return true;
            if(se.insert(object)) return true;
            if(sw.insert(object)) return true;
        }

        //no children, add it to our own collection
        objects.push(object);

        if(objects.length <= max_node_size || depth >= max_depth) return true;

        //if we're overflowing, split and move the points to the children nodes
        split();

        return true;
    }

    /**
     * Updates an object in the quad tree. It is expected that there will be an id property in the passed in object,
     * this is what will be used to locate the existing item and update it. This is going to execute in roughly O(n).
     * @param {Object} object
     */
    function update(object) {
        for(var i=0; i<objects.length; i++) {
            if(objects[i].id.toString() == object.id.toString()) {
                objects[i] = object;
                return true;
            }
        }
        
        if(nw && nw.update(object)) return true;
        if(ne && ne.update(object)) return true;
        if(sw && sw.update(object)) return true;
        if(se && se.update(object)) return true;

        return false;
    }
    
    /**
     * Remove an object from the tree based on the provided id
     */
    function remove(id) {
        for(var i=0; i<objects.length; i++) {
            if(objects[i].id.toString() == id.toString()) {
                objects.splice(i,1);
                return true;
            }
        }
        
        if(nw && nw.remove(id)) return true;
        if(ne && ne.remove(id)) return true;
        if(sw && sw.remove(id)) return true;
        if(se && se.remove(id)) return true;

        return false;
    }

    /**
     * Split the current node into child quads and move the points the the children
     */
    function split() {
        var centerX = (node_bounds.x1 + node_bounds.x2) / 2;
        var centerY = (node_bounds.y1 + node_bounds.y2) / 2;

        nw = new QuadTree({x1: node_bounds.x1, y1: node_bounds.y1, x2: centerX, y2: centerY}, depth + 1);
        ne = new QuadTree({x1: centerX, y1: node_bounds.y1, x2: node_bounds.x2, y2: centerY}, depth + 1);
        sw = new QuadTree({x1: node_bounds.x1, y1: centerY, x2: centerX, y2: node_bounds.y2}, depth + 1);
        se = new QuadTree({x1: centerX, y1: centerY, x2: node_bounds.x2, y2: node_bounds.y2}, depth + 1);

        for(var i=0; i<objects.length; i++) {
            var object = objects[i];
            if(ne.insert(object)) continue;
            if(nw.insert(object)) continue;
            if(se.insert(object)) continue;
            if(sw.insert(object)) continue;
            throw "Unable to allocate to subtree";
        }

        objects = [];
    }

    /**
     * Test to see if this node intersects or overlaps the specified bounds
     * @param {Object} test_bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points
     */
    function intersects(test_bounds) {
        if(test_bounds.x1 > node_bounds.x2) return false;
        if(test_bounds.x2 < node_bounds.x1) return false;
        if(test_bounds.y1 < node_bounds.y2) return false;
        if(test_bounds.y2 > node_bounds.y1) return false;

        return true;
    }

    /**
     * Test to see if point lies inside the node. We're assuming y increases moving up on the y axis (as in latitude
     * above the equator)
     * @param point - object an object that has properties x and y
     */
    function containsPoint(point) {
        return (point.x >= node_bounds.x1) && (point.x <= node_bounds.x2) && (point.y <= node_bounds.y1) && (point.y >= node_bounds.y2);
    }

    /**
     * Get all points in the quad tree that lie inside the bounds {x1,y1,x2,y2} and match the filter criteria
     * @param {Object} bounds - object an object that has properties x1, y1, x2, y2 that represent top left and bottom right points
     * @param {Array} filters - array an array of filter functions that will be applied to each point to test for inclusion
     */
    function query(bounds, filters) {
        var found_objects = [];

        //first make sure this node is in bounds
        if(!intersects(bounds)) return found_objects;

        if(nw) { //if we have children, recurse
            found_objects = found_objects.concat(nw.query(bounds, filters));
            found_objects = found_objects.concat(ne.query(bounds, filters));
            found_objects = found_objects.concat(sw.query(bounds, filters));
            found_objects = found_objects.concat(se.query(bounds, filters));
        }
        else {
            for(var i=0; i<objects.length; i++) {
                var point = objects[i];
                if(
                    (point.x >= bounds.x1) &&
                    (point.x <= bounds.x2) &&
                    (point.y <= bounds.y1) &&
                    (point.y >= bounds.y2)
                )
                    found_objects.push(point);
            }

            //apply the filters
            filters.forEach(
                function(filter) {
                    found_objects = found_objects.filter(filter);
                }
            );
        }
        return found_objects;
    }


    //Public API
    this.inspect = inspect;
    this.insert = insert;
    this.query = query;
    this.update = update;
    this.remove = remove;
}

export default QuadTree;
