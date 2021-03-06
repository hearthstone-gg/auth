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
  * copy ``` server/config/example.config ``` to ```server/config/local.config``` and update with settings

Build:
  * ```./build.sh``` in ./

Run:
  * ```npm start``` in ./

View:
	```http://localhost:3002```


##Endpoints

login:
  ``` /auth/bnet ```

logout:
  ``` /logout ```

get user:
  ``` /user ```

auth callback:
  ``` /auth/bnet/callback ```

connect bnet account:
  ``` /connect/bnet ```

connect callback:
  ``` /connect/bnet/callback ```

unlink:
  ``` /unlink/bnet ```


##CLI Arguments

**--env (-e)**
  config file to load.
  ```
    node app --env=prod //run with the config from ./app/config/prod.js
  ```