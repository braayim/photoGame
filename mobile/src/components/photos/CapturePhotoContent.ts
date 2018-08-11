import {Component} from "@angular/core";
import {DbService} from "../../services/DbService";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {logDev} from "../../helpers/utilHelper";
import {imagePlacehoder} from "../../configs/Statics";

@Component({
  templateUrl: 'takephoto_form.html'
})
export class CapturePhotoContent{
  category:string;
  owner:number;
  description:string;
  base64Image:string;
  location:string;
  title:string;
  dummyPhoto:string;

  constructor(private dbservice:DbService, private camera: Camera){
    const userData= this.dbservice.getUserdata()
    this.owner = userData ? +userData['id'] : null;
    this.dummyPhoto = imagePlacehoder;
  }

  takePhoto(){
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      logDev("PHOTO TAKEN: "+imageData);
      this.base64Image =imageData;

      //This should be cropped to a thumbnail
      this.dummyPhoto =imageData;
    }, (err) => {
      // Handle error
    });
  }


}
