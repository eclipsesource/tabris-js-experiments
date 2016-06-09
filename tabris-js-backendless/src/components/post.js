import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';

import {BACKGROUND, BORDER, WHITE} from './../styles/colors';

export default class extends Composite {
  constructor() {
	super({
	  ...FULL,
	  background: BACKGROUND,
	});
	let _elements = {};
	this.append(
	  new Composite({
		left:10, right:10, top:10,bottom: 0,
		cornerRadius:10,
		background: BORDER,
	  }).append(

		new Composite({
		  left:1, right:1, top:1,bottom: 1,
		  cornerRadius:10,
		  background: WHITE,
		}).append(

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
	_elements.image.set({image:{src:item.image}});
  }
  //
  //getGalleyPhoto(){
	//this.getPhoto('PHOTOLIBRARY')
  //}
  //
  //getPhoto(source){
	//let onSuccess =(imageData)=> {
	//  //saveFile(imageData)
	//  //.then(result => {
	//  //  console.log("SUCCESS");
	//  //  console.log(result);
	//  //})
	//  //.catch(err => {
	//  //  console.log("FAIL");
	//  //  console.log(err);
	//  //});
	//  new SubmitPhotoPage(imageData).open();
	//}
	//let onFail = (message) => {
	//  // Cancelled image.
	//  //console.log("Camera failed because: " + message);
	//}
	//navigator.camera.getPicture(onSuccess, onFail, {
	//  quality: 50,
	//  targetWidth: 1024,
	//  targetHeight: 1024,
	//  destinationType: window.Camera.DestinationType.DATA_URL,
	//  sourceType: window.Camera.PictureSourceType[source]
	//});
  //}
}


function Button(text, config){
  return new Composite({left:"10%",right:"10%",height:80, cornerRadius: 10, background: '#ff8400',highlightOnTouch:true,...config}).append(
	new TextView({
	  text,
	  centerX:0,centerY:0,
	  textColor:"white",
	  font:'bold 20px',
	})
  )
}
