import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {saveFile} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL} from './../styles/layouts';


export default class extends Tab {
  constructor() {
	super({title: 'Upload an image'});
	//let img;
	this.append(
		Button("Take New Photo", true).on("tap",this.takePhoto.bind(this)),
	    Button("Choose From Gallery").on("tap",this.getGalleyPhoto.bind(this))

	  //img = new ImageView({top: ["prev()", 20], left: 20, width: 200, height: 200})
	);
	//this.set({img});

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
	  //this.get('img').set("image", {src: base64Prefix(imageData)});
	  new SubmitPhotoPage({src:imageData}).open();
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


function Button(text, isTop){
  return new Composite({centerY: (50* (isTop? (-1) : 1 )),left:"10%",right:"10%",height:80, background: '#ff8400',highlightOnTouch:true}).append(
	new TextView({
	  text,
	  centerX:0,centerY:0,
	  textColor:"white",
	  font:'bold 20px',
	})
  )
}
