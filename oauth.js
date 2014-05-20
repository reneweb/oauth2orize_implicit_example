var oauth2orize = require('oauth2orize')
    , passport = require('passport')
    , db = require('./db').db()
    , crypto = require('crypto')
    , utils = require("./utils")
    , bcrypt = require('bcrypt')

// create OAuth 2.0 server
var server = oauth2orize.createServer();

//(De-)Serialization for clients
server.serializeClient(function(client, done) {
    return done(null, client.id)
})

server.deserializeClient(function(id, done) {
    db.collection('clients').find(id, function(err, client) {
        if (err) return done(err)
        return done(null, client)
    })
})

//Implicit grant
server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
    var token = utils.uid(256)
    var tokenHash = crypto.createHash('sha1').update(token).digest('hex')
    var expirationDate = new Date(new Date().getTime() + (3600 * 1000))
    
    db.collection('accessTokens').save({token: tokenHash, expirationDate: expirationDate, userId: user.username, clientId: client.clienId}, function(err) {
        if (err) return done(err)
        return done(null, token, {expires_in: expirationDate})
    })
}))

// user authorization endpoint
exports.authorization = [
  function(req, res, next) {
    if (req.user) next()
    else res.redirect('/login')
  },
  server.authorization(function(clientId, redirectURI, done) {
    db.collection('clients').findOne({clientId: clientId}, function(err, client) {
      if (err) return done(err)
      // WARNING: For security purposes, it is highly advisable to check that
      // redirectURI provided by the client matches one registered with
      // the server. For simplicity, this example does not. You have
      // been warned.
      return done(null, client, redirectURI)
    })
  }),
  function(req, res) {
    res.render('decision', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint

exports.decision = [
  function(req, res, next) {
    if (req.user) next()
    else res.redirect('/login')
  },
  server.decision()
]

// token endpoint
exports.token = [
    passport.authenticate(['clientBasic', 'clientPassword'], { session: false }),
    server.token(),
    server.errorHandler()
]

