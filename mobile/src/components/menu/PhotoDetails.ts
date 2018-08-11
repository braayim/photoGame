import {Component} from "@angular/core";
import {imagePlacehoder} from "../../configs/Statics";

@Component({
  selector: 'main',
  templateUrl: 'picture_details.html'
})
export class PhotoDetails{
  item:any;
  constructor() {
    this.item = {
      'title': "First image",
      'image': imagePlacehoder,
      'description': " The most popular industrial group ever, and largely\n" +
        "      responsible for bringing the music to a mass audience."
    };
  }


}
