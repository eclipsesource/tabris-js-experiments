import {ImageView} from 'tabris';
import Gravatar from './../services/Gravatar';

export default class extends ImageView {
  constructor(email, config) {
	let newConfig = {...config};
	if(email){
	  newConfig.image = {src:Gravatar(email)};
	}
	super(newConfig);
	this.setEmail = this.setEmail.bind(this);
  }

  setEmail(newEmail){
	if(!newEmail) { newEmail = 'NoGravatar'; }
	this.set({image : {src:Gravatar(newEmail)}});
  }
}

