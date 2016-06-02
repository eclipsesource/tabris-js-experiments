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

const Platform = tabris.device.get("platform").toLowerCase();
const isIOS = Platform.toLowerCase() === 'ios';
/*************************
 * Application Start
 *************************/

function AppNavigationStart(){
	// Drawer Init
	Drawer( {id:'appDrawer'} ,[
		PageSelector,
	])


	// Action init
	//Action({
	//	id:'licenseToggler',
	//	title: "License",
	//	placementPriority: "high",
	//	image: {src: "resources/images/action_settings.png", scale: 3}
	//}).on("select", openLicensePage);

	//let bookStorePage = BookListPage("Book Store", "resources/images/page_all_books.png");
	//BookListPage("Popular", "resources/images/page_popular_books.png", book => book.popular);
	//BookListPage("Favorite", "resources/images/page_favorite_books.png", book => book.favorite);
	//
	//bookStorePage.open();
	let activeChatPage = ChatPage("Chat of the day", "resources/images/page_all_books.png");


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



 function createComments(){
   let comments = [];
   let count = 5, textor;
   for (let i =0; i < count; i ++){
	 comments.push(getMessage())
   }
   return comments;
 }

const chatStyles = {
  TextContainerHeight: isIOS ? 40: 54,
  TextContainerVerticalPadding: 5,
  TextRoundContainerRadius: 8
}


 const chatLayouts = {
   ios : {
	 textContainer: {
	   left:20,right:100,bottom:chatStyles.TextContainerVerticalPadding,top:["prev()",chatStyles.TextContainerVerticalPadding-1],
	   //background: '#ccc',
	   //cornerRadius: chatStyles.TextRoundContainerRadius,
	 },
	 textBox: {
	   left:0,right:0,bottom:0,top:0,
	   //background: 'white',
	   //cornerRadius: chatStyles.TextRoundContainerRadius,
	 },
	 textInput: _.extend({}, styles.full ,{
	   message: "Type something",
	   type: "multiline",
	   background: 'white',
	 })
   },
   android: {
	 textContainer: {
	   left:20,right:60,bottom:chatStyles.TextContainerVerticalPadding,top:["prev()",chatStyles.TextContainerVerticalPadding-1],
	   background: '#ccc',
	   cornerRadius: chatStyles.TextRoundContainerRadius,
	 },
	 textBox: {
	   left:1,right:1,bottom:1,top:1,
	   background: 'white',
	   cornerRadius: chatStyles.TextRoundContainerRadius,
	 },
	 textInput: _.extend({}, styles.full ,{
	   message: "Type 22 something",
	   type: "multiline",
	   background: 'white',
	 })
   }
 }

 function getTextContainerHeightPitch(text){
   let lines = text.split('\n').length;
   return (Math.min((lines-1),6))* (isIOS? 17:22);
   //console.log(chatStyles.TextContainerHeight)
   //console.log(`Setting height to : ${height} for ${lines} lines`);

 }

 function ChatPage(title, image , filter) {
   let scrollr, textCont, textForMessage, chatAction, chatButton, activeText;
   let comments = createComments();
   let cells = [];
   let collectionStyle =  _.extend({},styles.full,{bottom:chatStyles.TextContainerHeight})

   function addMessage(message){
	 let newItems = scrollr.get("items").concat([message]);
	 scrollr.set("items", newItems);

	 scrollr.reveal(newItems.length-1);
   }


   let pagerrrr = Page ({
	 title: title,
	 topLevel: true,
	 image: {src: image, scale: 3}
   }, [
	 scrollr = CollectionView({
	   layoutData: collectionStyle,// ,
	   itemHeight: isIOS ? 60 : 'auto',//60,//
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
	   left:0,right:0,bottom:0,height:chatStyles.TextContainerHeight,
	   background:'#eee'
	 },[
	   Spacer({color:"#ccc"}),
	   Composite("#textContainer",chatLayouts[Platform].textContainer,[
		 Composite(chatLayouts[Platform].textBox,[
		   textForMessage = TextInput(chatLayouts[Platform].textInput)
		 ])

	   ]),

	   chatButton = Composite("#buttonSquare",{right:chatStyles.TextContainerVerticalPadding,centerY:0,width:40,height:40,background:'#ddd',highlightOnTouch:true},[
		  chatAction = Text("#chatAction","+" , {centerX:0,centerY:0})
	   ]),

	 ])


   ]);

   textForMessage.on("change:text", (widget, text, options)=>{
	 //textCont.animate(getTextContainerHeight(text));
	 let heightPitch = getTextContainerHeightPitch(text);
	 textCont.set({height: chatStyles.TextContainerHeight + heightPitch});
	 scrollr.set({bottom: chatStyles.TextContainerHeight + heightPitch});

	  chatAction.set({text: text.length > 0 ? `Send` : `+`})
   });

   chatButton.on("tap",() => {
	 if(chatAction.get('text') === '+'){
	   console.log("Add image");
	 }
	 else {
	   let newText = textForMessage.get('text');
	   textForMessage.set({text:''});
	   addMessage(getMessage(newText));


	   setTimeout(()=>{
		 addMessage(getMessage());
	   },2000)
	 }
   });



   setInterval(()=>{
	 addMessage(getMessage());
   },14000)


   return (
	 pagerrrr
   )
 }

/*************************
 * Main
 *************************/

AppNavigationStart()


