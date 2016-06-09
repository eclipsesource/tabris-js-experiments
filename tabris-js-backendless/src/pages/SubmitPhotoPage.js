import {Page, TextInput, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Submit this photo!'
	});

	this.append(

	  new ImageView({
		id:`newPhoto`,
		...FULL,
		scaleMode: `fill`,
		//top: ["prev()",20],left:"10%",right:"10%",
		//height: 300,
		image: {src: base64Prefix(imageData.src)}
	  }),

	  new TextInput({
		id:`newPhotoText`,
		top: 20,left:"10%",right:"10%",
		message:`Give this image a title!`
	  }),

	  new TextView({
		id:`newPhoto22Text`,
		bottom: 20,left:"10%",right:"10%",
		height: 50,
		background:'red',
		message:`GO OG`
	  })
	)
  }
}

function base64Prefix(src){
  return `data:image/jpeg;base64,${src}`;
}

