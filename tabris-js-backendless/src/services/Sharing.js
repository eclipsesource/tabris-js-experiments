const onShareSuccess = function(result) {
  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
}

const onShareError = function(msg) {
  console.log("Sharing failed with message: " + msg);
}

export function sharePost(post){
  let options = {
	message: sharingMessage(post),
	files: [post.image],
  };
  window.plugins.socialsharing.shareWithOptions(options, onShareSuccess, onShareError);
}

export function sharePostViaFacebook(post){
  let message = sharingMessage(post);
  window.plugins.socialsharing.shareViaFacebook(message, post.image);
}

export function sharePostViaTwitter(post){
  let message = sharingMessage(post);
  window.plugins.socialsharing.shareViaTwitter(message, post.image);
}


function sharingMessage(post){
  let message = '';
  if(post.title && post.title.length>0){
	message += `${post.title}`;
  }
  else {
	message += `An image`;
  }
  if(post.creator && post.creator.name && post.creator.name.length>0){
	message += ` by ${post.creator.name}`;
  }
  else{
	message += ` by Anonymous`;
  }
  return message;
}
