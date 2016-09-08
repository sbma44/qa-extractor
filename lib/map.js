var TileReduce = new require('tile-reduce');
var path = require('path');
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
