// Tabis.js Components
import {ImageView} from 'tabris';

// General Utilities
import {GravatarUrl} from './../utils';

export default class extends ImageView {
  constructor(email, config) {
	let newConfig = {...config};
	if(email){
	  newConfig.image = {src:GravatarUrl(email)};
	}
	super(newConfig);
	this.setEmail = this.setEmail.bind(this);
  }

  setEmail(newEmail){
	if(!newEmail) { newEmail = 'NoGravatar'; }
	this.set({image : {src:GravatarUrl(newEmail)}});
  }
}

