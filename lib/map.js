var TileReduce = new require('tile-reduce');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(argv) {
    if (!argv['input']) {
        console.error('--input=<FILE.mbtiles> argument required');
        process.exit(1);
    } else if (!argv['output']) {
       console.error('--output=<FILE.geojson> argument required');
       process.exit(1);
    } else if (!argv['selector']) {
       console.error('--selector="SELECTOR" argument required');
       process.exit(1);
    }

    var selector = argv.selector;

    var parsed = {};

    // ----- Selector Parsing --------------
    var openQuote = false; //Quotes allow escaping of control characters
    var workingTerm = ''; //Current working term
    var currentObj = parsed; //Position in the parsing tree

    for (var i = 0; i <= selector.length; i++) {
        if (selector[i] === '"') {
            if (openQuote) {
                openQuote = false;
                currentObj = branch(currentObj, workingTerm);
                workingTerm = '';
            } else {
                openQuote = true;
            }
        } else if (selector[i] === ' ' && !openQuote) {
            currentObj = branch(currentObj, workingTerm);
            workingTerm = '';
        } else if (selector[i] === '=' && !openQuote) { //Key {exact match} value
            workingTerm = workingTerm + String.fromCharCode(31) + '=' + String.fromCharCode(31);
        } else if (selector[i] === ':' && !openQuote) { //Key {partial match} value
            workingTerm = workingTerm + String.fromCharCode(31) + '=' + String.fromCharCode(31);
        } else if (!selector[i]) {
            currentObj = branch(currentObj, workingTerm);
            workingTerm = '';
        } else {
            workingTerm = workingTerm + selector[i];
        }
    }

    function branch(wrk, term) {
        if (term[0] === '-') {
            wrk[term] = {};
            return wrk[term];
        } else {
            term = '+' + term;
            wrk[term] = {};
            return wrk[term];
        }
    }

    argv.parsed = parsed;

    console.error(JSON.stringify(parsed))

    var tilereduce = TileReduce({
        log: false,
        zoom: 12,
        maxWorkers: argv.workers,
        mapOptions: argv,
        sourceCover: 'QA',
        output: fs.createWriteStream(path.resolve(__dirname, '..', argv.output)),
        sources: [{
            name: 'QA',
            mbtiles: path.resolve(__dirname, '..', argv['input'])
        }],
        map: __dirname+'/worker.js'
    }).on('start', function() {
        console.log('Beginning Processing');
    }).on('reduce', function(err, tile) {
        if (err) console.error('['+tile.join(',')+'] - ' + err)
        else console.log('['+tile.join(',')+'] - Finished');
    }).on('end', function() {
        console.log('Ending Processing');
    });
}
