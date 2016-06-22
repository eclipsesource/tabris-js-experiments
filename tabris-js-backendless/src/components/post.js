// Tabis.js Components
import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView, ActivityIndicator} from 'tabris';

// Custom components
import {ActionSheet, Prompt, Avatar} from './../components';

// Services
import {deletePost, updatePostTitle, doIOwn} from './../services/Posts';
import {sharePost , sharePostViaFacebook , sharePostViaTwitter} from './../services/Sharing';

// General Utilities
import {updateImage} from './../utils';

// Styling
import {FULL, HIDE, SHOW ,CENTER, INVISIBLE , VISIBLE, MARGIN} from './../styles/layouts';
import {getIconSrc} from './../styles/icons';
import {BACKGROUND, BORDER, WHITE} from './../styles/colors';

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

const styles = {
  container : {
	...FULL,
	background: BACKGROUND,
  },
  border: {
	left:5, right:MARGIN, top:MARGIN,bottom: 5,
	cornerRadius:10,
	elevation: 1,
	background: BORDER,
  },
  canvas: {
	left:1, right:1, top:1,bottom: 1,
	cornerRadius:10,
	background: WHITE,
  },


  avatar: {
	top: MARGIN, height: 40, left: MARGIN, width: 40
  },
  creator: {
	top: MARGIN, height: 40, left: 60, right: MARGIN
  },
  optionsIcon: {
	container: {top: MARGIN, right: MARGIN, height: 40, width: 40, highlightOnTouch:true},
	image: {top: 5, right: 5, height: 20, width: 20 , image: getIconSrc('menu_small')}
  },
  title : {bottom: MARGIN, height: 40, left: MARGIN, right: MARGIN},
  image: {...FULL, top:60, bottom: 60},

  loading: {...CENTER, ...INVISIBLE}
}


// Component export
export default class extends Composite {

  constructor() {
	// Init Container
	super(styles.container);

	// Bind internal functions
	this.updateElements = this.updateElements.bind(this);
	this.itemOptions = this.itemOptions.bind(this);
	this.deletePost = this.deletePost.bind(this);
	this.updateTitle = this.updateTitle.bind(this);

	// Init Elements
	let _e = {};

	// Append The UI Elements (CollectionView)
	this.append(
	  new Composite(styles.border).append(
		new Composite(styles.canvas).append(
		  _e.postContent = new Composite(FULL).append(
			// Actual Content goes here !
			_e.avatar = new Avatar(null,styles.avatar),
			_e.creator = new TextView(styles.creator),
			new Composite(styles.optionsIcon.container).append (
			  _e.options = new ImageView(styles.optionsIcon.image)
			).on('tap', this.itemOptions),
			_e.title = new TextView(styles.title),
			_e.image = new ImageView(styles.image)
		  ),

		  _e.loading = new ActivityIndicator(styles.loading)
		)
	  )
	);
	// Set local elements
	this.set({_e});
  }

  updateElements(item){
	let _e = this.get('_e');
	_e.postContent.set(SHOW);
	_e.creator.set({text: item.creator ? item.creator.name : 'Anonymous'});
	_e.title.set({text:item.title});
	_e.loading.set(INVISIBLE);
	_e.avatar.setEmail(item.creator ? item.creator.email : null);
	updateImage(_e.image,item.image);
	this.set({_activeItem: item});
  }

  itemOptions(){
	let _activeItem = this.get('_activeItem'),
	  isMine = doIOwn(_activeItem),
	  title = (_activeItem.title && _activeItem.title.length>0) ? `'${_activeItem.title}'`:'this image',
	  byText = _activeItem.creator ? ' by ' + (isMine ? 'You' : _activeItem.creator.name) : '',
	  question = `What do you want with ${title+byText}?`;

	let Options =  isMine ? [
	  {
		name: 'Update Title',
		handler: this.updateTitle
	  }
	] : [];
	Options = Options.concat(SharingOptions);
    let Buttons = Options.map(option => option.name);

	ActionSheet({
	  title: question,
	  deleteText: isMine ? 'Delete post' : null,
	  buttons: Buttons
	}, buttonIndexChosen => {

	  console.log("SELECTED: "+Options[buttonIndexChosen].name);
	  Options[buttonIndexChosen].handler(_activeItem);

	}, this.deletePost);
  }

  deletePost() {
	let _activeItem = this.get('_activeItem');
	// Animate delete
	let _e = this.get('_e');
	_e.loading.set(VISIBLE);
	_e.postContent.animate(HIDE, {
	  duration: 200,
	  easing: "ease-out",
	});

	// Request delete
	deletePost(_activeItem)
	  .then(res => {
		console.log("DELETED THIS POST");
		this.trigger('deleted',_activeItem);
	  })
	  .catch(err => {
		console.log("FAILED DELETING THIS POST");
		console.error(err);
	  });
  }

  updateTitle() {
	let _activeItem = this.get('_activeItem');
	let _e = this.get('_e');
	Prompt({
	  title: 'New Title',
	  question: 'Enter a new title for this post',
	  confirmText: 'Save',
	  defaultText: _activeItem.title
	}, newTitle => {

	  _e.title.set({text:newTitle}); // Optimistic update of the title, before request returns :)

	  updatePostTitle(_activeItem,newTitle)
		.then(res => {
		  console.log("UPDATED THIS POST");
		  this.trigger('updated',_activeItem);
		})
		.catch(err => {
		  console.log("FAILED UPDATING THIS POST");
		  console.error(err);
		});
	});
  }
}
