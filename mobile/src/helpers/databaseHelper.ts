//create a table
import {logDev} from "./utilHelper";

export function getCreateTable(scope, model:any){
  var columns = model.getColumns();
  var table_name = model.getTableName();

  //Create the sql string for create a table
  var sql:string = "CREATE TABLE IF NOT EXISTS "+table_name+" (";

  columns.filter(function(col){
    sql += col.name+" "+col.type+", ";
  });
  sql = sql.slice(0, -2);
  sql += ")";
  logDev("Created sql string: "+sql);

  //Execute the the sql string in
  scope.gameDb.executeSql(sql, {})
    .then((res) => console.log(table_name+" table successfully created"))
    .catch(e => console.log(e));
}



export function setRecord(scope, model:any, values:any, process) {
  var columns = model.getColumns();
  var table_name = model.getTableName();
  var sql:string = "INSERT INTO "+table_name+" (";
  var placeholders = "VALUES (";
  var val:Array<any> =[];
  // Building sql statement
  columns.filter(function(col){
    sql += col.name+", ";
    val.push(values[col.name]);
    placeholders +="?, ";
  });
  sql = sql.slice(0, -2); placeholders = placeholders.slice(0, -2);
  sql += ") "; placeholders += ") ";
  sql += placeholders;
  console.log(sql+" "+JSON.stringify(val));
  scope.gameDb.executeSql(sql, val).then(id => {
    console.log("record: "+id+" inserted into table "+table_name);
    if(process) process(id);
  }, error => {
    console.log("INSERT ERROR", error);
  });
}

export function editRecord(scope, model:any, values:any, whereParams:any, process) {
  var columns = model.getColumns();
  var table_name = model.getTableName();
  var sql:string = "UPDATE "+table_name+" SET ";
  var whereClause = " WHERE ";
  var vals:Array<any> =[];
  // Building sql statement
  columns.filter(function(col){
    sql += col.name+"=?, ";
    vals.push(values[col.name]);
  });
  for (var k in whereParams){
    if (whereParams.hasOwnProperty(k)) whereClause += k+"='"+whereParams[k]+"'";
  }
  sql = sql.slice(0, -2);
  sql += whereClause;
  console.log(sql+" "+vals);
  scope.gameDb.executeSql(sql, vals).then(res => {
    console.log("edit record: "+res);
    if(process) process(res);
  }, error => {
    console.log("UPDATE ERROR", error);
  });
}

export function getRecord(scope, model:any, vals:any, proccessor){
  var table_name = model.getTableName();

  if(vals){
    var whereClause = "select * from "+table_name+" where ";
    for (var k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"='"+vals[k]+"'";
    }
    whereClause +=" LIMIT 1";
    scope.gameDb.executeSql(whereClause).then(row => {
      if(proccessor) proccessor(row)
    }, error => {
      console.log("return record err", error);
    });
  }
}

export function getAllRecords(scope, model:any, vals:any, proccessor, options:any={}){
  var table_name = model.getTableName();
  var whereClause = "select * from "+table_name;
  if(vals) {
    whereClause += " where ";
    for (var k in vals){
      if (vals.hasOwnProperty(k)) whereClause += k+"="+vals[k];
    }
  }
  if(options){
    whereClause += options.orderBy ? ' '+options.orderBy : '';
  }

  console.log(JSON.stringify(whereClause));
  scope.gameDb.executeSql(whereClause).then(resultSet => {
    if(proccessor) proccessor(resultSet);
  }, error => {
    console.log("return records err", error);
  });
}

export function deleteRecordArray(scope, model:any, vals:any, proccessor){
  var table_name = model.getTableName();
  var whereClause = "delete from "+table_name;
  if(vals) {
    whereClause += " where ";
    for (var k in vals){
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
  var table_name = model.getTableName();

  if(vals){
    var whereClause = "delete from "+table_name+" where ";
    for (var k in vals){
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
