import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView, CollectionView} from 'tabris';
import {getPosts} from './../services/BackendLess';
import {FULL , COLUMN_COUNT} from './../styles/layouts';
import PostView from './../components/post';
import {BACKGROUND, WHITE, NAVIGATION} from './../styles/colors';

export default class extends Tab {
  constructor() {
	super({
	  title: 'Feed',
	  background:BACKGROUND
	});
	let postsCollectionView;
	this.append(
	  postsCollectionView = new CollectionView({
		...FULL,
		items:[],
		itemHeight: 300,
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
		}
	  })
	  .on('refresh', this.refreshItems)
	);
	this.refreshItems(postsCollectionView);

  }

  refreshItems(postsCollectionView){
	postsCollectionView.set({
	  refreshIndicator: true
	});
	getPosts().then(results => {
	  postsCollectionView.set({
		items: results.data,
		refreshIndicator: false
	  })
	});

  }
}
