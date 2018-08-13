import {Component} from "@angular/core";
import {DbService} from "../../services/DbService";
import {PostService} from "../../services/PostService";
import {newRequestWrapper} from "../../helpers/utilHelper";
import {Menu} from "../menu/Menu";
import {NavController} from "ionic-angular";


@Component({
  templateUrl: "./register_user_template.html",
})

export class RegisterUser{
  username: string;
  email: string;
  hasError:boolean;
  formError:string = "";
  constructor(private postService:PostService, private dbService:DbService,
              private navCtrl: NavController) {
    this.hasError =false;
  }


  signup(){
    //Pin should not be empty
    if(!this.username || !this.email){
      this.hasError =true;
      this.formError = "Please provide your username and email ";
      return;
    }

    //Build request wrapper
    const req = {...newRequestWrapper(this), action:"REGISTER_USER",
                  email:this.email, username:this.username};

    //Call to server
    this.postService.makePostRequest(req, (response)=>{
      this.dbService.setUserdata(response);
      this.navCtrl.push(Menu, {});
    });
  }


}
