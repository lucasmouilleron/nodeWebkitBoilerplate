nodeWebkitBoilerplate
=====================

Architecture
------------
- `src` : the app
    - `index.html` : entry point
    - `package.json` : node webkit manifest
    - `assets` : app assets (css + images)
    - `app` : logic app files
- `build` : grunt builder

Install
-------
- `cd build`
- `npm install` : installs node modules of the builder
- `grunt install` : installs the app dev kit (requires password on mac os to extend open files limit)

Run
---
- `cd build && grunt run`
- debug : 
    - edit `package.json`
    - change `window->toolbar` to true
    - then `run` and click on the `gear`

Package
-------
- config target platforms in `build/config.json` (`"platforms":["win", "osx"]`)
- `cd build && grunt package`

Thanks
------
Thanks to the Node Webkit team @ https://github.com/rogerwang/node-webkit
Thanks to Joel Grenon for https://github.com/jgrenon/angular-desktop-app