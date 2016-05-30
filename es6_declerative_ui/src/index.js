 /*************************
 * Import Components
 *************************/
import { Page, WebView, TextView, Text, ScrollView, TabFolder, Tab, Composite, Image, ImageView, CollectionView, Action, Drawer, PageSelector, TextInput} from './tabris/components';
import { Spacer, Each } from './components/custom';

/*************************
 * Import Mixins
 *************************/
import { fadeIn, fadeInRight , fadeInLeft, fadeInDown, fadeInUp } from './tabris/animations';


/*************************
 * Import Services
 *************************/
import { getBooks, getRelatedBooks, getBookComments, getBookPreview } from "./books/books-service";
import { license } from './dummy/texts';
const _ = require('lodash');

/*************************
 * Constants
 *************************/
const PAGE_MARGIN = 16;


/*************************
 * Styles
 *************************/

const styles = {
	stackMargin: {left: PAGE_MARGIN, top: "prev()", right: PAGE_MARGIN},
	stack:{top: "prev()", left: 0, right: 0},

	full: {left: 0, top: 0, right: 0, bottom: 0},
};

 import {getMessage} from './talks';

/*************************
 * Application Start
 *************************/

function AppNavigationStart(){
	// Drawer Init
	Drawer( {id:'appDrawer'} ,[
		PageSelector,
	])


	// Action init
	Action({
		id:'licenseToggler',
		title: "License",
		placementPriority: "high",
		image: {src: "resources/images/action_settings.png", scale: 3}
	}).on("select", openLicensePage);

	//let bookStorePage = BookListPage("Book Store", "resources/images/page_all_books.png");
	//BookListPage("Popular", "resources/images/page_popular_books.png", book => book.popular);
	//BookListPage("Favorite", "resources/images/page_favorite_books.png", book => book.favorite);
	//
	//bookStorePage.open();
	let activeChatPage = ChatPage("Book Store", "resources/images/page_all_books.png");


	activeChatPage.open();

}

 /*************************
  * Chat Pages
  *************************/
 let messageStyle = {
   container:{
	 bottom: ["prev()",10],
	 left: 0,
	 right: "30%"
   },
   bubble: {
	 background: "#eee",
	 cornerRadius: 15,
	 left: 40,
	 right: 0,
   },
   text: {
	 left: 10,
	 right: 10,
	 top:10,
	 bottom: 10,
   }
 };
 let messageStyle22 = {
   container:{
	 bottom: ["prev()",10],
	 left: 0,
	 right: "30%"
   },
   bubble: {
	 background: "#eee",
	 cornerRadius: 15,
	 left: 40,
	 right: 0,
   },
   text: {
	 left: 10,
	 right: 10,
	 top:10,
	 bottom: 10,
   }
 };

 let myMessageStyle = {
   container:{
	 bottom: ["prev()",10],
	 left: "30%",
	 right: 0,
   },
   bubble: {
	 background: "#ff8400",
	 cornerRadius: 15,
	 left: 0,
	 right: 40,
   },
   text: {
	 left: 10,
	 right: 10,
	 top:10,
	 bottom: 10,
   }
 };

 //function ChatMessage(text, from){
 //  return Composite(styles.stack, [
	// Composite(messageStyle.container,[
	//   Composite(messageStyle.bubble, [
	//	 Text(".messageText",text,messageStyle.text)
	//   ])
	// ])
 //  ]);
 //}


 //function ChatPage(title, image , filter) {
 //  let scrollr;
 //  let pagerrrr = Page ({
	// title: title,
	// topLevel: true,
	// image: {src: image, scale: 3}
 //  }, [
	// Composite("#stack", _.extend(styles.full,{bottom:10}), [
	//   scrollr = Composite({left:0,right:0},[
	//	 ChatMessage("Helloq 1"),
	//	 ChatMessage(`With the rise of mobile devices, many sites have moved to HTML5 for rich media content. It’s considerably more efficient and allows for better scaling across devices. Even advertisers have gotten on board with HTML5. This is probably one of the reasons Google is finally looking to deemphasize Flash content. Most of Google’s revenue comes from selling ads, and it announced several months ago that it would phase out Flash ads on AdWords at the end of 2016. It will stop accepting new submissions for Flash ads on June 30th.`),
	//	 ChatMessage(`Google calls this approach “HTML5 by Default.” Chrome has shipped with a bundled version of Flash player for several years now, and it will continue to do so. This was never an endorsement of Flash, merely a recognition of the security risk. At least by bundling the latest version with Chrome, users wouldn’t be running old and insecure builds. When Google flips the switch on this plan, that plugin won’t load automatically Flash content when you just happen across it. That’s only feasible because you see much less Flash on the web now.`),
	//	 ChatMessage("Helloq resources/ images/ page_favorit e_books.png 5"),
	//	 ChatMessage("Helloq 6"),
	//   ])
 //
	//   //Spacer({height:10,color:"white"})
	// ])
 //  ]);
 //
	//scrollr.on("pan:vertical", function(widget, event) {
	//  //handlePan(event, container);
	//  let newTranslate, lastTransformY =  scrollr.get("lastTransformY");
	//  if(lastTransformY && event.translation){
	//	newTranslate = lastTransformY + event.translation.y;
	//  }
	//  else {
	//	newTranslate = event.translation.y;
	//  }
 //
	//  console.log("pan : " +newTranslate);
 //
	//  scrollr.set("transform", {translationY: newTranslate});
	//  if (event.state === "end") {
	//	console.log("Saved : "+ newTranslate);
	//	scrollr.set("lastTransformY",newTranslate);
	//  }
 //
	//})
 //  return (
	// pagerrrr
 //  )
 //}





 //function ChatPage(title, image , filter) {
 //  let scrollr, last;
 //  let pagerrrr = Page ({
	// title: title,
	// topLevel: true,
	// image: {src: image, scale: 3}
 //  }, [
	// scrollr = ScrollView("#stack", _.extend(styles.full,{bottom:10}), [
	//   ChatMessage("Helloq 1"),
	//   ChatMessage(`With the rise of mobile devices, many sites have moved to HTML5 for rich media content. It’s considerably more efficient and allows for better scaling across devices. Even advertisers have gotten on board with HTML5. This is probably one of the reasons Google is finally looking to deemphasize Flash content. Most of Google’s revenue comes from selling ads, and it announced several months ago that it would phase out Flash ads on AdWords at the end of 2016. It will stop accepting new submissions for Flash ads on June 30th.`),
	//   ChatMessage(`Google calls this approach “HTML5 by Default.” Chrome has shipped with a bundled version of Flash player for several years now, and it will continue to do so. This was never an endorsement of Flash, merely a recognition of the security risk. At least by bundling the latest version with Chrome, users wouldn’t be running old and insecure builds. When Google flips the switch on this plan, that plugin won’t load automatically Flash content when you just happen across it. That’s only feasible because you see much less Flash on the web now.`),
	//   ChatMessage("Helloq resources/ images/ page_favorit e_books.png 5"),
	//   last = ChatMessage("Helloq 6"),
	//   //Spacer({height:10,color:"white"})
	// ])
 //  ]);
 //
 //
 //  function AppendChat(text){
	// //let scrollY = scrollr.get('scrollY');
	// //console.log("Before: "+scrollY);
	// ChatMessage(text).insertAfter(last);
	// //scrollr.set('scrollY',scrollY);
	// //console.log("Immediately After: "+scrollr.get('scrollY'));
	// //setTimeout (()=>{
	// //  console.log("1 ms After: "+scrollr.get('scrollY'));
	// //  scrollr.set('scrollY',scrollY);
	// //},1);
	// //
	// //setTimeout (()=>{
	// //  console.log("100 ms After: "+scrollr.get('scrollY'));
	// //},100);
	// //
	// //setTimeout (()=>{
	// //  console.log("1000 ms After: "+scrollr.get('scrollY'));
	// //},1000);
 //  }
	//let base = 2000;
 //  setTimeout (()=>{
	// AppendChat("So what do you think?");
 //  },base);
 //
 //  return (
	// pagerrrr
 //  )
 //}


 function ChatMessage(text, from){
   let textElem,container,bubble,ui = Composite(styles.stack, [
	 container = Composite(messageStyle.container,[
	   bubble = Composite(messageStyle.bubble, [
		 textElem =Text(".messageText",text,messageStyle.text)
	   ])
	 ])
   ]);
   return {
	 textElem, ui,container,bubble,
   }
   return ui;
 }


