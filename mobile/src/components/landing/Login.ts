import {Component, OnInit} from "@angular/core";
import {DbService} from "../../services/DbService";
import {PostService} from "../../services/PostService";
import {Menu} from "../menu/Menu";
import {NavController} from "ionic-angular";
import {RegisterUser} from "./RegisterUser";
import {logDev, newRequestWrapper} from "../../helpers/utilHelper";

@Component({
  templateUrl: "./login_template.html",
})

export class Login{
  username: string;
  email: string;
  hasError:boolean;
  formError:string = "";

  constructor(private postService:PostService, public dbService:DbService,
              private navCtrl: NavController) {
    this.hasError =false;
  }


  login() {
      //Pin should not be empty
      if (!this.username) {
        this.hasError = true;
        this.formError = "Please provide your username and email ";
        return;
      }

      // Make a request wrapper
      let requestWrapper = newRequestWrapper(this);
      requestWrapper['action'] = "LOGIN";
      requestWrapper['username'] = this.username;
      this.postService.makePostRequest(requestWrapper, (data)=>{
        this.dbService.setUserdata(data);
        this.navCtrl.push(Menu, {});
      });
    }

    signup(){
      this.navCtrl.push(RegisterUser, {});
    }


}
