import {Page, TextInput, TabFolder, ActivityIndicator, Composite, Tab, ui,TextView, ImageView, ScrollView} from 'tabris';
import {registerUser, login} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL, STACK, PADDED, MARGINXL , CENTER, HIDE, SHOW , INVISIBLE, VISIBLE} from './../styles/layouts';
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
	let email,password, loading, signInForm, profile;
	this.append(
	  signInForm = new ScrollView({...FULL, left:MARGINXL, right:MARGINXL }).append(
		email = new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		new Composite({...STACK,height:1, background: BORDER}),
		new Button("Sign in", {...STACK,height: 50}).on("tap",this.signIn.bind(this)),
		new Button("Sign up", {...STACK,height: 50}).on("tap",this.signUp.bind(this))
	  ),

	  profile = new ScrollView({...FULL, left:MARGINXL, right:MARGINXL , background:'red',...INVISIBLE}).append(

		//email = new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		//password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		//new Composite({...STACK,height:1, background: BORDER}),
		//new Button("Sign in", {...STACK,height: 50}).on("tap",this.signIn.bind(this)),
		//new Button("Sign up", {...STACK,height: 50}).on("tap",this.signUp.bind(this))
	  ),

	  loading = new ActivityIndicator({...CENTER, ...INVISIBLE})
	);
	this.set({
	  _elements:{
		email,password, signInForm, loading, profile
	  }
	});
  }
  signIn(){
	let _elements = this.get('_elements');
	this.submitFormLoading();
	login(_elements.email.get('text'),_elements.password.get('text'))
	  .then(response => {
		console.log("SUCCESS LOGGING IN USER");
		console.log(response);
	  })
	  .catch(err => {
		console.log("FAIL");
		console.log(err);
	  });
  }

  signUp(){
	let _elements = this.get('_elements');
	this.submitFormLoading();
	registerUser(_elements.email.get('text'),_elements.password.get('text'))
	  .then(response => {
		console.log("SUCCESS REGISTERING USER");
		console.log(response);
	  })
	  .catch(err => {
		console.log("FAIL");
		console.log(err);
	  });

  }

  submitFormLoading(){
	let _elements =  this.get('_elements');
	_elements.signInForm.set(INVISIBLE);
	_elements.profile.set(INVISIBLE);
	_elements.loading.set(VISIBLE);
	//_elements.submitImage.animate(HIDE, {
	//  duration: 400,
	//  easing: "ease-in-out",
	//});

  }
}
