import {Component} from "@angular/core";
import {DbService} from "../../services/DbService";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {logDev, newRequestWrapper} from "../../helpers/utilHelper";
import {imagePlacehoder} from "../../configs/Statics";
import {PostService} from "../../services/PostService";
import {NavController, ToastController} from "ionic-angular";
import {PhotoDetails} from "../menu/PhotoDetails";
import {PixMenuService} from "../../services/PixMenuService";

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

  constructor(private dbService:DbService, private camera: Camera,
              private postService:PostService, public navCtrl: NavController,
              private toastCtrl: ToastController, private menuService:PixMenuService){
    this.dummyPhoto = imagePlacehoder;
  }

  /***
   * Takes photo from the phone camera.
   * The quality for the image is grossly reduced to avoid rendering issues
   * because thumbnails are not implemented
   * It returns a base64Image
   */
  takePhoto(){
    const options: CameraOptions = {
      quality:45,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth:350,
      targetHeight:350
    };

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

  /***
   * Submit picture
   * Makes a toast while a success response comes back from server and navigates
   * view details.
   * Makes a failed toast on fail and pops back to
   */
  submitData() {
    let self = this;
    // Make a request wrapper
    const initreq = newRequestWrapper(this);
    const req = {
      ...initreq,
      action: "SAVE_PICTURE",
      category: this.category,
      owner: +initreq['user_id'],
      description: this.description,
      base64Image: this.base64Image,
      location: this.location,
      title: this.title
    };

    this.postService.makePostRequest(req, (data)=>{
      self.showToast("Picture has been successfully uploaded to the server");
      setTimeout(function () {
        let item = data;
        item['image'] = self.base64Image;
        self.navCtrl.push(PhotoDetails,{item});
      }, 2500);
    }, (error)=>{
      self.showToast("An Error occurred while uploading your photo");
      setTimeout(function () {
        self.navCtrl.pop();
      }, 2500);
    })
  }

  /***
   * Function for showing toast. It's used by the submitData function
   * @param message
   */
  showToast(message) {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 2000,
      position: 'bottom',
      showCloseButton:true
    });


    toast.present();
  }


}
