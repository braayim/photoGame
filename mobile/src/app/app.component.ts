import { Component, ViewChild } from '@angular/core';
import {Nav, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {DbService} from "../services/DbService";
import {Landing} from "../components/landing/Landing";
import {logDev} from "../helpers/utilHelper";
import {Menu} from "../components/menu/Menu";
import {Login} from "../components/landing/Login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Landing;

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, private dbService: DbService) {
    // used for an example of ngFor and navigation

  }

  /***
   * Logout user: deletes the user data from storage
   */
  logOut() {
    let self = this;
    this.dbService.removeStoragedata("USER_DATA", (res)=>{
      this.nav.setRoot(Login);
    });
  }
}
