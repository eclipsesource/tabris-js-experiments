let NavigationElements = {};

export function registerNavigation(newElements){
  NavigationElements = {
	...newElements
  };
  NavigationElements.Navigation.on("change:selection", (widget, tab) => {
      //colorUpdates (tab.get('_feed').color );
      console.log(tab.get('title'));
	  NavigationElements.MainPage.set({title:tab.get('description')});
      //tab.set('image', getIconSrc(tab.get('_imgName') + '_full') )
      //tab.trigger("appear",tab);
  });
}

export function backToFeed(){
  console.log("LEAVE 2");
  NavigationElements.Navigation.set("selection", NavigationElements.FeedTab);
  console.log("LEAVE 3");
  NavigationElements.FeedTab.refreshItems();
}