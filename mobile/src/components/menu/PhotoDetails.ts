import {Component} from "@angular/core";
import {imagePlacehoder} from "../../configs/Statics";
import {NavParams} from "ionic-angular";
import {DbService} from "../../services/DbService";
import {logDev, newRequestWrapper} from "../../helpers/utilHelper";
import {PostService} from "../../services/PostService";

@Component({
  selector: 'main',
  templateUrl: 'picture_details.html'
})
export class PhotoDetails{
  item:any;
  img_placeholder:string;
  constructor(public navParam: NavParams, private dbService:DbService,
              private postService:PostService) {
    this.item = this.navParam.get('item');
    this.img_placeholder=imagePlacehoder;
    this.showPhoto();
  }

  showPhoto(){
    this.dbService.getStoragedata("IMAGE_"+this.item.id, (image)=>{
      this.item.image = image.base64Image;
    });
  }

  /***
   * Used to vote for a picture
   * It updates the up/down votes count
   * @param vote_type
   */
  vote(vote_type){
    let self = this;
    // const vote = vote_type ? 1 :0;
    const user = +this.dbService.userData.id;
    let request = new newRequestWrapper(this);
    request['action']="VOTE_PICTURE";
    request['picture_id']=+this.item.id;
    request['vote_type']=+vote_type;

    // const req ={
    //   ...newRequestWrapper(this),
    //   action:"VOTE_PICTURE",
    //   picture_id:+this.item.id,
    //   vote_type:true
    // };
    logDev(JSON.stringify(request));
    this.postService.makePostRequest(request,(result)=>{
      logDev(JSON.stringify(result));
        self.item.up_votes_account = result.up_votes_account;
        self.item.down_votes_account = result.down_votes_account;
    },
      (error)=>{logDev(JSON.stringify(error))});
  }
}
