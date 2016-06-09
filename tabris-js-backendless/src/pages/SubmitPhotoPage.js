import {Page, TextInput, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';
import {saveFile, savePost} from './../services/BackendLess';

export default class extends Page {

  constructor(imageData) {
	super({
	  title: 'Submit this photo!'
	});
	this.set('imageData',imageData);
	let submitButton, submitImage, postTitle;
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
		this.submitImage();
	  })
	)
	this.set('_elements',{
	  submitImage,
	  postTitle,
	  submitButton
	})
  }

  submitImage(){
	let imageData = this.get('imageData');
	saveFile(imageData)
	.then(newImageUrl => {
	  console.log("SUCCESS");
	  console.log(newImageUrl);
	  this.submitPost(newImageUrl);
	})
	.catch(err => {
	  console.log("FAIL");
	  console.log(err);
	});
  }

  submitPost(imgUrl){
	savePost({
	  image:imgUrl,
	  title: this.get('_elements').postTitle.get('text'),
	  authorEmail: 'shai@eclipsespource.com'
	}).then(response => {
		console.log("SUCCESS");
		console.log(response);
	  })
	  .catch(err => {
		console.log("FAIL");
		console.log(err);
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
