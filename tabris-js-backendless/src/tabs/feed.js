import {Page, TabFolder, Composite, Tab, ui,TextView, ImageView, CollectionView} from 'tabris';
import {getPosts} from './../services/BackendLess';
import {FULL} from './../styles/layouts';


export default class extends Tab {
  constructor() {
	super({title: 'Feed'});
	let posts;

	this.append(
	  posts = new CollectionView({
		...FULL,
		items:[],
		itemHeight: 400,
		refreshEnabled: true,
		initializeCell: (cell) => {
		  let title, img;
		  cell.append(
			img = new ImageView({...FULL}),
			title = new TextView({...FULL})
		  )
		  cell.on("change:item", (widget, item) => {
			title.set({text:item.title});
			img.set({image:{src:item.image}});
		  });
		}
	  })
	  .on('refresh', widget => {
		this.refreshItems( widget );
	  })
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
