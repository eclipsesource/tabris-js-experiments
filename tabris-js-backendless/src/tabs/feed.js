import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView, CollectionView} from 'tabris';
import {getPosts} from './../services/BackendLess';
import {FULL , COLUMN_COUNT} from './../styles/layouts';
import PostView from './../components/post';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';
import {getIconSrc} from './../styles/icons';


export default class extends Tab {
  constructor() {
	super({
	  title: 'Feed',
	  description: 'Recent Posts Feed',
	  background:BACKGROUND,
	  image: getIconSrc('home')
	});
	this.refreshItems = this.refreshItems.bind(this);
	this.onDeletedItem = this.onDeletedItem.bind(this);

	let _e = {};

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
			post = new PostView()
		  )
		  cell.on("change:item", (widget, item) => {
			post.updateElements(item);
		  });

		  post.on('deleted',this.onDeletedItem);
		}
	  })
	  .on('refresh', this.refreshItems)
	);
	this.set({_e});
	this.refreshItems();
  }

  refreshItems(){
	let postsCollectionView = this.get('_e').postsCollectionView;
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
	let postsCollectionView = this.get('_e').postsCollectionView;
	let _items = this.get('_items');
	_items.splice(_items.indexOf(item),1);
	this.set({_items:_items});
	postsCollectionView.set({
	  items: _items
	});
  }

}
