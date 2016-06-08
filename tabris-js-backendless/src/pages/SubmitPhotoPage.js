import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Backendless Connector'
	});

	this.append(
	  new ImageView({...FULL,
		image: {src: base64Prefix(imageData.src)}
	  })
	)
  }
}

function base64Prefix(src){
  return `data:image/jpeg;base64,${src}`;
}

