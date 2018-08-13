import {Component, OnInit} from "@angular/core";
import {PixMenuService} from "../../services/PixMenuService";
import {NavController, NavParams} from 'ionic-angular';
import {imagePlacehoder} from "../../configs/Statics";
import {PhotoDetails} from "./PhotoDetails";
import {CapturePhotoContent} from "../photos/CapturePhotoContent";
import {logDev} from "../../helpers/utilHelper";

@Component({
  selector: 'main',
  templateUrl: 'menu.html'
})
export class Menu{
  menuItems:any=[];
  img_placeholder:any;

  /***
   * This menu subscribes to the pixMenuService on initializing
   * @param menuService
   * @param navCtrl
   */
  constructor(private menuService:PixMenuService,
              public navCtrl: NavController){
    this.img_placeholder =imagePlacehoder;
    this.menuService.myObservable.subscribe((data)=>{
      this.menuProcessing(data);
    });

  }


  /***
   * This processes changes on the menu as they come pixMenuService
   * @param data
   */
  menuProcessing(data){
    switch(data.status) {
      case 200:
        this.menuItems = this.menuService.localStorage;
        break;
      case 300:
        this.showImage(data);
        break;
      default:
        logDev(data.status);
    }
  }

  /***
   * Updates the view page with images one at time
   * @param data
   */
  showImage(data){
    const img = data.data;
    this.menuItems[img.index]['base64Image'] = img.image;
  }

  /**
   * It navigates to the view page of the tapped picture
   * @param event
   * @param item
   */
  itemTapped(item) {
    this.navCtrl.push(PhotoDetails, {
      item: item
    });
  }

  /**
   * It renders page for capturing new photo details
   */
  takeNewPhoto() {
    logDev("Going to take new photo");
      this.navCtrl.push(CapturePhotoContent, {});
  }

  /***
   * This refreshes the menu by subscribing to remoteContent observable
   * @param refresher
   */
  doRefresh(refresher){
    this.menuService.remoteContent.subscribe((data)=>{
      refresher.complete();
      this.menuProcessing(data);
    });
  }

}
