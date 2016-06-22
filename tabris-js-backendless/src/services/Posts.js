import Backendless, {saveImage} from './BackendLess';
import {getLoggedInUser} from './Auth';
import {guid} from './../utils';

/*******************
 * Post SCHEMA
 */

function Post(args) {
  args = args || {};
  this.___class = 'Post';
  this.image = args.image || '';
  this.title = args.title || '';
  if(args.creator){
	// Images without a creator are considered anonymous
	this.creator = args.creator;
  }
}
const PostsStore = Backendless.Persistence.of(Post);

/*******************
 * Post CREATE
 */
export function savePost(postConfig){
  return Backendless.UserService.getCurrentUser().then(user=> {
	let config = {...postConfig}; //Clone to prevent mutation
	if(user && user.email){
	  user.___class = 'Users';
	  config.creator = user;
	}
	return PostsStore.save( new Post(config))
	  .then(post => {
		PublishPostSubmission(post);
		return post;
	  });
  });
}


export function savePostWithImage(postConfig){
  // Utility function to make the client api more convenient
  return saveImage(postConfig.imageData)
	.then(newImageUrl => {
	  return savePost({
		image:newImageUrl,
		title: postConfig.title,
		authorEmail: postConfig.authorEmail
	  });
	});
}

/*******************
 * Post READ
 */
export function getPosts(){
  let query = new Backendless.DataQuery();
  query.options = {relations:['creator'],pageSize: 100};
  return PostsStore.find(query);
}

/*******************
 * Post UPDATE
 */
export function updatePostTitle(postConfig, newTitle){
  postConfig.title = newTitle;
  return PostsStore.save( postConfig );
}

/*******************
 * Post DELETE
 */
export function deletePost(postConfig){
  return PostsStore.remove( postConfig );
}

/*******************
 * Utility function do decide if the user can rename or delete a post.
 * It's important to understand that as with any stack, these rules need to be enforced on the backend in addition to the client
 * In this case that would be definitions in Backendless.
 */
export function doIOwn(postConfig){
  let activeUser = getLoggedInUser();
  if(!postConfig || !activeUser){return false;}      // You can't delete if you are not registered
  if(!postConfig.creator) {return true;}              // All users can delete anonymous posts
  return (postConfig.creator.objectId===activeUser); // Only you can delete you posts
}

/*******************
 * Post REALTIME Updates
 */

const PUBSUB_CHANNEL = "FEED_APP",
      PUBSUB_SENDER = guid();

function PublishPostSubmission(post){
  let message = JSON.stringify({
	type: 'newPost',
	sender: PUBSUB_SENDER,
	data: {
	  objectId: post.objectId,
	  title: post.title,
	  creator: post.creator ? {
		objectId: post.creator.objectId,
		email: post.creator.email,
		name: post.creator.name,
	  } : null
	}
  });
  Backendless.Messaging.publish(PUBSUB_CHANNEL, message,null,null).then(sub =>{
	console.log("PUBLISHED NEW POST");
  }).catch(err => {
	console.error(err);
  });
}


function newPostCallback(post){
  console.log("A NEW POST PUBLISHED IN THE FEED");
  let message = 'A new image was posted';
  if(post.creator && post.creator.name && post.creator.name.length>0){
	message += ` by ${post.creator.name}`;
  }
  if(post.title && post.title.length>0){
	message += ` - ${post.title}`;
  }
  window.plugins.toast.showWithOptions(
	{
	  message,
	  duration: 8500, // ms
	  position: "bottom",
	});
}


var subscriptionCallback = function (data) {
  var messagesArray = data["messages"];
  let handler;
  messagesArray.forEach(message => {
	handler = JSON.parse(message.data);
	if(handler.sender !== PUBSUB_SENDER){ // Prevent getting my own messages
	  if(handler.type === 'newPost'){
		newPostCallback(handler.data);
	  }
	}
  });
}

var subscription = Backendless.Messaging.subscribe(PUBSUB_CHANNEL, subscriptionCallback,null).then(sub =>{
  console.log("SUBSCRIBED TO NEW POSTS FEED");
}).catch(err => {
  console.error(err);
});


