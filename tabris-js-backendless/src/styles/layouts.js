import {device} from 'tabris';
export const FULL = {left: 0, top: 0, right: 0, bottom: 0};
export const TABBAR_LOCATION = device.get('platform') === 'iOS' ? 'bottom' : 'top';

export const COLUMN_COUNT = Math.max( Math.floor(device.get('screenWidth') / 400) , 1);
