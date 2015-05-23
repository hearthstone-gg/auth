var config = require('hs.gg-config').get('local').services.auth;

module.exports = {
    "env": "local",
    "server": {
        "port": config.port,
        "sslPort": config.httpsPort
    },
    "db": "mongodb://localhost/hsgg",
    "auth": {
        "bnetAuth": {
            "clientID": "",
            "clientSecret": "",
            "callbackURL": 'https://' + config.domain + "/auth/bnet/callback"
        }
    },
    "staticserverServer": {
        "staticDirectory": "public//"
    }
};