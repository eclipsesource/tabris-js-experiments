'use strict';
/*******************
 * Setup Backendless
 */

const Backendless = require('backendless');
const APPLICATION_ID = '20B6BCEC-3854-082A-FFEB-62B6E777F500',
  SECRET_KEY = '13731232-AB6B-639F-FF0A-213A0E8B2700',
  VERSION = 'v1', //default application version;
  PUBSUB_CHANNEL = "FEED_APP",
  PUBSUB_SENDER = guid();

Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
Backendless.enablePromises();

/*******************
 * User authenticaion + profile
 */
// TODO: in order to get persistent sessions, the best option is to have the SDK working with localstorage.
// TODO: https://github.com/Backendless/JS-SDK/pull/35
// TODO: https://github.com/eclipsesource/tabris-js/issues/892

export function getActiveUser(){
  return new Promise(function(resolve, reject) {
    Backendless.UserService.isValidLogin()
      .then(isValid => {
        if(isValid){
          Backendless.UserService.getCurrentUser()
          .then(user=> {
            console.log(`App has a live session for user: ${user.email}`);
            resolve(user);
          })
          .catch(reject)
        }
        else {
          resolve(null);
        }
      }).catch(reject)
  });
}

export function registerUser(email,password){
  let user = new Backendless.User();
  user.email = email;
  user.password = password;
  user.name = email.split('@')[0] || 'Anonymous';
  return Backendless.UserService.register(user);
}

export function login(email,password){
  return Backendless.UserService.login( email, password, true);
}

export function logout(){
  return Backendless.UserService.logout();
}

export function updateUserProfile(data){
  return Backendless.UserService.getCurrentUser().then(user=> {
    return Backendless.UserService.update({
      ...data,
      ___class: 'Users',
      objectId: user.objectId
    });
  });
}

/*******************
 * Saving Images
 */

export function saveFile(fileContent){
  /****************
   * I decided to use the Rest option instead of the SDK which depends on browser capabilities.
   */
  return new Promise(function(resolve, reject) {
    let xhr = new tabris.XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if(xhr.status === 200){
          resolve(JSON.parse(xhr.responseText));
        }
        else {
          reject({error: "Something went wrong uploading to backendless.com. Status: "+xhr.status+ " Error: " + xhr.responseText});
        }
      }
    };
    xhr.open("PUT", `https://api.backendless.com/${VERSION}/files/binary/testFolder/${guid()}.jpg?overwrite=false`, true);
    xhr.setRequestHeader("Content-type", "text/plain");
    xhr.setRequestHeader("application-id", APPLICATION_ID);
    xhr.setRequestHeader("secret-key", SECRET_KEY);
    xhr.setRequestHeader("application-type", "REST");
    xhr.send(fileContent);
  });
}

/*******************
 * Post CRUD - or CR for this app :)
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
  return saveFile(postConfig.imageData)
      .then(newImageUrl => {
        return savePost({
          image:newImageUrl,
          title: postConfig.title,
          authorEmail: postConfig.authorEmail
        });
      });
}

export function getPosts(){
  let query = new Backendless.DataQuery();
  query.options = {relations:['creator'],pageSize: 100};
  return PostsStore.find(query);
}

/*******************
 * TODO: Realtime updates
 */

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
  console.log(post);
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




function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
