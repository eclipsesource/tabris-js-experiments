/**
 * The main page of the application.
 */
import {Page, TabFolder, Tab, ui,TextView} from 'tabris';

export default class extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Backendless Connector'
    });
    this.append(
      new TabFolder({left: 0, top: 0, right: 0, bottom: 0}).append(
        new Tab({title: 'Tab 1'}).append(
          new TextView({text:'Tab 1'})
        ),
        new Tab({title: 'Tab 2'}).append(
          new TextView({text:'Tab 2'})
        ),
        new Tab({title: 'Tab 3'}).append(
          new TextView({text:'Tab 3'})
        )
      )
    );
  }

}
