'use strict';
const Backendless = require('backendless');
const APPLICATION_ID = '20B6BCEC-3854-082A-FFEB-62B6E777F500',
  SECRET_KEY = '13731232-AB6B-639F-FF0A-213A0E8B2700',
  VERSION = 'v1'; //default application version;

Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
Backendless.enablePromises();



////
//function Comment(args) {
//  args = args || {};
//  this.message = args.message || "";
//  this.authorEmail = args.authorEmail || "";
//}
//var dataStore = Backendless.Persistence.of(Comment);
//var commentObject = new Comment({message: "I'm in", authorEmail: user.email})
//dataStore.save( commentObject );

export function registerUser(email,password){
  let user = new Backendless.User();
  user.email = email;
  user.password = password;
  return Backendless.UserService.register(user); //.then(userRegistered).catch(gotError);
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
          reject({error: "Something went wrong uploading to backendless.com"});
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



//function userRegistered(user) {
//  console.log("user has registered");
//}
//
//function gotError(err) {
//  console.log("error message - " + err.message);
//  console.log("error code - " + err.statusCode);
//}
//
//var user = new Backendless.User();
//user.email = "backendlessdeveloper@backedless.com";
//user.password = "password";
//Backendless.UserService.register(user).then(userRegistered).catch(gotError);



//export default Backendless;