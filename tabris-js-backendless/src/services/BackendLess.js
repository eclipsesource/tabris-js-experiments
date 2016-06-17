'use strict';
/*************************
 *  Why this demo app?
 *  To Explain how easy some of the "hard" parts of building an app can be combining Tabris.js with Backendless
 *  1. User Management - Register, Login, Persist session, Personal data, Social login (TODO)
 *  2. Data CRUD - Create, Read, Update (TODO), Delete (TODO) assets.
 *  3. File management - Upload images taken on the device. Scale on Server (TODO).
 *  4. Realtime communication between clients via Pubsub
 *  5. Push notifications? (TODO)
 *
 *
 *  Note: while this app conveys some security rules - for instance only you can delete your posts (not other users),
 *  You also have to enforce security permissions in Backendless
 *
 */

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

let ACTIVE_USER = null;

/*******************
 * User authentication + profile
 */

export function getActiveUser(){
  return new Promise(function(resolve, reject) {
    Backendless.UserService.isValidLogin()
      .then(isValid => {
        if(isValid){
          Backendless.UserService.getCurrentUser()
          .then(user=> {
            console.log(`App has a live session for user: ${user.email}`);
            ACTIVE_USER = user.objectId;
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
  return Backendless.UserService.login( email, password, true)
    .then(user => {
      ACTIVE_USER = user.objectId;
      return user;
    });
}

export function logout(){
  return Backendless.UserService.logout()
    .then(res => {
      ACTIVE_USER = null;
      return res;
    });
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

// CREATE
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


// READ
export function getPosts(){
  let query = new Backendless.DataQuery();
  query.options = {relations:['creator'],pageSize: 100};
  return PostsStore.find(query);
}


// UPDATE TODO
export function doIOwn(postConfig){
  return (postConfig && postConfig.creator && postConfig.creator.objectId===ACTIVE_USER);
}

// DELETE
export function deletePost(postConfig){
  return PostsStore.remove( postConfig );
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


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
