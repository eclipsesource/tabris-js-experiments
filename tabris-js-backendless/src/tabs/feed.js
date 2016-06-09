import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView, CollectionView} from 'tabris';
import {getPosts} from './../services/BackendLess';
import {FULL} from './../styles/layouts';
import PostView from './../components/post';

export default class extends Tab {
  constructor() {
	super({title: 'Feed'});
	let posts;

	this.append(
	  posts = new CollectionView({
		...FULL,
		items:[],
		itemHeight: 300,
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
	this.refreshItems(posts);

  }

  refreshItems(widget){

	getPosts().then(results => {
	  console.log(results.data.length);
	  widget.set({
		items: results.data,
		refreshIndicator: false
	  })
	});

  }
}
