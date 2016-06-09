import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {saveFile} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';

export default class extends Tab {
  constructor() {
	super({
	  title: 'Upload an image',
	  background:BACKGROUND
	});
	this.append(
	  new Composite({centerY:0,left:0,right:0, height: 220}).append(
		Button("Take New Photo", {top: 0}).on("tap",this.takePhoto.bind(this)),
		Button("Choose From Gallery", {bottom: 0}).on("tap",this.getGalleyPhoto.bind(this))
	  )

	);
  }
  takePhoto(){
	this.getPhoto('CAMERA')
  }

  getGalleyPhoto(){
	this.getPhoto('PHOTOLIBRARY')
  }

  getPhoto(source){
	let onSuccess =(imageData)=> {
	  //saveFile(imageData)
		//.then(result => {
		//  console.log("SUCCESS");
		//  console.log(result);
		//})
		//.catch(err => {
		//  console.log("FAIL");
		//  console.log(err);
		//});
	  new SubmitPhotoPage(imageData).open();
	}
	let onFail = (message) => {
	  // Cancelled image.
	  //console.log("Camera failed because: " + message);
	}
	navigator.camera.getPicture(onSuccess, onFail, {
	  quality: 50,
	  targetWidth: 1024,
	  targetHeight: 1024,
	  destinationType: window.Camera.DestinationType.DATA_URL,
	  sourceType: window.Camera.PictureSourceType[source]
	});
  }
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
