auth
==============

auth server for hearthstone.gg

Requires
  * Node / NPM
  * Yeoman

Install:
  * Clone the repo
  * Install the server
  * ```npm install```
  * ```run npm install for any projects in public/```

Build:
  * ```./build.sh``` in ./

Run:
  * ```npm start``` in ./

View:
	```http://localhost:3002```

##CLI Arguments

**--env (-e)**
  config file to load.
  ```
    node app --env=prod //run with the config from ./app/config/prod.js
  ```