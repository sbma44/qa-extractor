var path = require('path');

module.exports = function(data, xyz, writeData, done) {
    if (!global.mapOptions) throw new Error('global.mapOptions must be set');
    if (!global.mapOptions.parsed) throw new Error('global.mapOptions.selector must be set');

    var parsed = global.mapOptions.parsed;

    for (var feat_it = 0; feat_it < data.QA.osm.features.length; feat_it++) {
        var feat = data.QA.osm.features[feat_it];

        check(feat, parsed)
    }

    function check(feat, tree) {
        keys = Object.keys(tree);

        for (var key_it = 0; key_it < keys.length; key_it++) {
            var key = keys[key_it];

            
        }
    }

    return done(null, 'No links found in: ' + xyz.join(','));
}
