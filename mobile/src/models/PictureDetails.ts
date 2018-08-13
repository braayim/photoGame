export class PictureDetails{
  table_name:string;
  columns:Array<any>;

  constructor(){
    this.table_name = 'picture_details';
    this.columns = [
      {'name':'id', 'type':'TEXT PRIMARY KEY'},
      {'name':'owner', 'type':'TEXT'},
      {'name':'username', 'type':'TEXT'},
      {'name':'title', 'type':'TEXT'},
      {'name':'description', 'type':'TEXT'},
      {'name':'location', 'type':'TEXT'},
      {'name':'up_votes_account', 'type':'TEXT'},
      {'name':'down_votes_account', 'type':'TEXT'},
      {'name':'category', 'type':'TEXT'},
      {'name':'date_created', 'type':'TEXT'},
    ]
  }

  getColumns(){
    return this.columns;
  }

  getTableName(){
    return this.table_name;
  }
}
