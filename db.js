var mongojs = require('mongojs')

var db = mongojs('oauth2orize_implicit_example')

exports.db = function() {
    return db
}
