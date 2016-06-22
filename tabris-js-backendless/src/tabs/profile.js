// Tabis.js Components
import {TextInput, ActivityIndicator, Composite, Tab, TextView, ScrollView} from 'tabris';

// Custom components
import {Button, Avatar} from './../components';
import SubmitPhotoPage from './../pages/SubmitPhotoPage';

// Services
import {registerUser, login, logout, updateUserProfile, getActiveUser} from './../services/Auth';

// Styling
import {getIconSrc} from './../styles/icons';
import {FULL, STACK, PADDED, MARGINXL , CENTER, HIDE, SHOW , INVISIBLE, VISIBLE} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION, BORDER} from './../styles/colors';

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

// Tab export
export default class extends Tab {
  constructor() {
	// Init Tab
	super({
	  title: 'Profile',
	  description: 'User Profile',
	  background:BACKGROUND,
	  image: getIconSrc('more')
	});

	// Bind internal functions
	this.isLoading = this.isLoading.bind(this);
	this.isLoggedOut = this.isLoggedOut.bind(this);
	this.isLoggedIn = this.isLoggedIn.bind(this);
	this.validateAuth = this.validateAuth.bind(this);
	this.signIn = this.signIn.bind(this);
	this.signUp = this.signUp.bind(this);
	this.signOut = this.signOut.bind(this);
	this.nameChanged = this.nameChanged.bind(this);

	// Init Elements
	let email,password, loading, signInForm, profile, profileAvatar,profileEmail, nameInput;

	// Append The UI Elements (CollectionView)
	this.append(
	  signInForm = new ScrollView(styles.container).append(
		email = new TextInput({...styles.textField, keyboard: `email`, message:`Email`}),
		password = new TextInput({...styles.textField, type: `password`, message:`Password`}),
		new Composite(styles.spacer),
		new Button("Sign in", styles.button).on("tap",this.signIn),
		new Button("Sign up", styles.button).on("tap",this.signUp)
	  ),

	  profile = new ScrollView(styles.container).append(
		profileAvatar = new Avatar(null,{ top: 40, width: 140, height: 140, centerX: 0} ),
		profileEmail = new TextView({...STACK, alignment:'center', textColor: '#aaa', text: ``}),
		new TextView({...STACK, alignment:'center', font: "18px", text: `Your Name:`}),
		nameInput = new TextInput({...styles.textField, message:`Your name here...`}).on('input',this.nameChanged),
		new Composite(styles.spacer),
		new Button("Sign Out", {...styles.button,top:["prev()",40]}).on("tap",this.signOut)
	  ),

	  loading = new ActivityIndicator({...CENTER, ...INVISIBLE})
	);

	// Set local elements
	this.set({
	  _e:{
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
	let {email, password} = this.get('_e');
	this.isLoading();
	login(email.get('text'),password.get('text'))
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
	let {email, password} = this.get('_e');
	this.isLoading();
	registerUser(email.get('text'),password.get('text'))
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
	let {email, password} = this.get('_e');
	email.set('text','');
	password.set('text','');
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
	let _e =  this.get('_e');
	_e.signInForm.set(INVISIBLE);
	_e.profile.set(INVISIBLE);
	_e.loading.set(VISIBLE);
  }
  isLoggedOut(){
	let _e =  this.get('_e');
	_e.signInForm.set(VISIBLE);
	_e.profile.set(INVISIBLE);
	_e.loading.set(INVISIBLE);
  }

  isLoggedIn(){
	let _e =  this.get('_e');
	let _user = this.get('_user');
	_e.signInForm.set(INVISIBLE);
	_e.profile.set(VISIBLE);
	_e.loading.set(INVISIBLE);
	_e.profileAvatar.setEmail(_user.email);
	_e.profileEmail.set({text:_user.email});
	_e.nameInput.set({text:_user.name});
  }
}
