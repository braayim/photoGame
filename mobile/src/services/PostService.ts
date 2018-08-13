import {Injectable} from "@angular/core";
import {HTTP} from "@ionic-native/http";
import * as config from "../configs/Config";
import {logDev} from "../helpers/utilHelper";


@Injectable()
export class PostService {
  server_url: string;
  timeout: number;

  constructor(private http: HTTP) {
    this.server_url = config.SERVER_URL;
    this.timeout = +config.DEFAULT_CONNECTION_TIMEOUT;
  }

  /**
   * Makes a request to the remote server and returns a promise which handled by the
   * success or failure callback
   * @param req as request body, success callback, failure callback
   */
  makePostRequest(req, success=null, failure=null){
    this.http.post(this.server_url, req, {"Content-Type":"application/json"})
      .then(data => {
        // data received by server
        const res = JSON.parse(data.data);
        if(success) success(res) // calls the success callback

      })
      .catch(error => {
        logDev(error.status);
        logDev(error.error); // error message as string
        if(failure) failure(error.error) // calls the failure callback

      });
  }

}
