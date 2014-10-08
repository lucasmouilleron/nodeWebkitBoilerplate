TSReportViewer
==============

TODO REDO WITH SLFSRV



Install
-------
- `git@github.com:lucasmouilleron/TSReportViewer.git`
- Download `node-webkit` OS target binary (Mac OS binary is embeded) : https://github.com/rogerwang/node-webkit#downloads
- And place it at the project root

Compile
-------
- `cd build && npm install`
- `grunt build`

Run
---
- `open -n -a node-webkit "./"`
- debug : 
    - edit `package.json`
    - change `window->toolbar` to true