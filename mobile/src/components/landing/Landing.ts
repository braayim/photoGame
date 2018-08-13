import {Component} from "@angular/core";
import {DbService} from "../../services/DbService";
import {Menu} from "../menu/Menu";
import {NavController, Platform} from "ionic-angular";
import {logDev} from "../../helpers/utilHelper";
import {Login} from "./Login";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

@Component({
  templateUrl: "./landing_template.html",
})

export class Landing{

  constructor(public dbService:DbService, public statusBar: StatusBar,
              public splashScreen: SplashScreen, private navCtrl: NavController,
              public platform:Platform) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Initialise our database
      this.dbService.initDb((res)=>this.chooseNextScreen());
    });
  }

  chooseNextScreen() {
      let user = this.dbService.userData;
      if(user && user.username){
        this.navCtrl.setRoot(Menu, {});
      } else {
        this.navCtrl.setRoot(Login, {});
      }
  }

}