var arrGood = [
`With the rise of mobile devices, many sites have moved to HTML5 for rich media content. It’s considerably more efficient and allows for better scaling across devices. Even advertisers have gotten on board with HTML5. This is probably one of the reasons Google is finally looking to deemphasize Flash content. Most of Google’s revenue comes from selling ads, and it announced several months ago that it would phase out Flash ads on AdWords at the end of 2016. It will stop accepting new submissions for Flash ads on June 30th.`,
`Google calls this approach “HTML5 by Default.” Chrome has shipped with a bundled version of Flash player for several years now, and it will continue to do so. This was never an endorsement of Flash, merely a recognition of the security risk. At least by bundling the latest version with Chrome, users wouldn’t be running old and insecure builds. When Google flips the switch on this plan, that plugin won’t load automatically Flash content when you just happen across it. That’s only feasible because you see much less Flash on the web now.`,
"Helloq resources/ images/ page_favorit e_books.png 5",
]

 function createComments(){
   let comments = [];
   let count = 50, textor;
   for (let i =0; i < count; i ++){
	 comments.push(getMessage())
   }
   return comments;
 }

 function ChatPage(title, image , filter) {
   let scrollr, textView, textCont;
   let comments = createComments();//.concat([{dummy:true}]);
   let cells = [];
   let renders  = 0;
   let pagerrrr = Page ({
	 title: title,
	 topLevel: true,
	 image: {src: image, scale: 3}
   }, [
	 scrollr = CollectionView({
	   layoutData: _.extend(styles.full,{bottom:60}),
	   itemHeight: 'auto',
	   items: comments,
	   initializeCell: (cell) => {

		 cell.set({background:'white'})
		 let bubble = ChatMessage("hi");
		   bubble.ui.appendTo(cell);

		 cells.push(cell);

		 cell.on("change:item", function(widget, message) {
			//console.log(++renders);
		   //if(message.dummy){
				//cell.set({opacity:0});
			//}
		    //else {
			 // cell.set({opacity:1});
			  if(message.byMe){
				bubble.container.set(myMessageStyle.container);
				bubble.bubble.set(myMessageStyle.bubble);
				bubble.textElem.set(_.extend ( {text: message.text } , myMessageStyle.text ));
			  }
			  else {
				bubble.container.set(messageStyle22.container);
				bubble.bubble.set(messageStyle22.bubble);
				bubble.textElem.set(_.extend ( {text: message.text } , messageStyle22.text ));
			  }
			//}

		 });
	   }
	 }),

	 textCont = Composite({
	   left:0,right:0,bottom:0,height:60,
	   background:'#ff8400'
	 },[

	 ])


   ]);

   TextView("Shai",styles.full).appendTo(textCont);


   setInterval(()=>{

	 let newItems = scrollr.get("items").concat([getMessage()]);
	 scrollr.set("items", newItems);

	 scrollr.reveal(newItems.length-1);
   },4000)

	//let cellPitch = 0;
	//scrollr.on("scroll", function(widget, scroll) {
	//  //if( widget.get('_loadingNext') || widget.get('_loadedAll') ) { return; }
	//  let _prevDeltaY = widget.get('_prevDeltaY') || 0;
	//  let deltaY = scroll.deltaY;
	//  widget.set('_prevDeltaY',deltaY);
	//  let acceleration = deltaY - _prevDeltaY ;
	//  //console.log(JSON.stringify(scroll));
	//  //console.log("First: "+ widget.get("firstVisibleIndex"));
	//  //console.log("Last: "+ widget.get("lastVisibleIndex"));
	//  let limit = 5, size = 20, accl = 2;
	//  if (acceleration > limit) {
	//	//console.log("acceleration: "+ acceleration);
	//	cellPitch = Math.min(cellPitch + accl,size);
	//	cells.forEach(cell => {
	//	  cell.set("transform", {translationY: cellPitch + Math.floor(Math.random()*10)});
	//	  cell.animate({transform: {translationY: 0}},{duration:100});
	//	});
	//  }
	//
	//  if (acceleration < (0-limit)) {
	//	//console.log("acceleration: "+ acceleration);
	//	cellPitch = Math.max(cellPitch - accl, 0-size);
	//	cells.forEach(cell => {
	//	  cell.set("transform", {translationY: cellPitch + Math.floor(Math.random()*10)});
	//	  cell.animate({transform: {translationY: 0}},{duration:100});
	//	});
	//  }
	//
	//  //var remaining = widget.get("items").length - widget.get("lastVisibleIndex");
	//  //if (remaining < 8) {
	//  //  loadMoreItems(widget, CELLS_PER_ROW);
	//  //}
	//
	//  //else {
	//	//cells.forEach(cell => {
	//	//  cellPitch = cellPitch - 1;
	//	//  //cell.animate({transform: {translationY: 0}},{duration:300});
	//	//  cell.set("transform", {translationY: cellPitch});
	//	//});
	//  //}
	//});






   //
   //function AppendChat(text){
	// ChatMessage(text).insertAfter(last);
   //}
   //let base = 2000;
   //
   //setTimeout (()=>{
	// AppendChat("So what do you think?");
   //},base);

   return (
	 pagerrrr
   )
 }





