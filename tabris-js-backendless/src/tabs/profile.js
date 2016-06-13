import {Page, TextInput, TabFolder, Composite, Tab, ui,TextView, ImageView, ScrollView} from 'tabris';
import {saveFile} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL, STACK, PADDED, MARGINXL} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION, BORDER} from './../styles/colors';
import Button from './../components/button';


const styles = {
  textField : {
	...STACK,
	font: "22px",
	height: 50
  },
}

export default class extends Tab {
  constructor() {
	super({
	  title: 'Profile',
	  description: 'Login to proceed',
	  background:BACKGROUND
	});
	this.append(
	  new ScrollView({...FULL, left:MARGINXL, right:MARGINXL }).append(
		new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		new TextInput({...styles.textField, type: `password`, message:`Password`}),
		new Composite({...STACK,height:1, background: BORDER}),
		new Button("Sign in", {...STACK,height: 50}).on("tap",this.takePhoto.bind(this)),
		new Button("Sign up", {...STACK,height: 50}).on("tap",this.getGalleyPhoto.bind(this))
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
