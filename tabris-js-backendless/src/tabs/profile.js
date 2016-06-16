import {Page, TextInput, TabFolder, ActivityIndicator, Composite, Tab, ui,TextView, ImageView, ScrollView} from 'tabris';
import {registerUser, login, logout, updateUserProfile, getActiveUser} from './../services/BackendLess';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';
import {FULL, STACK, PADDED, MARGINXL , CENTER, HIDE, SHOW , INVISIBLE, VISIBLE} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION, BORDER} from './../styles/colors';
import Button from './../components/button';
import Gravatar from './../services/Gravatar';
import {getIconSrc} from './../styles/icons';


const styles = {
  container: {
	...FULL,
	left: MARGINXL,
	right: MARGINXL,
	...INVISIBLE
  },
  textField : {
	...STACK,
	font: "22px",
	height: 50
  },
  user: {

  },
  button: {
	...STACK,
	height: 50
  },
  spacer: {
	...STACK,
	height: 1,
	background: BORDER
  }
}

export default class extends Tab {
  constructor() {
	super({
	  title: 'Profile',
	  description: 'User Profile',
	  background:BACKGROUND,
	  image: getIconSrc('more')
	});
	// ES6 bind hack
	this.isLoading = this.isLoading.bind(this);
	this.isLoggedOut = this.isLoggedOut.bind(this);
	this.isLoggedIn = this.isLoggedIn.bind(this);
	this.validateAuth = this.validateAuth.bind(this);
	this.signIn = this.signIn.bind(this);
	this.signUp = this.signUp.bind(this);
	this.signOut = this.signOut.bind(this);
	this.nameChanged = this.nameChanged.bind(this);

	// Screen setup
	let email,password, loading, signInForm, profile, profileAvatar,profileEmail, nameInput;
	this.append(
	  signInForm = new ScrollView(styles.container).append(
		email = new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		new Composite(styles.spacer),
		new Button("Sign in", styles.button).on("tap",this.signIn),
		new Button("Sign up", styles.button).on("tap",this.signUp)
	  ),

	  profile = new ScrollView(styles.container).append(

		profileAvatar = new ImageView({ top: 40, width: 140, height: 140, centerX: 0} ),
		profileEmail = new TextView({...STACK, alignment:'center', textColor: '#aaa', text: ``}),
		new TextView({...STACK, alignment:'center', font: "18px", text: `Your Name:`}),
		nameInput = new TextInput({...styles.textField, message:`Your name here...`}).on("change:text",this.nameChanged),
		new Composite(styles.spacer),
		new Button("Sign Out", {...styles.button,top:["prev()",40]}).on("tap",this.signOut)
	  ),

	  loading = new ActivityIndicator({...CENTER, ...INVISIBLE})
	);
	this.set({
	  _elements:{
		email,password, signInForm, loading, profile, profileAvatar,profileEmail,nameInput
	  }
	});

	this.validateAuth();
  }

  validateAuth(){
	this.isLoading();
	getActiveUser()
	  .then(user=>{
		this.set({_user:user});
		if(user){
		  this.isLoggedIn();
		}
		else {
		  this.isLoggedOut();
		}
	  })
	  .catch(err => {
		console.error("FAILED TO GET SESSION DATA!");
		this.isLoggedOut();
	  })
  }

  signIn(){
	let _elements = this.get('_elements');
	this.isLoading();
	login(_elements.email.get('text'),_elements.password.get('text'))
	  .then(response => {
		console.log("SUCCESS LOGGING IN USER");
		this.set({_user:response});
		this.isLoggedIn();
	  })
	  .catch(err => {
		this.failedAuth(err, 'Sign in');
	  });
  }

  signUp(){
	let _elements = this.get('_elements');
	this.isLoading();
	registerUser(_elements.email.get('text'),_elements.password.get('text'))
	  .then(response => {
		console.log("SUCCESS REGISTERING USER");
		this.signIn();
	  })
	  .catch(err => {
		this.failedAuth(err, 'Sign up');
	  });
  }

  failedAuth(err, type){
	console.warn("FAILED TO "+type.toUpperCase());
	let errorMsg;
	errorMsg = err.message || err.toString()
	navigator.notification.alert(
	  errorMsg, // message
	  () => {}, // callback
	  "Failed to "+type, // title
	  "OK" // buttonName
	);
	this.isLoggedOut();
  }

  signOut(){
	let _elements = this.get('_elements');
	_elements.email.set('text','');
	_elements.password.set('text','');
	this.isLoading();
	logout()
	  .then(response => {
		console.log("SUCCESS LOGGING OUT");
		this.set({_user:null});
		this.isLoggedOut();
	  })
	  .catch(err => {
		console.log("FAILED LOGGING OUT");
		console.error(err);
	  });
  }

  nameChanged(widget, newName){
	updateUserProfile({name:newName})
	  .then(response => {
		console.log("SUCCESS UPDATING NAME");
	  })
	  .catch(err => {
		console.log("FAILED UPDATING NAME");
		console.error(err);
	  });
  }


  isLoading(){
	let _elements =  this.get('_elements');
	_elements.signInForm.set(INVISIBLE);
	_elements.profile.set(INVISIBLE);
	_elements.loading.set(VISIBLE);
  }
  isLoggedOut(){
	let _elements =  this.get('_elements');
	_elements.signInForm.set(VISIBLE);
	_elements.profile.set(INVISIBLE);
	_elements.loading.set(INVISIBLE);
  }
  isLoggedIn(){
	let _elements =  this.get('_elements');
	let _user = this.get('_user');
	_elements.signInForm.set(INVISIBLE);
	_elements.profile.set(VISIBLE);
	_elements.loading.set(INVISIBLE);
	_elements.profileAvatar.set({image:{src:Gravatar(_user.email)}});
	_elements.profileEmail.set({text:_user.email});
	_elements.nameInput.set({text:_user.name});
  }
}
