var map = require('../lib/map');
var test = require('tape');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var os = require('os');

var tmpOutput = os.tmpdir() + '/output.geojson';

test('map - basic place filter', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'building'
    });

    t.end();
});
