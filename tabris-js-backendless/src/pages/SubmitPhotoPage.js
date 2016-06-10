import {Page, TextInput, Tab, ui,TextView, ImageView , ActivityIndicator, Composite} from 'tabris';
import {FULL, CENTER, HIDE, SHOW , MARGIN, PADDED} from './../styles/layouts';
import {savePostWithImage} from './../services/BackendLess';
import {backToFeed} from './../services/Navigation';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import Button from './../components/button';

const Platform = tabris.device.get("platform").toLowerCase();
const isIOS = Platform.toLowerCase() === 'ios';

const chatStyles = {
  TextContainerHeight: isIOS ? 60: 80,
}

const submitLayouts = {
  newImage: {
	...FULL,
	bottom: chatStyles.TextContainerHeight,
	scaleMode: `fit`,
  },
  textContainer: {
	left:0,right:0,bottom:0,height:chatStyles.TextContainerHeight,
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
		...submitLayouts.newImage,
		image: {src: base64Prefix(imageData)}
	  }),

	  textContainer = new Composite(submitLayouts.textContainer).append(
		//Spacer({color:"#ccc"}),
		new Composite(submitLayouts.inputContainer).append(

			postTitle = new TextInput(submitLayouts.textInput)
			  .on("focus",() => {
				animatePitch(submitImage,96);
				animatePitch(textContainer,-11);
			  })
			  .on("blur", () => {
				console.log("Lost focus - Android bug");
				animatePitch(submitImage,0);
				animatePitch(textContainer,0);
			  })

		),

		submitButton = new Button("Submit", submitLayouts.submitButton, {font: 'bold 16px'})
		.on('tap', () => {
		  this.submitPost();
		})
	  ),

	  loading = new ActivityIndicator({...CENTER, ...HIDE})
	)
	this.set('_elements',{
	  submitImage,
	  postTitle,
	  submitButton,
	  loading,
	  textContainer
	})
  }

  submitPost(){
	this.submitImageLoading();
	let imageData = this.get('imageData');
	savePostWithImage({
	  imageData,
	  title: this.get('_elements').postTitle.get('text'),
	  authorEmail: 'shai@eclipsespource.com'
	}).then(response => {
		console.log("SUCCESS");
		console.log(response);
	  	this.leavePage();
	  })
	  .catch(err => {
		console.log("FAIL");
		console.log(err);
		this.leavePage();
	  });
  }

  leavePage(){
	console.log("LEAVE 1");
	backToFeed();

	console.log("LEAVE 4");
	this.close();
  }

  submitImageLoading(){
	let _elements =  this.get('_elements');
	_elements.textContainer.set(HIDE);
	_elements.submitButton.set(HIDE);
	_elements.loading.set(SHOW);
	_elements.submitImage.animate(HIDE, {
	  duration: 400,
	  easing: "ease-in-out",
	});

  }

}

function base64Prefix(src){
  return `data:image/jpeg;base64,${src}`;
}

function animatePitch(elem, trans){
  elem.animate({
	transform: {
	  translationY: trans,
	}
  }, {
	duration: 200,
	easing: "ease-out",
  });
}
