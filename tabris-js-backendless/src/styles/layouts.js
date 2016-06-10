import {device} from 'tabris';
export const FULL = {left: 0, top: 0, right: 0, bottom: 0};
export const CENTER = {centerX:0,centerY:0};
export const HIDE = {opacity:0};
export const SHOW = {opacity:1};
export const MARGIN = 10;
export const PADDED = {left: MARGIN, top: MARGIN, right: MARGIN, bottom: MARGIN};

export const TABBAR_LOCATION = device.get('platform') === 'iOS' ? 'bottom' : 'top';

export const COLUMN_COUNT = Math.max( Math.floor(device.get('screenWidth') / 300) , 1);
