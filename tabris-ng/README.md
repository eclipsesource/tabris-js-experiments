# Writing Tabris.js apps with Angular2

**Experimental**

To experiment with Angular2 apps on Tabris.js, the module `tabris-ng` re-exports Angular2 with a renderer for Tabris.js.

## Example App

The folder `src/example/` contains a simple example application. The `tabris-ng` module can also be installed from this URL:

    "dependencies": {
      "tabris-ng": "https://github.com/eclipsesource/tabris-js-experiments/releases/download/tabris-ng-0.1.0/tabris-ng-0.1.0.tgz",
      ...
    }

### Start HTTP Server with example app

    npm start

## Build the tabris-ng module

### Prepare

    npm install -g typescript
    npm install -g webpack
    npm install

### Compile TypeScript

    tsc -p .

### Build Tabris-ng (webpack)

    npm run build

This will create the file `dist/tabris-ng.js`.

    npm pack

will create a tgz file that can be used as a dependency.

## License

Published under the [BSD 3-clause license](https://github.com/eclipsesource/tabris-js/blob/master/LICENSE).
