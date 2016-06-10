import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

import {BACKGROUND, BORDER, WHITE} from './../styles/colors';


const postLayout = {
  container : {
	...FULL,
	background: BACKGROUND,
  },
  border: {
	left:5, right:10, top:10,bottom: 5,
	cornerRadius:10,
	elevation: 1,
	background: BORDER,
  },
  canvas: {
	left:1, right:1, top:1,bottom: 1,
	cornerRadius:10,
	background: WHITE,
  }

}


export default class extends Composite {
  constructor() {
	super(postLayout.container);
	let _elements = {};
	this.append(
	  new Composite(postLayout.border).append(
		new Composite(postLayout.canvas).append(

		  // Actual Content goes here !
		  _elements.title = new TextView({top: 0, height: 40, left: 60, right: 10}),
		  _elements.image = new ImageView({...FULL, top:40, bottom: 15})

		)
	  )

	);

	this.set({_elements});
	this.updateElements = this.updateElements.bind(this); //ES6 hack
  }

  updateElements(item){
	let _elements = this.get('_elements');
	_elements.title.set({text:item.title});
	updateImage(_elements.image,item.image);
  }
}

let updateImage = (imageView, newUrl) => {
  let existingImage = imageView.get('image');
  if(  !(existingImage && existingImage.src === newUrl)){
	// Image actually changed
	imageView.set( {image: undefined});
  }
  setTimeout(function(){
	imageView.set( {image: {src: newUrl}} );
  },1);
}

