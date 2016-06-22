import Backendless from './BackendLess';

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

export function getLoggedInUser(){
  return ACTIVE_USER;
}
