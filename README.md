TSReportViewer
==============

TODO REDO WITH SLFSRV



Install
-------
- `git@github.com:lucasmouilleron/TSReportViewer.git`
- Download `slfsrv` Mac OS binary : https://github.com/BrentNoorda/slfsrv#getting-the-sourceexecutable-files
- `sudo cp sflsrv /usr/bin/slfsrv`

Compile
-------
- `cd build && npm install`
- `grunt build`

Run
---
- production mode : `slfsrv PATH/TO/TSReportViewer/index.html`
- debug mode : `slfsrv PATH/TO/TSReportViewer/index-debug.html`