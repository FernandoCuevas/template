'use strict';
class  TableMetadata{
    constructor (table,primaryKey="id", createModel){
        this.table  = table;
        this.primaryKey = primaryKey;
        this.properties = {};
        this.columns  = {};
        this.finalProperties = {};
        this.createModel = createModel;
    }
    
    property(name,column,isFinal){
        this.properties[name] = column;
        this.columns[column] = name;
        this.finalProperties[name] = isFinal;
    }
    
}

module.exports = TableMetadata;