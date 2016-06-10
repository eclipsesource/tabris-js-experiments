import {Page, TextInput, Tab, ui,TextView, ImageView , ActivityIndicator} from 'tabris';
import {FULL, CENTER, HIDE, SHOW} from './../styles/layouts';
import {savePostWithImage} from './../services/BackendLess';

import {backToFeed} from './../services/Navigation';

export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Submit this photo!'
	});
	this.set('imageData',imageData);
	let submitButton, submitImage, postTitle, loading;
	// TODO: add action ?
	this.append(

	  submitImage = new ImageView({
		id:`newPhoto`,
		...FULL,
		scaleMode: `fit`,
		//top: ["prev()",20],left:"10%",right:"10%",
		//height: 300,
		image: {src: base64Prefix(imageData)}
	  }),

	  postTitle = new TextInput({
		id:`newPhotoText`,
		top: 20,left:"10%",right:"10%",
		message:`Give this image a title (Optional)!`
	  })
	  .on("focus",() => {
		animateProp(submitImage,-100);
		animateProp(submitButton,-400);
	  })
	  .on("blur", () => {
		animateProp(submitImage,0);
		animateProp(submitButton,0);
	  }),

	  submitButton = new TextView({
		id:`submitButton`,
		bottom: 20,left:"10%",right:"10%",
		height: 50,
		background:'#ff8400',
		cornerRadius: 10,
		textColor:"white",
		font:'bold 20px',
		highlightOnTouch: true,
		text:`Submit Image`,
		alignment: `center`
	  })
	  .on('tap', () => {
		this.submitPost();
	  }),


	  loading = new ActivityIndicator({...CENTER, ...HIDE})
	)
	this.set('_elements',{
	  submitImage,
	  postTitle,
	  submitButton,
	  loading
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
	_elements.postTitle.set(HIDE);
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
