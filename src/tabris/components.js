// Basic Element Renderer
function RenderElement (elem = "Composite", params= {}) {
	return tabris.create(elem, params);
}

function RenderTree (elemName = "Composite", params= {}, children = [], mixins = []) {
	let elem = RenderElement(elemName,params);
	// Append the children to the element.
	children.forEach((child) => {
		if(typeof child === 'function'){
			child().appendTo(elem);
		}
		else if(typeof child === 'undefined'){
			// Don't do anything without an element
		}
		else {
			child.appendTo(elem);
		}
	});
	// Run the mixins on the root element (like animations).
	mixins.forEach( mixin => typeof mixin ===  'function' ? mixin(elem) : null );
	return elem;
}

// Generic helpers. Some borrowed from https://github.com/ohanhi/hyperscript-helpers/blob/master/src/index.js
const inputType     = param => Array.isArray(param)? 'array' : typeof param;
const isValidString = param => typeof param === 'string' && param.length > 0;
const startsWith    = (string, start) => string[0] === start;
const isSelector    = param => isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));

// This function creates the renderer.
// For production use the approach will be a bit different to allow better tooling with IDEs
const createRender = function(tagName){
	return (...rest) => {
		let children = [], params= {}, mixins =[], strings= [];
		// TODO: clean up these functions
		rest.forEach(element =>{
			let elemType = inputType (element);
			if(elemType === 'array'){
				children = element;
			}
			else if(elemType === 'object'){
				params = element;
			}
			else if(elemType === 'function'){
				mixins.push(element);
			}
			else if(isValidString(element)){
				strings.push(element);
			}
		});
		strings.forEach(string =>{
			if(isSelector(string)){
				// TODO: support both id and class - #id.class
				if(startsWith(string, '#')){
					params['id'] = string.slice(1);
				}
				if(startsWith(string, '.')){
					params['class'] = string.slice(1);
				}
			}
			else if(isValidString(string)){
				if(resolvers[tagName]){
					resolvers[tagName](params, string);
				}
			}
		});
		return RenderTree(tagName, params, children, mixins);
	};
}


export const Page = createRender ("Page");
export const WebView = createRender ("WebView");
export const TextView = createRender ("TextView");
export const ScrollView = createRender ("ScrollView");
export const TabFolder = createRender ("TabFolder");
export const Tab = createRender ("Tab");
export const Composite = createRender ("Composite");
export const ImageView = createRender ("ImageView");
export const CollectionView = createRender ("CollectionView");
export const Action = createRender ("Action");
export const Drawer = createRender ("Drawer");
export const PageSelector = createRender ("PageSelector");

/* Alias */
export const Text = createRender ("TextView");
export const Image = createRender ("ImageView");


/* Wildcard resolvers */
const resolvers = {
	Text: ( params, element ) => params["text"] = element,
	TextView: ( params, element ) => params["text"] = element,
	Image: ( params, element ) => params["image"] = element,
	ImageView: ( params, element ) => params["image"] = element,
	Tab: ( params, element ) => params["title"] = element,
	Page: ( params, element ) => params["title"] = element,
}
