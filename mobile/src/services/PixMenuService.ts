import {Injectable} from "@angular/core";
import {DbService} from "./DbService";
import {PostService} from "./PostService";
import {BehaviorSubject, Observable} from "rxjs";
import "rxjs/add/operator/map";
import {logDev} from "../helpers/utilHelper";

//Defines the Picture Object

export class Picture{
  id:any;
  title: string;
  description:string;
  owner:string;
  location:string;
  base64Image:string;
}

@Injectable()
export class PixMenuService{
  private _pixItems:BehaviorSubject<Picture[]>;
  private localStorage:Array<Picture> = [];

  constructor(private dbService:DbService,private postService: PostService){
    this._pixItems = <BehaviorSubject<Picture[]>>new BehaviorSubject([]);
  }

  get pixItems(){
    return this._pixItems.asObservable();
  }

  refreshFromDb() {
    console.log("REFRESH FROM DB");
    // this.refreshing = true;
    let self =this;
    let items:Array<Picture> = [];
    self.dbService.getAllRecords(self.dbService.picture, null, results =>{
      // self.refreshing = false;
      self.localStorage = results;
      self._pixItems.next(results);
    });
  }

  ShowPicture(index){
    return this.localStorage[index];
  }

  //
  // processServerResponse(response) {
  //   // this.refreshing = false;
  //   let scope:any = this;
  //   if (response.returnCode != 0) {
  //     showError(scope, "Failed", response.returnCode + ':' + response.returnMessage, null);
  //   }
  //   else if(response.returnCode.length <=0){
  //     return;
  //   }
  //   else {
  //     //Save response object and go to details page
  //     // parse each and correct time stamp
  //     let currentMessageId = 0;
  //     let dbValues:Array<InboxMessage> =[];
  //     for (var idx in response.returnObject) {
  //       let msg = response.returnObject[idx];
  //       let message:InboxMessage = new InboxMessage();
  //       message.setMessage(msg.id, msg.sender, msg.message_text, timestampToDate(msg.time_gerenated), 0);
  //       dbValues.push(message);
  //       scope.localStorage.unshift(message);
  //       if (msg.id > currentMessageId) currentMessageId = msg.id;
  //     }
  //     scope._inbox_messages.next(scope.localStorage);
  //     let options:any = {'rtype':'obj'};
  //     if(dbValues.length >0) this.dbService.getSaveRecords(this.dbService.inbox, dbValues, 'id', null, options);
  //     if (currentMessageId > 0) {
  //       //We got atleast one message
  //       //Save last message id
  //       utils.setControlNum('LAST_MESSAGE_ID', +currentMessageId)
  //       // this.refreshFromDb()
  //     }
  //
  //   }
  // }

  errorServerProcessor = function (error) {
    // this.refreshing = false;
  }



}
