// Tabis.js Components
import {Page, TextInput, ImageView , ActivityIndicator, Composite} from 'tabris';

// Custom components
import {Button} from './../components';

// Services
import {savePostWithImage} from './../services/Posts';
import {backToFeed} from './../services/Navigation';

// General Utilities
import {base64Prefix, animateTranslationY} from './../utils';

// Styling
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import {FULL, CENTER, HIDE, SHOW , MARGIN, PADDED , PHOTO_SUBMIT_TEXT_HEIGHT} from './../styles/layouts';

const styles = {
  newImage: {
	...FULL,
	bottom: PHOTO_SUBMIT_TEXT_HEIGHT,
	scaleMode: `fit`,
  },
  textContainer: {
	left:0,right:0,bottom:0,height:PHOTO_SUBMIT_TEXT_HEIGHT,
	elevation:8,
	background:'#eee'
  },
  inputContainer: {
	...PADDED,
	right: "26%"

  },
  textInput: {
	...FULL,
	message:`Give this image a title (Optional)!`,
	background: WHITE,
  },
  submitButton: {
	...PADDED,
	left: ["prev()", MARGIN],
	right: MARGIN,
	height: undefined,
  }

};

// Page export
export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Submit this photo!',
	  background: BACKGROUND
	});
	this.set('imageData',imageData);
	let submitButton, submitImage, postTitle, loading;
	let textContainer;
	this.append(

	  submitImage = new ImageView({
		...styles.newImage,
		image: {src: base64Prefix(imageData)}
	  }),

	  textContainer = new Composite(styles.textContainer).append(
		new Composite(styles.inputContainer).append(
		  postTitle = new TextInput(styles.textInput)
			.on("focus",() => {
			  animateTranslationY(submitImage,96);
			  animateTranslationY(textContainer,-9);
			})
			.on("blur", () => {
			  console.log("Lost focus - Android bug");
			  animateTranslationY(submitImage,0);
			  animateTranslationY(textContainer,0);
			})
		),

		submitButton = new Button("Submit", styles.submitButton, {font: 'bold 16px'})
		.on('tap', () => {
		  this.submitPost();
		})
	  ),

	  loading = new ActivityIndicator({...CENTER, ...HIDE})
	)
	this.set('_e',{
	  submitImage,
	  postTitle,
	  submitButton,
	  loading,
	  textContainer
	})
  }

  submitPost(){
	this.submitImageLoading(true);
	let imageData = this.get('imageData');
	savePostWithImage({
	  imageData,
	  title: this.get('_e').postTitle.get('text'),
	}).then(response => {
		console.log("SAVED POST WITH IMAGE DATA");
	  	this.leavePage();
	  })
	  .catch(err => {
		console.log("FAILED TO SAVE POST WITH IMAGE DATA");
		let errorMsg;
		errorMsg = err.message || err.toString()
		navigator.notification.alert(
		  errorMsg, // message
		  () => {}, // callback
		  "Failed to Submit Image", // title
		  "OK" // buttonName
		);
		this.submitImageLoading(false);
	  });
  }

  leavePage(){
	backToFeed();
	this.close();
  }

  submitImageLoading(isLoading){
	let _e =  this.get('_e');
	_e.textContainer.set(isLoading? HIDE : SHOW);
	_e.submitButton.set(isLoading? HIDE : SHOW);
	_e.loading.set(isLoading? SHOW : HIDE);
	_e.submitImage.animate(isLoading? HIDE : SHOW, {
	  duration: 400,
	  easing: "ease-in-out",
	});
  }
}
