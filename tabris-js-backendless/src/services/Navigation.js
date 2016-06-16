let NavigationElements = {};

export function setPageTitle(newTitle){
  NavigationElements.MainPage.set({title:newTitle});
}

export function registerNavigation(newElements){
  NavigationElements = {
	...newElements
  };
  NavigationElements.Navigation.on("change:selection", (widget, tab) => {
      console.log(`CHANGE TAB: ${tab.get('title')}`);
      setPageTitle(tab.get('description'));
  });
}

export function backToFeed(){
  NavigationElements.Navigation.set("selection", NavigationElements.FeedTab);
  NavigationElements.FeedTab.refreshItems();
}
