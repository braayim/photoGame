import {Component, OnInit} from "@angular/core";
import {DbService} from "../../services/DbService";
import {PostService} from "../../services/PostService";

@Component({
  selector: "landing",
  templateUrl: "./landing.html",
})

export class Landing implements OnInit{
  userdata:any;
  username: string;
  email: string;
  hasError:boolean;
  formError:string = "";
  activated:boolean =false;
  constructor(private postService:PostService, private dbService:DbService) {
    this.hasError =false;
  }

  
  ngOnInit() {
    this.userdata = this.dbService.getUserdata();
    if(this.userdata && this.userdata.username){
      this.activated = true;
    }
  }

  login(){
    //Pin should not be empty
    if(!this.username){
      this.hasError =true;
      this.formError = "Please provide your username and email ";
      return;
    }
    //Get request wrapper
    // var requestWrapper = utils.newRequestWrapper();
    // requestWrapper['ACTION'] = "MOBILE_APP_LOGIN";
    // requestWrapper['PIN'] = this.pin;
    // let scope:any = this;
    // //Call to server
    // this.postService.makePostRequest(JSON.stringify(requestWrapper),
    //   response=>scope.processResponse(response), null)
  }


}
