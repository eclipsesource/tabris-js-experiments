/**
 * The main page of the application.
 */
import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';

import uploadTab from './../tabs/upload';
import feedTab from './../tabs/feed';

import {FULL} from './../styles/layouts';
import {BACKGROUND} from './../styles/colors';

export default class extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Backendless Connector',
      background:BACKGROUND
    });

    this.append(
      new TabFolder({...FULL, paging:true}).append(
        new feedTab(),
        new uploadTab(),
        new Tab({title: `Profile`}).append(
          new TextView({text:'Tab 3'})
        )
      )
    );

  }

}
