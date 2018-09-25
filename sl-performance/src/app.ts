import {ui, TextView} from 'tabris';
import {MyView00} from './pack00';
import './pack01';
import './pack02';
import './pack03';
import './pack04';
import './pack05';
import './pack06';
import './pack07';
import './pack08';
import './pack09';

declare const bootStart: number;
declare const bootEnd: number;
declare const tabrisStart: number;
declare const tabrisEnd: number;
declare const cordovaStart: number;
declare const cordovaEnd: number;
declare const appStart: number;
declare const appEnd: number;

const view = new MyView00();
view.onResize(() => {
  const txt = new TextView({layoutData: {right: 0}, background: 'black', textColor: 'white', font: '24px monospace'});
  txt.text = `
    bootjs: ${bootEnd - bootStart}
    tabris: ${tabrisEnd - tabrisStart}
    cordova: ${cordovaEnd - cordovaStart}
    app: ${appEnd - appStart}
    render: ${Date.now() - appEnd}
    -------------
    total: ${Date.now() - bootStart}
                      `;
  ui.contentView.append(txt);
});
ui.contentView.append(view);