/*************************
 * Book Pages
 *************************/
function BookListPage(title, image , filter) {
	return (
		Page ({
			title: title,
			topLevel: true,
			image: {src: image, scale: 3}
		}, [
			BooksList( getBooks(filter) ),
		])
	)
}

function openBookPage(book) {
	return (
		Page ( book.title , [
			BookDetails(book),
			Spacer(),
			BookTabs(book),
		]).open()
	)
}

function openReadBookPage(book) {
	return (
		Page ( book.title , [
			ScrollView( {layoutData: styles.full, direction: "vertical"} , [
				Text( book.title    , readBookPageStyles.bookTitle           , fadeIn(1000) ),
				Text( getBookPreview(book.id) , readBookPageStyles.bookChapter , fadeIn(3000, 500) )
			]),
		]).apply(readBookPageStyles).open()
	)
}

const readBookPageStyles = {
	bookTitle:{
		layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN * 2, right: PAGE_MARGIN},
		textColor: "rgba(0, 0, 0, 0.5)",
		font: "bold 20px",
	},
	bookChapter:{
		layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", PAGE_MARGIN], bottom: PAGE_MARGIN},
	}
};

/*************************
 * Book Sub-components
 *************************/

function BooksList(books) {
	return (
		CollectionView({
			layoutData: styles.full,
			itemHeight: 72,
			items: books,
			initializeCell: (cell) => {
				[
					Image({
						class: 'bookImage',
						layoutData: {left: PAGE_MARGIN, centerY: 0, width: 32, height: 48},
						scaleMode: "fit"
					}),
					Text({
						class: 'bookTitle',
						layoutData: {left: 64, right: PAGE_MARGIN, top: PAGE_MARGIN},
						textColor: "#4a4a4a"
					}),
					Text({
						class:'bookAuthor',
						layoutData: {left: 64, right: PAGE_MARGIN, top: ["prev()", 4]},
						textColor: "#7b7b7b"
					})
				].forEach(elem => elem.appendTo(cell))

				cell.on("change:item", function(widget, book) {
					cell.children(".bookImage").set("image",book.image);
					cell.children(".bookTitle").set("text",book.title);
					cell.children(".bookAuthor").set("text",book.author);
				});
			}
		}).on("select", (target, value) => { openBookPage(value) })
	)
}

