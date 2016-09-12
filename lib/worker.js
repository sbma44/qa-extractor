var path = require('path');

module.exports = function(data, xyz, writeData, done) {
    if (!global.mapOptions) throw new Error('global.mapOptions must be set');
    if (!global.mapOptions.parsed) throw new Error('global.mapOptions.selector must be set');

    var parsed = global.mapOptions.parsed;
    var results = [];

    for (var feat_it = 0; feat_it < data.QA.osm.features.length; feat_it++) {
        var feat = data.QA.osm.features[feat_it];

        var checked = check(feat, parsed, 0);

        if (checked) results.push(JSON.stringify(feat));
    }

    if (results.length) writeData(results.join('\n') + '\n');
    return done(null, 'Finished - ' + results.length + ' matched');

    function check(feat, tree, depth) {
        if (!tree) return false;
        keys = Object.keys(tree);
        if (keys.length === 0) return true;
        var props = Object.keys(feat.properties);

        for (var key_it = 0; key_it < keys.length; key_it++) {
            var type = keys[key_it][0];
            var key = keys[key_it].substr(1, keys[key_it].length-1).toLowerCase().split(String.fromCharCode(31));

            //Postive AND Shortcircuits - AND NOT must iterate all
            match = false;
            for (var prop_it = 0; prop_it < props.length; prop_it++) {
                var prop = props[prop_it];

                if (key.length === 1 && prop.toLowerCase().match(key) || String(feat.properties[prop]).toLowerCase().match(key)) { //Normal k or v partial search
                    if (type === '+') { return check(feat, tree[keys[key_it]], ++depth); }
                    else { match = true; }
                } else if (key.length === 3 && key[0] === '@type' && key[2].toLowerCase() === feat.geometry.type.toLowerCase()) {
                    if (type === '+') { return check(feat, tree[keys[key_it]], ++depth); }
                    else { match = true; }
                } else if (key.length === 3 && key[1] === '=' && prop === key[0] && String(feat.properties[prop]).toLowerCase() === key[2]) { //Exact k/v match
                    if (type === '+') { return check(feat, tree[keys[key_it]], ++depth); }
                    else { match = true; }
                } else if (key.length === 3 && key[1] === ':' && prop === key[0] && String(feat.properties[prop]).toLowerCase().match(key[2])) { //Partial k/v match
                    if (type === '+') { return check(feat, tree[keys[key_it]], ++depth); }
                    else { match = true; }
                }
            }

            if (type === '-' && !match) return check(feat, tree[keys[key_it]], ++depth);
        }
    }
}
