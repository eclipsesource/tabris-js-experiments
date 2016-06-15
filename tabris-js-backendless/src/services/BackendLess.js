'use strict';
const Backendless = require('backendless');
const APPLICATION_ID = '20B6BCEC-3854-082A-FFEB-62B6E777F500',
  SECRET_KEY = '13731232-AB6B-639F-FF0A-213A0E8B2700',
  VERSION = 'v1'; //default application version;

Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
Backendless.enablePromises();

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



function Post(args) {
  args = args || {};
  this.___class = 'Post';
  this.image = args.image || "";
  this.title = args.title || "";
  if(args.creator){
    this.creator = args.creator;
  }
}
const PostsStore = Backendless.Persistence.of(Post);

export function savePost(postConfig){
  return Backendless.UserService.getCurrentUser().then(user=> {
    let config = {...postConfig};
    if(user && user.email){
      config.creator = user;
    }
    return PostsStore.save( new Post(config) );
  }).catch(console.log);
}

var query = new Backendless.DataQuery();
query.options = {relations:['creator'],pageSize: 100};

export function getPosts(){
  return PostsStore.find(query);
}

export function savePostWithImage(postConfig){
  return saveFile(postConfig.imageData)
      .then(newImageUrl => {
        return savePost({
          image:newImageUrl,
          title: postConfig.title,
          authorEmail: postConfig.authorEmail
        });
      });
}

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

