import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Backendless Connector'
	});
	let img;
	console.log(base64Prefix(imageData.src));
	this.append(
	  img = new ImageView({...FULL})
	)
	this.set({img});
	this.get('img').set("image", {src: base64Prefix(imageData.src)});
  }
}

function base64Prefix(src){
  return `data:image/jpeg;base64,${src}`;
}

