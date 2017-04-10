var platforms = ["Android", "iOS", "windows"];

Promise.all(platforms.map(platform => getData(platform))).then(rawData => {
  var tableData = createTableData(rawData);
  printSupportedSyntax(tableData.Syntax);
  delete tableData.Syntax;
  console.log('# Supported JavaScript API');
  printSupportedAPI(tableData);
});

function getData(platform) {
  return require('./' + platform);
}

function createTableData(rawData) {
  var tableData = {};
  platforms.forEach((platform, index) => {
    var platformData = rawData[index];
    for (var category in platformData) {
      tableData[category] = tableData[category] ? tableData[category] : {};
      mergeCategory(tableData[category], platformData[category], platform);
    }
  });
  return tableData;
}

function mergeCategory(target, source, platform) {
  for (var feature in source) {
    target[feature] = target[feature] ? target[feature] : {};
    target[feature][platform] = source[feature];
  }
}

function printSupportedSyntax(data) {
  console.log('# Supported ES6 Syntax');
  console.log('');
  for (var feature in data) {
    if (isAllTrue(data[feature])) {
      console.log(' * ' + feature);
    }
  }
  console.log('');
}

function printSupportedAPI(data) {
  for (var objName in data) {
    let objData = data[objName];
    for (var field in objData) {
      let type = areAllEqual(objData[field]);
      if (type) {
        console.log(' * `' + objName + '.' + field + '`: `' + type + '`');
      }
    }
  }
}


function areAllEqual(obj) {
  let match = false;
  for (var key in obj) {
    if (match === false) {
      match = obj[key];
    }
    if (match !== obj[key]) {
      return false;
    }
  }
  return match;
}

function isAllTrue(obj) {
  for (var key in obj) {
    if (obj[key] !== true) {
      return false;
    }
  }
  return true;
}
