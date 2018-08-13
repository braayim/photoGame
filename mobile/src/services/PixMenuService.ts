import {Injectable} from "@angular/core";
import {DbService} from "./DbService";
import {PostService} from "./PostService";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {logDev, newRequestWrapper} from "../helpers/utilHelper";


/***
 * This serves the menu.
 * 1. It gets photos from the database and updates the menu
 * 2. It then gets images from the remote server and updates both db and the menu
 * 3. If the user leaves the menu, that menu gets  unsubscribed from the service.
 */
@Injectable()
export class PixMenuService{
  public localStorage:any=[];

  constructor(private dbService:DbService,private postService: PostService){
  }

  /***
   * This observable keeps on updating the menu on the on going changes from both
   * the remote server and the database
   */
  get myObservable(){
    return new Observable((observer) => {
      this.getItemsFromDb(observer);
      this.updateItemsFromServer(observer);

    });
  }

  /***
   * This only picks data from server and updates the menu
   */
  get remoteContent(){
    return new Observable((observer) => {
      this.updateItemsFromServer(observer);
    });
  }

  /**
   * Gets picture_details from the database and sends the resulting data to the subscribing
   * menu. This has to be followed by a function that calls images
   * @param observer
   */
  getItemsFromDb(observer){
    let self = this;
    this.dbService.getStoragedata("PIX_MENU",
      (data)=>{
        self.localStorage = data;
        observer.next({status:200});
        self.getImagesFromDb(observer);
      });
  }

  /**
   * Gets records from the remote server and updates it to in-app database
   * @param observer
   */
  updateItemsFromServer(observer){
    let self = this;
    const req = {
      ...newRequestWrapper(this),
      "action":"GET_PICTURES",
    };
    this.postService.makePostRequest(req, (result)=>{
      // logDev(JSON.stringify(result));
      self.dbService.setStoragedata("PIX_MENU",result,
        (response)=>{
          self.localStorage = result;
          observer.next({status:200});
          this.addMissingImagesFromServer(observer);
        });
    });
  }

  /***
   * It checks localStorage for picture details that don't have an image
   * Fetches each item in the scope an image as it send it to the subscribers (aka menu)
   * @param observer
   */
  addMissingImagesFromServer(observer){
    let self = this;
    const req = {
      ...newRequestWrapper(this),
      "action":"FETCH_IMAGES",
    };

    const len = this.localStorage.length;
    for(var i=0; i<len; i++){
      const index = i;
      const data = this.localStorage[i];
        req['id'] = +data.id;
        if(!data.base64Image){
          this.postService.makePostRequest(req, (image)=>{
            if(image && image.base64Image){

              observer.next({status:300, data:{index, 'id':data.id, image:image.base64Image}});
              self.dbService.setStoragedata("IMAGE_"+data.id, image);
            }
          });
        }
    }
  }

  /***
   * User to get images from storage and result is sent to the subscriber (aka menu)
   * @param observer
   */
  getImagesFromDb(observer){
    const len = this.localStorage.length;
    for(let i=0; i<len; i++){
      const data = this.localStorage[i];
      this.dbService.getStoragedata("IMAGE_"+data.id,
        (image)=>{
          observer.next({status:300, data:{index:i, 'id':data.id, image:image.base64Image}});
        });
    }
  }

}

