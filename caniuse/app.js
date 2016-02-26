var page = tabris.create("Page", {
  title: "JavaScript Enviroment Tests",
  topLevel: true
});
tabris.create("Button", {
  text: "Run Tests natively",
  layoutData: {
    centerX: 0,
    top: 100
  }
}).on("select", function(widget) {
  page.set("enabled", false);    
  require("./src/tests");
}).appendTo(page);
tabris.create("Button", {
  text: "Run Tests on babel",
  layoutData: {
    centerX: 0,
    top: "prev() 10"
  }
}).on("select", function(widget) {
  page.set("enabled", false);    
  require("./lib/tests");
}).appendTo(page);

page.open();    
