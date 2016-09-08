var path = require('path');

module.exports = function(data, xyz, writeData, done) {
    if (!global.mapOptions) throw new Error('global.mapOptions must be set');
    if (!global.mapOptions.parsed) throw new Error('global.mapOptions.selector must be set');

    var parsed = global.mapOptions.parsed;
    var results = [];

    for (var feat_it = 0; feat_it < data.QA.osm.features.length; feat_it++) {
        var feat = data.QA.osm.features[feat_it];

        var checked = check(feat, parsed);

        if (checked) results.push(JSON.stringify(feat));
    }

    writeData(results.join('\n') + '\n');
    return done(null, 'Finished - ' + results.length + ' matched');

    function check(feat, tree) {
        if (!tree) return false;
        keys = Object.keys(tree);
        if (keys.length === 0) return true;
        var props = Object.keys(feat.properties);

        for (var key_it = 0; key_it < keys.length; key_it++) {
            var type = keys[key_it][0] === '+' ? true : false;
            var key = keys[key_it].substr(1, keys[key_it].length-1).toLowerCase().split(String.fromCharCode(31));

            if (key.length === 1) { //Normal k or v partial search
                for (var prop_it = 0; prop_it < props.length; prop_it++) {
                    var prop = props[prop_it];

                    if (prop.toLowerCase().match(key) || String(feat.properties[prop]).toLowerCase().match(key)) {
                        return check(feat, tree[keys[key_it]]);
                    }
                }
            } else if (key.length === 3 && key[1] === '=') { //Exact k/v match
                for (var prop_it = 0; prop_it < props.length; prop_it++) {
                    var prop = props[prop_it].toLowerCase();

                    if (prop === key[0] && String(feat.properties[prop]).toLowerCase() === key[2]) {
                        return check(feat, tree[keys[key_it]]);
                    }
                }
            } else if (key.length === 3 && key[1] === ':') { //Partial k/v match
                for (var prop_it = 0; prop_it < props.length; prop_it++) {
                    var prop = props[prop_it].toLowerCase();

                    if (prop === key[0] && String(feat.properties[prop]).toLowerCase().match(key[2])) {
                        return check(feat, tree[keys[key_it]]);
                    }

                }
            }
        }
    }
}
