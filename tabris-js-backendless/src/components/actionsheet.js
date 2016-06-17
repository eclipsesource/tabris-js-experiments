let defaultParams = {
  title: 'What do you want to do with this item?',
  deleteText: null, // text would mean there is a button (and callback)
  cancelText: 'Cancel', // null would mean cannot be cancelled.
  buttons: []
};

export default function actionSheet(params, selectedCallback, deleteCallback, cancelCallback){
  let finalParams = {
	...defaultParams,
	...params
  }

  let buttonPitch = -1;
  let options = {
	androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
	title: finalParams.title,
	buttonLabels: finalParams.buttons,
  };
  if(finalParams.deleteText){
	// DELETE BUTTON
	options.addDestructiveButtonWithLabel =  "Delete it";
	buttonPitch = -2;
  }
  if(finalParams.cancelText){
	options = {
	  ...options,
	  androidEnableCancelButton: true,
	  winphoneEnableCancelButton: true,
	  addCancelButtonWithLabel: finalParams.cancelText,
	}
  }

  window.plugins.actionsheet.show(options, (buttonIndex)=> {
	buttonIndex = buttonIndex + buttonPitch;
	if(finalParams.deleteText && buttonIndex === -1 && deleteCallback){
	  deleteCallback();
	}
	else if (finalParams.cancelText && buttonIndex === finalParams.buttons.length && cancelCallback){
	  cancelCallback();
	}
	else {
	  selectedCallback(buttonIndex);
	}
  });
}
