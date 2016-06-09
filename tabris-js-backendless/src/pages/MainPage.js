/**
 * The main page of the application.
 */
import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';

import uploadTab from './../tabs/upload';
import {FULL} from './../styles/layouts';

export default class extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Backendless Connector'
    });

    this.append(
      new TabFolder(FULL).append(
        new Tab({title: `Feed`}).append(
          new TextView({text:'Tab 1'})
        ),
        new uploadTab(),
        new Tab({title: `User`}).append(
          new TextView({text:'Tab 3'})
        )
      )
    );

  }

}
