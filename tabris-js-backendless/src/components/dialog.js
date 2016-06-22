let defaultPromptParams = {
  question: 'Enter a text',
  title: 'Input',
  cancelText: 'Cancel', // null would mean cannot be cancelled.
  confirmText: 'OK', // null would mean cannot be cancelled.
  defaultText: ''
};

export function Prompt(params, selectedCallback, cancelCallback) {
  let finalParams = {
	...defaultPromptParams,
	...params
  };

  navigator.notification.prompt(
	finalParams.question, // message
	function(results) {
	  console.log( "You selected button number " + results.buttonIndex + " and entered " + results.input1);
	  if(results.buttonIndex === 1 && selectedCallback){
		selectedCallback(results.input1);
	  }
	  else if(results.buttonIndex === 2 && cancelCallback){
		cancelCallback(results.input1);
	  }
	}, // callback to invoke
	finalParams.title, // title
	[finalParams.confirmText, finalParams.cancelText], // buttonTextViews
	finalParams.defaultText // defaultText
  );
}