function BookDetails(book) {
	return (
		Composite( bookDetailsStyle.container,[
			Image( book.image, bookDetailsStyle.image, fadeIn(800) ),
			Composite( bookDetailsStyle.textContainer , [
				Text( book.title , bookDetailsStyle.title  , fadeInRight(500, 100) ),
				Text( book.author, bookDetailsStyle.author , fadeInRight(500, 300) ),
				Text( book.price , bookDetailsStyle.price  , fadeInRight(500, 500) )
			])
		]).on("tap",  () => { openReadBookPage(book) })
	)
}


const bookDetailsStyle = {
	container: {
		background: "white",
		highlightOnTouch: true,
		top: 0, height: 192, left: 0, right: 0
	},
	image: {
		height: 160, width: 106, left: PAGE_MARGIN, top: PAGE_MARGIN
	},
	textContainer: {
		left: ["prev()", PAGE_MARGIN],
		top: PAGE_MARGIN,
		right: PAGE_MARGIN
	},
	title: {
		font: "bold 20px",
		left: 0, top: "prev()", right: 0
	},
	author: {
		left: 0, top: "prev()", right: 0
	},
	price: {
		left: 0, top:  ["prev()",PAGE_MARGIN],
		textColor: "rgb(102, 153, 0)"
	}
}

