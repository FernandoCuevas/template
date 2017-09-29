'use strict';
const BaseRepository = require('./BaseRepository');

class BaseModel {

    static isValid(object, constraints) {
        let trueOrError = (pass, message, value) => {
            if (!pass) {
                throw new Error(message);
            }
        }
        constraints.forEach(c => trueOrError(c.test(object), c.message, object));
    }

    static createRepository(tableMetadata) {
        return new BaseRepository(tableMetadata);
    }

    static deepAssign(target, object) {
        if (!object) {
            return;
        }
        JSON.stringify(object);//lazy way to detect circular references. Will throw a TypeError exception if it detects any.
        Object.keys(object).forEach(k => {
            if (!Array.isArray(target[k]) && typeof target[k] === "object") {
                this.deepAssign(target[k], object[k]);   //deep copy
            } else {
                target[k] = object[k];  //just replace value
            }
        });
    }

}

module.exports = BaseModel;
