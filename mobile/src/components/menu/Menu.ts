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
export class Menu implements OnInit{
  menuItems:any;

  constructor(private menuService:PixMenuService,
              public navCtrl: NavController, public navParams: NavParams){}

  ngOnInit() {
    this.menuItems = [
      {'title': "First image", 'image':imagePlacehoder},
      {'title': "Second image", 'image': imagePlacehoder},
      {'title': "Third image", 'image': imagePlacehoder},
      {'title': "Fourth image", 'image': imagePlacehoder},
      {'title': "Fifth image", 'image': imagePlacehoder},
      {'title': "Sixth image", 'image': imagePlacehoder},
    ];
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

}
