module.exports = {
    "env": "local",
    "server": {
        "port": 3002
    },
    "db": "mongodb://localhost/hsgg",
     "auth": {
        "bnetAuth": {
            "clientID": "243zy7wjextecmhx9pmh8bzeaktshhkj",
            "clientSecret": "gAQZkdqbM2kqeg6NMkAsHGr6DACnYh2b",
            "callbackURL": "https://localhost:3002/auth/bnet/callback"
        }
    },
    "staticserverServer": {
        "staticDirectory": "public//"
    }
};