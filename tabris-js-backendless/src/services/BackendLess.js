'use strict';
/*******************
 * Setup Backendless
 */

const Backendless = require('backendless');
const APPLICATION_ID = '20B6BCEC-3854-082A-FFEB-62B6E777F500',
  SECRET_KEY = '13731232-AB6B-639F-FF0A-213A0E8B2700',
  VERSION = 'v1'; //default application version;

Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
Backendless.enablePromises();

/*******************
 * User authenticaion + profile
 */
// TODO: in order to get persistent sessions, the best option is to have the SDK working with localstorage.


export function getActiveUser(){
  return new Promise(function(resolve, reject) {
    Backendless.UserService.isValidLogin()
      .then(isValid => {
        if(isValid){
          Backendless.UserService.getCurrentUser()
          .then(user=> {
            console.log(`Has a live session for ${user.email}`);
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
    xhr.open("PUT", `https://api.backendless.com/${VERSION}/files/binary/testFolder/${Math.floor(Math.random()*1000000000)}.jpg?overwrite=false`, true);
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
    return PostsStore.save( new Post(config) );
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

//var channel = "TestChannel",
//  message = "Hello22, world!";
//
//var response = Backendless.Messaging.publish(channel, message,null,null).then(sub =>{
//  console.log("PUB");
//  //console.log(sub)
//}).catch(err => {
//  console.error(err);
//});
//
//
//var subscriptionCallback = function (data) {
//  var messagesArray = data["messages"];
//  console.log(messagesArray[0].data)
//  // process messages here
//}
//
//var subscription = Backendless.Messaging.subscribe(channel, subscriptionCallback,null).then(sub =>{
//  console.log("SUB");
//  //console.log(sub);
//}).catch(err => {
//  console.error(err);
//});

