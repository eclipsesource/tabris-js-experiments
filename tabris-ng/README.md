# Writing Tabris.js apps with Angular2

**Experimental**

To experiment with Angular2 apps on Tabris.js, the module `tabris-ng` re-exports Angular2 with a renderer for Tabris.js.

The folder `src/example/` contains a simple example application.

### Prepare

    npm install -g typescript
    npm install -g webpack
    npm install

### Compile

    tsc -p .

### Build Tabris-ng (webpack)

    npm run build

This will create a file `dist/tabris-ng.js`.

### Start HTTP Server with example app

    npm start

## License

Published under the [BSD 3-clause license](https://github.com/eclipsesource/tabris-js/blob/master/LICENSE).
