/**
 * The main page of the application.
 * Bootstraps the 3 Tabs:
 * - Feed
 * - Upload
 * - Profile
 */
import {Page, TabFolder, Tab, ui} from 'tabris';
import {feedTab, uploadTab, profileTab} from './../tabs';

import {FULL, TABBAR_LOCATION} from './../styles/layouts';
import {BACKGROUND, WHITE, NAVIGATION , NAVIGATION_COLORS} from './../styles/colors';

import {registerNavigation} from './../services/Navigation';

const mainLayout = {
  page : {
    topLevel: true,
    title: 'Recent Posts Feed',
    background:BACKGROUND
  },
  navigation : {
    ...FULL,
    paging:true,
    background: NAVIGATION,
    textColor: WHITE,
    elevation: 8,
    tabBarLocation: TABBAR_LOCATION
  }
};

export default class extends Page {
  constructor() {
    super(mainLayout.page);
    ui.set(NAVIGATION_COLORS);
    let nav = {MainPage:this};
    this.append(
      nav.Navigation = new TabFolder(mainLayout.navigation).append(
        nav.FeedTab = new feedTab(),
        nav.UploadTab = new uploadTab(),
        nav.ProfileTab = new profileTab()
      )
    );
    registerNavigation(nav);
  }
}
