var path = require('path');

module.exports = function(data, xyz, writeData, done) {
    if (!global.mapOptions) global.mapOptions = {};

    return done(null, 'No links found in: ' + xyz.join(','));
}

