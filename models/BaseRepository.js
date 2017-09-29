'use strict';

const config = require('../config');
const logger = require('log4js').getLogger('global');
const uuid = require('node-uuid');

const knex = require('knex')({
    client: 'pg',
    connection: config.database.conn_string,
    searchPath: 'public',
    debug: false,
    pool: {
        min: 5,
        max: 50
    }
});

let BaseRepository = function (metadata) {
    let self = this;

    let { table, primaryKey} = metadata;

    let toObject = function (row) {
        let result = {};
        Object.keys(metadata.columns).forEach(function (key) {
            result[metadata.columns[key]] = row[key];
        });

        return new metadata.createModel(result);
    };

    let toRow = function (object) {
        let result = {};
        Object.keys(metadata.properties).forEach(function (key) {
            if (object[key] !== undefined) {
                result[metadata.properties[key]] = object[key];
            }
        });
        return result;
    }

    self.list = function (limit) {
        let query = knex.select().table(table);
        if (limit) {
            query = query.limit(limit);
        }
        return query.map(toObject);
    }

    self.getByProperty = function (property, value) {
        let filter = {};
        filter[metadata.properties[property]] = value;
        return knex.select().table(table).where(filter).map(toObject);
    };

    self.get = (id) => self.getByProperty(primaryKey, id);

    self.del = (id) => knex(table).where(primaryKey, id).del();

    self.create = function (object) {
        let row = toRow(object);
        row[primaryKey] = uuid.v4().replace(/-/g,'').substr(0,17); //use the first 18 characters of a v4 uuid
        return knex(table).returning(primaryKey).insert(row);
    };

    self.update = function (object) {
        let row = toRow(object);
        //remove final properties.
        Object.keys(row).forEach(function (key) {
            if (metadata.finalProperties[metadata.columns[key]]) {
                delete row[key];
            }
        });

        if (Object.keys(row).length === 0) {
            //ignore request
            return new Promise((resolve, reject) => resolve(0));
        }
        return knex(table).where(primaryKey, object[primaryKey]).update(row);
    };

    self.query = (query, values = []) => knex(table).whereRaw(query, values).map(toObject);

}


module.exports = BaseRepository;