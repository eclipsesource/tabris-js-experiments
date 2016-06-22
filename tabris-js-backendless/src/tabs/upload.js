// Tabis.js Components
import {Composite, Tab} from 'tabris';

// Custom components
import {Button} from './../components';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';

// Styling
import {FULL} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import {getIconSrc} from './../styles/icons';

// Tab export
export default class extends Tab {
  // Init Tab
  constructor() {
	super({
	  title: 'Upload an image',
	  description: 'Select Method to Upload',
	  background:BACKGROUND,
	  image: getIconSrc('share')
	});

	// Bind internal functions
	this.takePhoto = this.takePhoto.bind(this);
	this.getGalleyPhoto = this.getGalleyPhoto.bind(this);

	// Append The UI Elements (Container and two buttons)
	this.append(
	  new Composite({centerY:0,left:0,right:0, height: 220}).append(
		new Button("Take New Photo", {top: 10}).on("tap",this.takePhoto),
		new Button("Choose From Gallery", {bottom: 10}).on("tap",this.getGalleyPhoto)
	  )
	);
  }
  takePhoto(){
	this.getPhoto('CAMERA');
  }

  getGalleyPhoto(){
	this.getPhoto('PHOTOLIBRARY');
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
