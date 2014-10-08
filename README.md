testNodeWebKit
==============

Architecture
------------
- `app` : the js app
- `index.html` : entry point
- `package.json` : node webkit manifest
- `build` : grunt builder
- `assets` : app assets (css + images)

Compile
-------
- `cd build && npm install`
- `grunt build`

Run
---
- `cd build && grunt run:mac`
- debug : 
    - edit `package.json`
    - change `window->toolbar` to true

Package
-------
- `cd build && grunt package:mac`