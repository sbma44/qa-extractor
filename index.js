#!/usr/bin/env node

var settings = require('./package.json');
var map = require('./lib/map');

var argv = require('minimist')(process.argv, {
    string: [
        "input",
        "output",
        "selector",
        "quiet"
    ],
    integer: ["workers"],
    boolean: ["help", "version"],
    alias: {
        "version": "v",
        "output":  "o",
        "input":   "i",
        "quiet":   "q"
    }
});

if (argv.help) {
    console.log('usage: index.js [--input=<FILE.mbtiles>] [--output=<FILE.geojson>]');
    console.log('');
    console.log('[options]:');
    console.log('   --input=<FILE.mbtiles>          QA-Tiles input file');
    console.log('   --output=<FILE.geojson>         Line delimited geojson results');
    console.log('   --workers=NUM                   [optional] control number of workers');
    console.log('   --quiet                         Be less verbose.');
    process.exit(0);
} else if (argv.version) {
    console.log(settings.name + '@' + settings.version);
    process.exit(0);
} else {
    map(argv);
}
