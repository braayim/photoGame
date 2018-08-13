//create a table
import {logDev} from "./utilHelper";

/***
 * Creates tables using the model provided
 * @param scope : scope of the caller
 * @param model : table definition
 */
export function getCreateTable(scope, model:any){
  let columns = model.getColumns();
  let table_name = model.getTableName();

  //Create the sql string for create a table
  let sql:string = "CREATE TABLE IF NOT EXISTS "+table_name+" (";

  columns.filter(function(col){
    sql += col.name+" "+col.type+", ";
  });
  sql = sql.slice(0, -2);
  sql += ")";
  logDev("Created sql string: "+sql);

  //Execute the the sql string in
  scope.gameDb.executeSql(sql, {})
    .then((res) => console.log(table_name+" table successfully created"))
    .catch(e => console.log(JSON.stringify(e)));
}


/***
 * Saves new record in the table using the model properties
 * @param scope : scope of the caller
 * @param model : model represents the database table
 * @param values : values to be saved
 * @param process : success callback
 */
export function setRecord(scope, model:any, values:any, process) {
  logDev("INSIDE SET RECORD");
  let columns = model.getColumns();
  let table_name = model.getTableName();
  let sql:string = "INSERT INTO "+table_name+" (";
  let placeholders = "VALUES (";
  let val:Array<any> =[];
  // Building sql statement
  columns.filter(function(col){
    sql += col.name+", ";
    let fieldVal = values[col.name];
    if(typeof fieldVal == 'string' || fieldVal instanceof String)
        fieldVal =fieldVal.trim();

    val.push(fieldVal);
    placeholders +="?, ";
  });
  sql = sql.slice(0, -2); placeholders = placeholders.slice(0, -2);
  sql += ") "; placeholders += ") ";
  sql += placeholders;
  logDev("SAVE SQL: "+sql+" "+JSON.stringify(val));

  scope.gameDb.executeSql(sql, [val]).then(id => {
    logDev("record: "+id+" inserted into table "+table_name);
    if(process) process(id);
  }, error => {
    logDev("DB SAVE RECORD: "+JSON.stringify(error));
  });
}


/***
 * Edits a give record using the model
 * @param scope : scope of the call
 * @param model : model represents the database
 * @param values : values to update the record with
 * @param whereParams : search params
 * @param process : success callback
 */
export function editRecord(scope, model:any, values:any, whereParams:any, process) {
  logDev("INSIDE EDIT RECORD");
  let columns = model.getColumns();
  let table_name = model.getTableName();
  let sql:string = "UPDATE "+table_name+" SET ";
  let whereClause = " WHERE ";
  let vals:Array<any> =[];
  // Building sql statement
  columns.filter(function(col){
    sql += col.name+"=?, ";
    let fieldVal = values[col.name]
    if(typeof fieldVal == 'string' || fieldVal instanceof String)
      fieldVal =fieldVal.trim();
    vals.push(fieldVal);
  });
  for (let k in whereParams){
    if (whereParams.hasOwnProperty(k)) whereClause += k+"='"+whereParams[k]+"'";
  }
  sql = sql.slice(0, -2);
  sql += whereClause;
  logDev("SQL AND VALS: "+sql+" "+vals);
  scope.gameDb.executeSql(sql, [vals]).then(res => {
    logDev("edit record: "+res);
    if(process) process(res);
  }, error => {
    logDev("DB EDIT RECORD: "+JSON.stringify(error));
  });
}

/***
 * Gets a record from the database
 * @param scope : scope of the caller
 * @param model : model that represents the table being called
 * @param vals  : key:val array to be used in the where clause
 * @param proccessor : call back for a successful return record
 */
export function getRecord(scope, model:any, vals:any, proccessor){
  logDev("INSIDE GET RECORD");
  let table_name = model.getTableName();

  if(vals){
    let whereClause = "select * from "+table_name+" where ";
    for (let k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"='"+vals[k]+"'";
    }
    whereClause +=" LIMIT 1";
    logDev("RECORD: "+whereClause);
    scope.gameDb.executeSql(whereClause, {}).then(row => {
      if(proccessor) proccessor(row)
    }, error => {
      logDev("DB GET RECORD: "+JSON.stringify(error));
    });
  }
}

/***
 * Get all records from the table represented by the model
 * @param scope
 * @param model
 * @param vals : obj of key:values used to build  a whereClause
 * @param proccessor : success callback
 * @param options
 */
export function getAllRecords(scope, model:any, vals:any, proccessor, options:any={}){
  let table_name = model.getTableName();
  let whereClause = "SELECT * FROM "+table_name;
  if(vals) {
    whereClause += " where ";
    for (let k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"="+vals[k];
    }
  }
  if(options){
    whereClause += options.orderBy ? ' '+options.orderBy : '';
  }

  logDev("GET ALL RECORDS: "+whereClause);
  scope.gameDb.executeSql(whereClause, []).then(resultSet => {
    logDev(JSON.stringify(resultSet));
    // if(proccessor) proccessor(resultSet);
  }, error => {
    logDev( JSON.stringify(error));
  });
}


export function deleteRecordArray(scope, model:any, vals:any, proccessor){
  let table_name = model.getTableName();
  let whereClause = "delete from "+table_name;
  if(vals) {
    whereClause += " where ";
    for (let k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"="+vals[k];
    }
  }

  logDev(JSON.stringify(whereClause));
  scope.gameDb.executeSql(whereClause).then(resultSet => {
    if(proccessor !=null) proccessor(resultSet);
  }, error => {
    console.log("return records err", error);
  });
}

export function deleteRecord(scope, model:any, vals:any, proccessor){
  let table_name = model.getTableName();

  if(vals){
    let whereClause = "delete from "+table_name+" where ";
    for (let k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"='"+vals[k]+"'";
    }
    logDev(JSON.stringify(whereClause));
    scope.gameDb.executeSql(whereClause).then(result => {
      if(proccessor) proccessor(result)
    }, error => {
      console.log("return record err", error);
    });
  }
}
