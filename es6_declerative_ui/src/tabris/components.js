// Basic Element Renderer
function RenderElement (elem, params= {}) {
	return tabris.create(elem, params);
}

/*
 Renders and element with it's params, appends it's children, and then applys mixins.
 */
function RenderTree (elemName, params= {}, children = [], mixins = []) {
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



/*
 This function creates the renderer.
 For production the approach will be a bit different to allow better tooling with IDEs
*/
const createRender = function(tagName){
	return (...rest) => {
		let children = [], params= {}, mixins =[], strings= [];
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
			else if(elemType === 'number'){
				mixins.push(element.toString());
			}
		});
		strings.forEach(string =>{
			if(resolvers[tagName]){
				resolvers[tagName](params, string);
			}
		});
		return RenderTree(tagName, params, children, mixins);
	};
}

/* The components that create Tabris.js widgets */
export const Page = createRender ("Page");
export const WebView = createRender ("WebView");
export const TextView = createRender ("TextView");
export const TextInput = createRender ("TextInput");
export const ScrollView = createRender ("ScrollView");
export const TabFolder = createRender ("TabFolder");
export const Tab = createRender ("Tab");
export const Composite = createRender ("Composite");
export const ImageView = createRender ("ImageView");
export const CollectionView = createRender ("CollectionView");
export const Action = createRender ("Action");
export const Drawer = createRender ("Drawer");
export const PageSelector = createRender ("PageSelector");

/* Alias for easier usage */
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

/* Generic helpers */
const inputType     = param => Array.isArray(param)? 'array' : typeof param;
const isValidString = param => typeof param === 'string' && param.length > 0;
