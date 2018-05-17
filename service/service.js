/**
 * geospatialService.js
 *
 * Handles messaging and async communication for a filteringQuadTree instance.
 * 
 **/

var QuadTree = require('./helper-filtering_quad_tree'),
    Filters = require('./helper-filters'),
    QuickHull = require('./helper-quick_hull'),
    _ = require('lodash'),
    util = require('util'),
    winston = require('winston'),
    express = require('express');

var warmed = false;
var quadtree;
var geo_workers = [];
var qualificationLevels;

var zoom_grid = { // [zoom level, cell size]
    "16": [6,5], "15": [6,5],"14": [6,5], "13": [6,5], "12": [6,5], "11": [6,5], "10": [6,5], "9": [6,5], "8": [6,5], "7": [6,5], "6": [6,5]
};

// Northwest: 51.046627734117365, -159.5945515625
// Southeast: 18.945338210762284, -33.03205156249999
var tree_bounds = {
    x1: -159.5945515625,
    y1: 51.046627734117365,
    x2: -33.03205156249999,
    y2: 18.945338210762284
};


/**
 * Set up a worker process to handle geospatial queries
 */
function init() {
    winston.info('Initializing geospatial service...');

    // Init the express application
    var app = express();
    app.route('/clusters').get(createClusters);
    app.route('/debug').get(dumpQuadTree);
    app.route('/data/:dataId').put(updatePoint);

    winston.info("Starting geospatial service...");
    // Start the app by listening on <port>
    app.listen(config.geo_port);

    winston.info('Warming geospatial index...');
    createQuadTree(
        function (err) {
            winston.info('Geospatial index warmed.');
            warmed = true;
        }
    );
}

/**
 * For debugging purposes, render the entire quad tree to JSON for inspection
 * @param req
 * @param res
 */
function dumpQuadTree(req, res) {
    res.json(quadtree.inspect());
}

/**
 * Updates a point in the quad tree
 * @param req
 * @param res
 */
function updatePoint(req, res) {
    var data_id = req.params.dataId;
    if(!data_id) return utility.writeError("missing memberId", res, 400);

    Member.findOne({_id: member_id}).exec(
        function(err, member) {
            if(err)
                return utility.writeError(err, res, 400);
                
            if(member.is_active == false) {
                quadtree.remove(member._id);
                return utility.responseHandler(res)(null, "removed");
            }

            var address = _.find(member.address, function (address) {
                return address.is_primary
            });
            if (!address) return;

            var next_visit = Filters.getNextVisit(member);
            var scheduled_dates = Filters.getScheduledDates(member);
            var next_due_dates = Filters.getNextDueDates(member);

            var found = quadtree.update({
                x: address.geo.geojson.coordinates[0],
                y: address.geo.geojson.coordinates[1],
                sc: member.assigned_user,
                dd: next_visit.next_due_date,
                sd: scheduled_dates,
                ndd: next_due_dates,
                id: member._id,
                u: (member.urgent_visit && member.urgent_visit.description && (member.urgent_visit.description.length > 0) ? true : false),
                nv: member.needs_visit
            });

            if(!found)
                return utility.writeError("member: " + member_id + " not found in index", res, 404);

            return utility.responseHandler(res)(null, "ok");

        }
    )

}

/**
 * Create the geospatial index
 * @param callback
 */
function createQuadTree(callback) {
    quadtree = new QuadTree(tree_bounds);
    var count = 0;
    
    // Constrain by active status
    var stream = Member.find({is_active: true}).select("address assigned_user visit_dates urgent_visit needs_visit").cursor();
    stream.on("data", function(member) {
        var address = _.find(member.address, function (address) {
            return address.is_primary;
        });
        
        if(!address || !address.geo || !address.geo.geojson || !address.geo.geojson.coordinates) {
            return;
        }

        var next_visit = Filters.getNextVisit(member);

        var scheduled_dates = Filters.getScheduledDates(member);
        var next_due_dates = Filters.getNextDueDates(member);

        quadtree.insert({
            x: address.geo.geojson.coordinates[0],
            y: address.geo.geojson.coordinates[1],
            sc: member.assigned_user,
            dd: (next_visit) ? next_visit.next_due_date : null,
            sd: scheduled_dates,
            ndd: next_due_dates,
            id: member._id,
            u: (member.urgent_visit && member.urgent_visit.description && (member.urgent_visit.description.length > 0) ? true : false),
            nv: member.needs_visit
        });
    });
    stream.on("error", function(err) {callback(err);});
    stream.on("close", function(){callback(null);});
}


init();

module.exports = {
    geo_workers: geo_workers
}

