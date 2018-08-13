export class Image{
  table_name:string;
  columns:Array<any>;

  constructor(){
    this.table_name = 'images';
    this.columns = [
      {'name':'image_id', 'type':'INTEGER'},
      {'name':'base64Image', 'type':'TEXT'},
    ]
  }

  getColumns(){
    return this.columns;
  }

  getTableName(){
    return this.table_name;
  }
}
