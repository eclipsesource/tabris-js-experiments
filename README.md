Experiments with tabris.js using hyperscript templates and ES6
====================

# Introduction

Tabris.js is a framework for developing mobile apps with native UIs in JavaScript. iOS and Android apps can be built entirely from one code base, which frees you from the task of managing code for the two platforms individually.

This repo has all kinds of experiments regarding it's future apis.

the magic happens at:
https://github.com/eclipsesource/tabris-js-experiments/blob/master/src/index.js

## javascript ES6

```javascript
/*************************
 * Import Components
 *************************/
import { Text, Composite, Image} from './tabris/components';


function BookDetails(book) {
	return (
		Composite( bookDetailsStyle.container,[
			Image( book.image, bookDetailsStyle.image, fadeIn(800) ),
			Composite( bookDetailsStyle.textContainer , [
				Text( book.title , bookDetailsStyle.title  , fadeInRight(500, 100) ),
				Text( book.author, bookDetailsStyle.author , fadeInRight(500, 300) ),
				Text( book.price , bookDetailsStyle.price  , fadeInRight(500, 500) )
			])
		]).on("tap",  () => { openReadBookPage(book) })
	)
}
```

# Usage

Once you've downloaded the files in this repo please run the following command in your terminal from the project folder (it may require `sudo`):

```shell
$ npm install
```

## Available tasks

### Convert the ES6 code into valid ES5 combining all the modules into one single file
```shell
$ ./make build # or also `$ npm run build`
```
### Start a nodejs static server
```shell
$ npm install -g http-server
$ http-server
```

### To compile and/or test the project anytime a file gets changed
```shell
$ ./make watch # or also `$ npm run watch`
```

# Thanks

- [Gianluca Guarini - ES6 Project Starter Kit](https://github.com/GianlucaGuarini/es6-project-starter-kit)
