testNodeWebKit
==============

Architecture
------------
- `app` : the js app
- `index.html` : entry point
- `package.json` : node webkit manifest
- `build` : grunt builder
- `assets` : app assets (css + images)
- `nw.app` and `nw.exe` are the Node webKit binaries

Install
-------
- `cd build`
- `npm install` : install node modules of the builder
- `grunt install`

Run
---
- `cd build && grunt run`
- debug : 
    - edit `package.json`
    - change `window->toolbar` to true
    - then `run` and click on the `gear`

Package
-------
- `cd build && grunt package`