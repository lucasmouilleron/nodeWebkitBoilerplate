nodeWebkitBoilerplate
=====================

Architecture
------------
- `src` : the app
    - `index.html` : entry point
    - `package.json` : node webkit manifest
    - `assets` : app assets (css + images)
    - `app` : logic app files
- `_build` : grunt builder

Install
-------
- Install NodeJS : http://nodejs.org/download
- `sudo npm install bower -g`
- `sudo npm install grunt -g`
- `cd _build`
- `npm install` : installs node modules of the builder
- `grunt install` : installs the app dev kit (requires password on mac os to extend open files limit)

Run
---
- `cd _build && grunt run`
- Debug : 
    - Edit `package.json`
    - Change `window->toolbar` to true
    - Then `run` and click on the `gear`

Package
-------
- Config target platforms in `_build/config.json` (`"platforms":["win", "osx"]`)
- `cd _build && grunt package`

Demo app specific operations
----------------------------
- Add a node module from npm :
    - `cd src && npm install the_module --save-dev`
    - Then, use with `require("the_module")` in the app code
- Add a requirejs module from bower :
    - `cd src && bower install the_module --save`
    - Then, add path to `js/libs/vendor/the_module/path/to/jsFile` in `app/main.js` in path section and include module name in the `requirejs` call

Thanks
------
- Thanks to the Node Webkit team @ https://github.com/rogerwang/node-webkit
- Thanks to Joel Grenon for https://github.com/jgrenon/angular-desktop-app