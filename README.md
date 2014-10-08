testNodeWebKit
==============

Architecture
------------
- `app` : the js app
- `index.html` : entry point
- `package.json` : node webkit manifest
- `build` : grunt builder
- `assets` : app assets (css + images)

Install
-------
- `npm install` : install node modules of the app
- `cd build && npm install` : install node modules of the builder

Compile
-------
- `grunt build`

Run
---
- `cd build && grunt run:mac`
- `cd build && grunt run:win`
- debug : 
    - edit `package.json`
    - change `window->toolbar` to true
    - then `run` and click on the `gear`

Package
-------
- `cd build && grunt package:mac`
- `cd build && grunt package:win`