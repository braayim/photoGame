import { isDevMode } from '@angular/core';
import { Storage } from '@ionic/storage';

//console log if app is in a development environment
export function logDev(text) {
  if(isDevMode){
    console.log(text);
  }
}
