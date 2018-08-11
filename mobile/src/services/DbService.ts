import {Injectable} from "@angular/core";
import * as config from "../configs/Config";
import * as dbhelper from "../helpers/databaseHelper";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Picture} from "../models/Pictures";
import {UserData} from "../models/UserData";
import { Storage } from '@ionic/storage';
import {logDev} from "../helpers/utilHelper";

/**
 * Dbservice saves and retrieves data from the in-app database
 */
@Injectable()
export class DbService{
  gameDb:any;
  db_name:string = config.DB_NAME;
  picture:Picture;

  constructor(private sqlite: SQLite, private storage: Storage) {
    this.picture = new Picture();
    this.gameDb = new SQLite();
  }


//============= SAVING USER PROFILE DATA =======================
  getUserdata(){
    this.storage.get("USER_DATA").then((val)=>{
      return val ? JSON.parse(val) : {};
    });
  }

  setUserdata(userdata: UserData){
    this.storage.set("USER_DATA", JSON.stringify(userdata)).then((val)=>{
      logDev("SET USER DATE: "+JSON.stringify(val));
    })
  }

  addUserData(key:string, value:any){
    this.storage.get("USER_DATA").then((val)=>{
      let userdata =  val ? JSON.parse(val) : {};
      userdata.push(key, value);
      this.setUserdata(userdata);
    });
  }


//======================== STORING TO THE IN-APP SQLITE DB ================
  /**
   * Creates database if does not exist
   */
  initDb(){
      var self = this;

      // Create database tables for the above defined models
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((db: SQLiteObject) => {
          dbhelper.getCreateTable(self, self.picture);
          // dbhelper.getCreateTable(self, self.user);
        })
        .catch(e => console.log(e));
  }

  // setRecordsArray(model, values, proccess){
  //
  //   dbhelper.setRecord(self, model, data, function(id){
  //     if(proccess) proccess(id)
  //   });
  // }

  // getSaveRecords(model, values, paramId, proccess, options:any={}){
  //   this.openDb(function (self, db) {
  //     if(options.rtype=='obj') { db.resultType(Sqlite.RESULTSASOBJECT);}
  //     else{ db.resultType(Sqlite.RESULTSASARRAY); }
  //     console.log("GET SAVE VALUES: "+JSON.stringify(values));
  //     values.filter(function(data){
  //       let findValue:any = {};
  //       findValue[paramId]=data[paramId];
  //       dbhelper.getRecord(self, model, findValue, res=>{ //find record from db
  //         // console.log("GET RECORDS: "+JSON.stringify(res))
  //         if(res){ //if exists update
  //           dbhelper.editRecord(self, model, data, findValue, id=>{
  //             if(proccess) proccess(id);
  //           });
  //         } else{     //set record if does not exist
  //           dbhelper.setRecord(self, model, data, id=>{
  //             if(proccess) proccess(id);
  //           });
  //         }
  //       });
  //     });
  //   })
  // }

  setRecord(model, val, proccess){
      dbhelper.setRecord(self, model, val, function(id){
        if(proccess) proccess(id)
      });
  }

  getRecord(model, values, proccess, options:any={}){
      dbhelper.getRecord(self, model, values, function(res){
        if(proccess) proccess(res)
      });
  }

  /**
   * This returns all records from a database table which is represented by the model
   * @param model
   * @param values
   * @param proccess
   * @param options
   */
  getAllRecords(model, values, proccess, options:any={}){
      dbhelper.getAllRecords(self, model, values, res=>{
        if(proccess) proccess(res)}, options);
  }

  /**
   * Deletes
   * @param model: defines the table
   * @param values: for the where clause
   * @param proccess: success callback
   */
  deleteRecordArray(model, values:any=null, proccess =null ){
      dbhelper.deleteRecordArray(self, model, values, res=>{
        if(proccess) proccess(res)});
  }

  /**
   * Deletes records satisfying the conditional values
   * @param model: defines the table
   * @param values: for the where clause
   * @param proccess: success callback
   */
  deleteRecord(model, values:any, proccess =null ){
      dbhelper.deleteRecord(self, model, values, res=>{
        if(proccess) proccess(res)});
  }

}
