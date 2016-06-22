import {Tab, CollectionView} from 'tabris';
import {Post} from './../components';

import {FULL , COLUMN_COUNT} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import {getIconSrc} from './../styles/icons';

import {getPosts} from './../services/Posts';

export default class extends Tab {
  constructor() {
	// Init Tab
	super({
	  title: 'Feed',
	  description: 'Recent Posts Feed',
	  background:BACKGROUND,
	  image: getIconSrc('home')
	});

	// Bind internal functions
	this.refreshItems = this.refreshItems.bind(this);
	this.onDeletedItem = this.onDeletedItem.bind(this);

	// Init Elements
	let _e = {};

	// Append The UI Elements (CollectionView)
	this.append(
	  _e.postsCollectionView = new CollectionView({
		...FULL,
		items:[],
		itemHeight: 360,
		columnCount: COLUMN_COUNT,
		refreshEnabled: true,
		initializeCell: (cell) => {
		  let post
		  cell.append(
			post = new Post()
		  )
		  cell.on("change:item", (widget, item) => {
			post.updateElements(item);
		  });

		  post.on('deleted',this.onDeletedItem);
		}
	  })
	  .on('refresh', this.refreshItems)
	);

	// Set local elements
	this.set({_e});

	// Refresh the item list
	this.refreshItems();
  }

  refreshItems(){
	let { postsCollectionView } = this.get('_e');
	postsCollectionView.set({
	  refreshIndicator: true
	});
	getPosts().then(results => {
	  this.set({_items:results.data});
	  postsCollectionView.set({
		items: results.data,
		refreshIndicator: false
	  })
	})
	.catch(err =>{
	  console.log("Error - could not get the posts");
	  console.log(err);
	});

  }

  onDeletedItem(item){
	let {postsCollectionView} = this.get('_e');
	let _items = this.get('_items');
	_items.splice(_items.indexOf(item),1);
	this.set({_items});
	postsCollectionView.set({
	  items: _items
	});
  }

}
