var map = require('../lib/map');
var test = require('tape');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var os = require('os');

var tmpOutput = os.tmpdir() + '/output.geojson';

function count(t, ct, cb) {
    var i;
    var count = 0;
    require('fs').createReadStream(tmpOutput)
    .on('data', function(chunk) {
        for (i=0; i < chunk.length; ++i) if (chunk[i] == 10) count++; })
    .on('end', function() {
        t.equals(count, ct);

        if (cb) return cb();
        else t.end();
    });
}

test('map - place=neighbourhood | place=hamlet | place=state | place=region', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'place=neighbourhood | place=hamlet | place=state | place=region'
    }, function(parsed) {
        t.deepEquals(parsed, { '+place\x1f=\x1fhamlet': {}, '+place\x1f=\x1fneighbourhood': {}, '+place\x1f=\x1fregion': {}, '+place\x1f=\x1fstate': {} });
        count(t, 16);
    });
});

test('map - @type:Point place | @type:LineString highway', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: '@type:Point place | @type:LineString highway'
    }, function(parsed) {
        t.deepEquals(parsed, { '+@type\x1f:\x1fPoint': { '+@type\x1f:\x1fLineString': { '+highway': {} }, '+place': {} } });
        count(t, 268);
    });
});

test('map - @type:Point | @type:LineString', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: '@type:Point | @type:LineString'
    }, function(parsed) {
        t.deepEquals(parsed, {"+@type\u001f:\u001fPoint":{},"+@type\u001f:\u001fLineString":{}});
        count(t, 57242);
    });
});

test('map - @type:point place', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: '@type:point place'
    }, function(parsed) {
        t.deepEquals(parsed, { '+@type\x1f:\x1fpoint': { '+place': {} } });
        count(t, 268);
    });
});

test('map - highway -highway', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'highway -highway'
    }, function(parsed) {
        t.deepEquals(parsed, { '+highway': { '-highway': {} } });
        count(t, 0);
    });
});

test('map - highway name:See', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'highway name:See'
    }, function(parsed) {
        t.deepEquals(parsed, { '+highway': { '+name\x1f:\x1fSee': {} } });
        count(t, 7);
    });
});

test('map - building', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'building'
    }, function(parsed) {
        t.deepEquals(parsed, { '+building': {} });
        count(t, 50260);
    });
});

test('map - building addr', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'building addr'
    }, function(parsed) {
        t.deepEquals(parsed, {"+building":{"+addr":{}}});
        count(t, 18745);
    });
});

test('map - building "addr:city"', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: 'building "addr:city"'
    }, function(parsed) {
        t.deepEquals(parsed, { '+building': { '+addr:city': {} } });
        count(t, 8855);
    });
});
