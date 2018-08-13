import {Injectable} from "@angular/core";
import * as config from "../configs/Config";
import * as dbhelper from "../helpers/databaseHelper";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {UserData} from "../models/UserData";
import { Storage } from '@ionic/storage';
import {logDev} from "../helpers/utilHelper";
import {Image} from "../models/Image";
import {PictureDetails} from "../models/PictureDetails";

/**
 * Dbservice saves and retrieves data from the in-app database
 */
@Injectable()
export class DbService{
  gameDb:any;
  db_name:string = config.DB_NAME;
  picture_details:PictureDetails;
  image:Image;
  userData:any = {};
  localStorage:any= {};

  constructor(private sqlite: SQLite, private storage: Storage) {
    this.picture_details = new PictureDetails();
    this.image = new Image();
  }

  /**
   * Creates database if does not exist
   * This should be called on platform ready
   */
  initDb(process=null){
    let self = this;
    // Create database tables for the above defined models
    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {
      self.gameDb = db;
      //Logic for handling the creation of tables is in dbhelper
      dbhelper.getCreateTable(self, self.picture_details);
      dbhelper.getCreateTable(self, self.image);

      //Gets the user provider from the local storage
      self.getUserdata((res)=>{
        if(process) process(res);
      });
    }).catch(e => console.log(e));

  }

  testUserData(){
    logDev("test user data: "+JSON.stringify(this.userData))
  }

  /***
   * Gets stored userdata on platform ready and stores it in the provider
   */
  getUserdata(proccess=null){
    let self = this;
    this.storage.get("USER_DATA").then((val)=>{
      self.userData = JSON.parse(val);
      if(proccess) proccess(self.userData);
    })
      .catch((e)=>logDev(JSON.stringify(e)));
  }

  /***
   * Sets userdata to the local storage and makes it available to the provider
   * @param userdata
   */
  setUserdata(userdata: UserData) {
    let self = this;
    this.storage.set("USER_DATA", JSON.stringify(userdata)).then((val) => {
      self.userData = JSON.parse(val);
    }).catch((e) => {
      logDev(e)
    });
  }


  /***
   * This takes in an array of model objects.
   * For each object, it checks if it already exists in the table using the paramId
   * If the record exist, it's updated withe the new values otherwise a new record is
   * created.
   * @param model
   * @param values
   * @param paramId
   * @param proccess
   * @param options
   */
  getSaveRecords(model, values, paramId, proccess, options:any={}){
      let self = this;
      let size = values.length;
      let new_records = [];
      values.filter((data)=>{
        let findValue:any = {};
        findValue[paramId]=data[paramId];
        dbhelper.getRecord(self, model, findValue, res=>{ //find record from db

          // logDev(JSON.stringify(res));
          if(res.rows.length >0){ //if exists update
            dbhelper.editRecord(self, model, data, findValue, id=>{
              size = size -1;
              if(size == 0) proccess(new_records);
            });
          } else{     //set record if does not exist
            dbhelper.setRecord(self, model, data, id=>{
              size = size -1;
              new_records.push(data);
              if(size == 0) proccess(new_records);
            });
          }
        });
      });
  }

  setRecord(model, val, proccess){
      let self = this;
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
      dbhelper.getAllRecords(this, model, values, res=>{
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

  /***
   * Users Storage to store any thing
   * @param key
   * @param data
   * @param process
   */
  setStoragedata(key, data, process=null) {
    let self = this;
    this.storage.set(key, data).then((val) => {
      if(process) process(val)
    }).catch((e) => {
      logDev(e)
    });
  }

  /***
   * Gets stored data from Ionic storage using key
   * @param key
   * @param process
   */
  getStoragedata(key, process=null) {
    let self = this;
    this.storage.get(key).then((val) => {
      if(process) process(val)
    }).catch((e) => {
      logDev(e)
    });
  }

  /***
   * Removes stored data from storage
   * @param key : key identifier of the data
   * @param process : success callback
   */
  removeStoragedata(key, process=null) {
    let self = this;
    this.storage.remove(key).then((val) => {
      if(process) process(val)
    }).catch((e) => {
      logDev(e)
    });
  }


}
