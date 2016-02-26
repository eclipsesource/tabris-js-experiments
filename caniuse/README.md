Can I Use... ?
==============

The goal of this project is to determine which JavaScript features are supported by the different Tabris.js platforms (aside of the APIs provided by Tabris itself).

Currently the results can be viewed by opening the results/results.html file in a browser. It's an ajax App, not a static HTML file. It uses XHR to load JSON data, so start it from an http-server (or use Firefox).

All entries only determine the exitence of a certain API or syntax, not necessarily that it works correctly.

To update the data type `npm run tabris` and open the app using the tabris.js client. The raw data will be outputted to the console. Coyp and paste it to a .json file.

TODO:
* Add tests for typed arrays.
* Add data for older iOS versions.
* Add data for new Tabris.js android clients (using newer V8 engine).
* Improve Babel setup and add data for each platform using that setup.
* Provide static HTML or Markdown results 