import {Page, TextInput, TabFolder, ActivityIndicator, Composite, Tab, ui,TextView, ImageView, ScrollView} from 'tabris';
import {registerUser, login} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL, STACK, PADDED, MARGINXL , CENTER, HIDE, SHOW , INVISIBLE, VISIBLE} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION, BORDER} from './../styles/colors';
import Button from './../components/button';
import Gravatar from './../services/Gravatar';


const styles = {
  textField : {
	...STACK,
	font: "22px",
	height: 50
  },
  user: {

  }
}

export default class extends Tab {
  constructor() {
	super({
	  title: 'Profile',
	  description: 'Login to proceed',
	  background:BACKGROUND
	});
	let email,password, loading, signInForm, profile, profileAvatar,profileEmail;
	this.append(
	  signInForm = new ScrollView({...FULL, left:MARGINXL, right:MARGINXL }).append(
		email = new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		new Composite({...STACK,height:1, background: BORDER}),
		new Button("Sign in", {...STACK,height: 50}).on("tap",this.signIn.bind(this)),
		new Button("Sign up", {...STACK,height: 50}).on("tap",this.signUp.bind(this))
	  ),

	  profile = new ScrollView({...FULL, left:MARGINXL, right:MARGINXL , ...INVISIBLE}).append(


		profileAvatar = new ImageView({ top: 40, width: 140, height: 140, centerX: 0} ),
		profileEmail = new TextView({...STACK, text: ``})
		//password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		//new Composite({...STACK,height:1, background: BORDER}),
		//new Button("Sign in", {...STACK,height: 50}).on("tap",this.signIn.bind(this)),
		//new Button("Sign up", {...STACK,height: 50}).on("tap",this.signUp.bind(this))
	  ),

	  loading = new ActivityIndicator({...CENTER, ...INVISIBLE})
	);
	this.set({
	  _elements:{
		email,password, signInForm, loading, profile, profileAvatar,profileEmail
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
		this.set({_user:response});
		this.isLoggedIn();
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
		//console.log(response);
		this.signIn();
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
  }
  isLoggedIn(){
	let _elements =  this.get('_elements');
	let _user = this.get('_user');
	_elements.signInForm.set(INVISIBLE);
	_elements.profile.set(VISIBLE);
	_elements.loading.set(INVISIBLE);
	_elements.profileAvatar.set({image:{src:Gravatar(_user.email)}})
	_elements.profileEmail.set({text:_user.email})
  }
}
