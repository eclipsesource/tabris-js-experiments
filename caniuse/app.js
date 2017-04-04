new tabris.Button({
  text: "Run Tests natively",
  layoutData: {
    centerX: 0,
    top: 100
  }
}).on("select", function(event) {
  event.target.enabled = false
  require("./src/tests").runTests(showResults);
}).appendTo(tabris.ui.contentView);
new tabris.Button({
  text: "Run Tests on babel",
  layoutData: {
    centerX: 0,
    top: "prev() 10"
  }
}).on("select", function(event) {
  event.target.enabled = false
  require("./lib/tests").runTests(showResults);
}).appendTo(tabris.ui.contentView);

function showResults(results) {
  console.log(JSON.stringify(results));
  var webview = new tabris.WebView({
    left: 0, right: 0, top: 0, bottom: 0,
    html: createHtml(results)
  }).appendTo(tabris.ui.contentView);
}

function createHtml(results) {
  var html = [
    '<html>',
    '<style>',
    '* { font-family: sans-serif }',
    '.ok { color: #00cc00 }',
    '.error { color: #cc0000 }',
    '</style>'
  ];
  // language features
  html.push('<h2>Language features</h2>');
  html.push('<ul>');
  var features = results['Syntax'];
  var keys = Object.keys(features).sort();
  keys.forEach(function(name) {
    var result = features[name];
    var cls = result === true ? 'ok' : 'error';
    html.push('<li class="' + cls + '">' + name + ': ' + JSON.stringify(result) + '</li>');
  });
  html.push('</ul>');
  html.push('</html>');
  return html.join('\n');
}