function BookTabs(book) {
	return (
		TabFolder ({
			tabBarLocation: "top",
			paging: true,
			layoutData: {top: "prev()", left: 0, right: 0, bottom: 0}
		}, [
			// Related Tab
			Tab('Related',[
				BooksList(getRelatedBooks(book.id))
			]),
			// Comments Tab
			Tab('Comments',[
				CommentsList(getBookComments(book.id))
			])
		])
	)
}

function CommentsList(comments = []) {
	return (
		ScrollView(styles.full,
			// An example of an Each (items, component, fallback_for_empty_arr)
			Each (comments, CommentItem, NoComments)
		)
	)
}

function CommentItem(comment) {
	return (
		Composite( commentStyling.commentContainer, [
			Image( comment.user.avatar , commentStyling.commenterAvatar),
			Text ( comment.user.name   , commentStyling.commentAuthor  ),
			Text ( comment.text       , commentStyling.commentText     )
		]).apply(commentStyling)
	)
}

function NoComments() {
	return (
		Composite(commentStyling.commentContainer, [
			Text('No comments yet for this item :(', commentStyling.noComments),
		])
	)
}

const commentStyling = {
	commentContainer: styles.stackMargin,
	commenterAvatar: {
		left: PAGE_MARGIN,
		top: 10,
		width: 32,
		height: 48,
		scaleMode: "fit",
	},
	commentText:{
		left: 64,
		right: PAGE_MARGIN,
		top: "prev()",
		textColor: "#7b7b7b",
	},
	commentAuthor:{
		left: 64,
		right: PAGE_MARGIN,
		top: 15,
		textColor: "#000000",
	},
	noComments: {
		left: 64,
		right: PAGE_MARGIN,
		top: 15,
		textColor: "#000000",
		font: "bold 16px",
	}
}


/*************************
 * License Pages
 *************************/

const licenseConfig = {
	header: {
		layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", 10]},
	},
	caption: {
		textColor: "rgba(71, 161, 238, 0.75)",
		layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", 10]}
	},
	authors: {
		markupEnabled: true,
		layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", 10]}
	}
}

function openLicensePage() {
	return (
		Page ("License", [
			Text( license.header,       licenseConfig.header  ),
			Text( license.link.caption, licenseConfig.caption ).on("tap", openLicenseWebPage ),
			Text( license.authors,      licenseConfig.authors )
		])
		.on("appear", () => actionVisbility(false) )
		.on("disappear", () => actionVisbility(true) )
		.open()
	)
}

function openLicenseWebPage() {
	return (
		Page (license.link.caption ,[
			WebView ({
				layoutData: styles.full,
				url: license.link.url
			})
		])
		.on("appear", () => actionVisbility(false) )
		.open()

	)
}

function actionVisbility(isVisible){
	tabris.ui.children("#licenseToggler").set('visible',isVisible);
}


/*************************
 * Main
 *************************/

AppNavigationStart()


