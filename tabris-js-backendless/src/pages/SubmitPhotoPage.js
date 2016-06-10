import {Page, TextInput, Tab, ui,TextView, ImageView , ActivityIndicator, Composite} from 'tabris';
import {FULL, CENTER, HIDE, SHOW , MARGIN} from './../styles/layouts';
import {savePostWithImage} from './../services/BackendLess';
import {backToFeed} from './../services/Navigation';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import Button from './../components/button';

const Platform = tabris.device.get("platform").toLowerCase();
const isIOS = Platform.toLowerCase() === 'ios';

const chatStyles = {
  TextContainerHeight: isIOS ? 60: 80,
  TextContainerVerticalPadding: 12,
  TextRoundContainerRadius: 8
}

const chatLayouts = {

	textContainer: {
	  left:MARGIN,right:"26%",bottom:chatStyles.TextContainerVerticalPadding,top:chatStyles.TextContainerVerticalPadding,
	},
	textInput: {...FULL,
	  background: WHITE,
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
		id:`newPhoto`,
		...FULL,
		bottom: chatStyles.TextContainerHeight,
		scaleMode: `fit`,
		image: {src: base64Prefix(imageData)}
	  }),


	  textContainer = new Composite({
		left:0,right:0,bottom:0,height:chatStyles.TextContainerHeight,
		elevation:8,
		background:'#eee'
	  }).append(
		//Spacer({color:"#ccc"}),
		new Composite(chatLayouts.textContainer).append(

			postTitle = new TextInput({...chatLayouts.textInput,
			  id:`newPhotoText`,
			  message:`Give this image a title (Optional)!`
			}).on("focus",() => {
				animateProp(submitImage,96);
				animateProp(textContainer,-11);
			  })
			  .on("blur", () => {
				console.log("Lost focus - Android bug");
				animateProp(submitImage,0);
				animateProp(textContainer,0);
			  })

		),

		submitButton = new Button("Submit", {left: ["prev()",MARGIN], right: MARGIN, height: undefined, bottom:chatStyles.TextContainerVerticalPadding,top:chatStyles.TextContainerVerticalPadding , TextRoundContainerRadius: 8}, {TextRoundContainerRadius: 8,font: 'bold 16px'})
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

function animateProp(elem, trans){
  elem.animate({
	transform: {
	  translationY: trans,
	}
  }, {
	duration: 200,
	easing: "ease-out",
  });
}
