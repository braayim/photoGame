import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {SQLite} from "@ionic-native/sqlite";
import {Toast} from "@ionic-native/toast";
import { Camera } from '@ionic-native/camera';
import {Landing} from "../components/landing/Landing";
import {DbService} from "../services/DbService";
import {PostService} from "../services/PostService";
import {IonicStorageModule} from "@ionic/storage";
import {HTTP} from "@ionic-native/http";
import {Menu} from "../components/menu/Menu";
import {PixMenuService} from "../services/PixMenuService";
import {PhotoDetails} from "../components/menu/PhotoDetails";
import {CapturePhotoContent} from "../components/photos/CapturePhotoContent";

@NgModule({
  declarations: [
    MyApp,
    Landing,
    PhotoDetails,
    Menu,
    CapturePhotoContent,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Landing,
    Menu,
    PhotoDetails,
    CapturePhotoContent,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DbService,
    PostService,
    PixMenuService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    HTTP,
    Camera
  ]
})
export class AppModule {}
