/**
 * The main page of the application.
 */
import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';

import uploadTab from './../tabs/upload';
import feedTab from './../tabs/feed';

import {FULL, TABBAR_LOCATION} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION , NAVIGATION_COLORS} from './../styles/colors';

export default class extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Backendless Connector',
      background:BACKGROUND
    });
    ui.set(NAVIGATION_COLORS);
    this.append(
      new TabFolder({
        ...FULL, paging:true,
        background: NAVIGATION,
        textColor: WHITE,
        elevation: 8,
        tabBarLocation: TABBAR_LOCATION
      }).append(
        new feedTab(),
        new uploadTab(),
        new Tab({title: `Profile`}).append(
            new TextView({text:'Tab 3'})
          )
        )
    );

  }

}
