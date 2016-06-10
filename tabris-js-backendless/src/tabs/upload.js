import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {saveFile} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import Button from './../components/button';

export default class extends Tab {
  constructor() {
	super({
	  title: 'Upload an image',
	  background:BACKGROUND
	});
	this.append(
	  new Composite({centerY:0,left:0,right:0, height: 220}).append(
		new Button("Take New Photo", {top: 10}).on("tap",this.takePhoto.bind(this)),
		new Button("Choose From Gallery", {bottom: 10}).on("tap",this.getGalleyPhoto.bind(this))
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
	  new SubmitPhotoPage(imageData).open();
	}
	let onFail = (message) => {
	  // Cancelled image.
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
