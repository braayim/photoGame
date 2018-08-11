export class Picture{
  table_name:string;
  columns:Array<any>;

  constructor(){
    this.table_name = 'picture';
    this.columns = [
      {'name':'id', 'type':'INTEGER'},
      {'name':'title', 'type':'VARCHAR(255)'},
      {'name':'description', 'type':'TEXT'},
      {'name':'base64Image', 'type':'TEXT'},
      {'name':'category', 'type':'INTEGER'},
      {'name':'date_created', 'type':'VARCHAR(20)'},
    ]
  }

  getColumns(){
    return this.columns;
  }

  getTableName(){
    return this.table_name;
  }
}
