import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

import {BACKGROUND, BORDER, WHITE} from './../styles/colors';
import Avatar from './avatar';


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
		  _elements.avatar = new Avatar(null,{top: 10, height: 40, left: 10, width: 40}),
		  _elements.creator = new TextView({top: 10, height: 40, left: 60, right: 10}),
		  _elements.title = new TextView({bottom: 10, height: 40, left: 10, right: 10}),
		  _elements.image = new ImageView({...FULL, top:60, bottom: 60})

		)
	  )

	);

	this.set({_elements});
	this.updateElements = this.updateElements.bind(this); //ES6 hack
  }

  updateElements(item){
	let _elements = this.get('_elements');
	_elements.creator.set({text: item.creatorEmail ? item.creatorEmail.split('@')[0]: 'Anonymous'});
	_elements.title.set({text:item.title});

	updateImage(_elements.image,item.image);
	_elements.avatar.setEmail(item.creatorEmail);
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

