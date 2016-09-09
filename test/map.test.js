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

test('map - @type:point place', function(t) {
    map({
        input: __dirname + '/sg.mbtiles',
        output: tmpOutput,
        selector: '@type:point place'
    }, function(parsed) {
        t.deepEquals(parsed, { '+@type\x1f:\x1fpoint': { '+place': {} } });
        count(t, 945);
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
        t.deepEquals(parsed, { '+building': { '+addr:city': { '+': {} } } });
        count(t, 8855);
    });
});
