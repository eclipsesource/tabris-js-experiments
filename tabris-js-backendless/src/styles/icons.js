import { device } from 'tabris';
const platform = device.get("platform").toLowerCase();

export function getIconSrc(name, size) {
  size = size || Math.min(Math.floor( device.get("scaleFactor") ) , 2);
  var uri = getIcon(name,size);
  return {src: uri, scale: size * 2}
};

function getIcon(name, size) {
  var path = 'images/icons/' + platform + '/';
  size = size || Math.floor( device.get("scaleFactor") );
  //console.log(path + name + '@' + size + 'x.png');
  return path + name + '@' + size + 'x.png';
};
