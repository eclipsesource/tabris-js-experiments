import {Composite, TextView} from 'tabris';
import {BUTTON, WHITE} from './../styles/colors';

const buttonLayout = {
  container: {
	left: "10%",
	right: "10%",
	height: 80,
	cornerRadius: 10,
	background: WHITE,
	elevation: 2,
	highlightOnTouch: true
  },
  border: {
	left: 1, right: 1, top: 1, bottom: 1,
	cornerRadius: 10,
	background: BUTTON
  },
  text : {
	centerX:0,centerY:0,
	textColor: WHITE,
	font: 'bold 20px'
  }
};

export default class extends Composite {
  constructor(text, config, textConfig) {
	config = config || {};
	textConfig = textConfig || {};

	super({...buttonLayout.container, ...config});
	this.append(
	  new Composite(buttonLayout.border).append(
		new TextView({...buttonLayout.text,...textConfig,text})
	  )
	);
  }
}

