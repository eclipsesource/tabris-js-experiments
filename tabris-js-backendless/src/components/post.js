import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView} from 'tabris';
import {FULL} from './../styles/layouts';
import {getIconSrc} from './../styles/icons';
import {BACKGROUND, BORDER, WHITE} from './../styles/colors';
import Avatar from './avatar';

import {sharePost , sharePostViaFacebook , sharePostViaTwitter} from './../services/Sharing';

const SharingOptions = [
  {
	name: 'Share',
	handler: sharePost
  },
  {
	name : 'Share via Facebook',
	handler: sharePostViaFacebook
  },
  {
	name : 'Share via Twitter',
	handler: sharePostViaTwitter
  }
];
const SharingButtons = SharingOptions.map(option => option.name);



const postLayout = {
  container : {
	...FULL,
	background: BACKGROUND,
  },
  border: {
	left:5, right:10, top:10,bottom: 5,
	cornerRadius:10,
	elevation: 1,
	background: BORDER,
  },
  canvas: {
	left:1, right:1, top:1,bottom: 1,
	cornerRadius:10,
	background: WHITE,
  }

}

export default class extends Composite {
  constructor() {
	super(postLayout.container);
	this.updateElements = this.updateElements.bind(this); //ES6 hack
	this.itemOptions = this.itemOptions.bind(this);

	let _elements = {};
	this.append(
	  new Composite(postLayout.border).append(
		new Composite(postLayout.canvas).append(

		  // Actual Content goes here !
		  _elements.avatar = new Avatar(null,{top: 10, height: 40, left: 10, width: 40}),
		  _elements.creator = new TextView({top: 10, height: 40, left: 60, right: 10}),
		  new Composite({top: 10, right: 10, height: 40, width: 40, highlightOnTouch:true}).append (
			_elements.options = new ImageView({top: 5, right: 5, height: 20, width: 20 , image: getIconSrc('menu_small')})
		  ).on('tap', this.itemOptions),
		  _elements.title = new TextView({bottom: 10, height: 40, left: 10, right: 10}),
		  _elements.image = new ImageView({...FULL, top:60, bottom: 60})

		)
	  )
	);
	this.set({_elements});
  }

  updateElements(item){
	let _elements = this.get('_elements');
	_elements.creator.set({text: item.creator ? item.creator.name : 'Anonymous'});
	_elements.title.set({text:item.title});

	updateImage(_elements.image,item.image);
	_elements.avatar.setEmail(item.creator ? item.creator.email : null);

	this.set({_activeItem: item});
  }

  itemOptions(){
	let _activeItem = this.get('_activeItem'),
	  title = (_activeItem.title && _activeItem.title.length>0) ? `'${_activeItem.title}'`:'this image',
	  byText = _activeItem.creator ? ' by ' + _activeItem.creator.name : '';
	let buttonPitch = -2;
	let options = {
	  androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
	  title: `What do you want with ${title+byText}?`,
	  buttonLabels: SharingButtons,
	  androidEnableCancelButton: true,
	  winphoneEnableCancelButton: true,
	  addCancelButtonWithLabel: "Cancel",
	  addDestructiveButtonWithLabel: "Delete it" // TODO: DELETE
	};
	window.plugins.actionsheet.show(options, (buttonIndex)=> {
	  	if(SharingOptions[buttonIndex+buttonPitch]){
		  SharingOptions[buttonIndex+buttonPitch].handler(_activeItem);
		}
	});
  }
}

let updateImage = (imageView, newUrl) => {
  let existingImage = imageView.get('image');
  if(  !(existingImage && existingImage.src === newUrl)){
	// Image actually changed
	imageView.set( {image: undefined});
  }
  setTimeout(function(){
	imageView.set( {image: {src: newUrl}} );
  },1);
}

