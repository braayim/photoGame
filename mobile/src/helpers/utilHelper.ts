import { isDevMode } from '@angular/core';
import { Storage } from '@ionic/storage';

//console log if app is in a development environment
export function logDev(text) {
  if(isDevMode){
    console.log(text);
  }
}

export function newRequestWrapper(scope) {
  let request = {};
  const userdata = scope.dbService.userData;
  if(userdata && userdata.id) request['user_id'] = userdata.id;
  return request;
}
