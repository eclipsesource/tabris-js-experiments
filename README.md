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

# Setup

Once you've downloaded the files in this repo please run the following command in your terminal from the project folder (it may require `sudo`):

```shell
$ git clone https://github.com/eclipsesource/tabris-js-experiments.git
$ cd tabris-js-experiments
$ npm install
$ npm run build
$ npm run watch
```

And in a new tab inside the tabris-js-experiments directory:
```shell
$ npm install -g http-server
$ http-server
```
Connect to your code from the Tabris.js Developer App ([Play Store](https://play.google.com/store/apps/details?id=com.eclipsesource.tabris.js) / [App Store](https://itunes.apple.com/us/app/tabris.js/id939600018?ls=1&mt=8)).


# Thanks

- [Gianluca Guarini - ES6 Project Starter Kit](https://github.com/GianlucaGuarini/es6-project-starter-kit)
