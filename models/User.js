'use strict';
const BaseModel = require('./BaseModel');
const TableMetadata = require('./TableMetadata');

const tableMetadata = new TableMetadata('users');
tableMetadata.property('id', 'id', true);
tableMetadata.property('name', 'name');
tableMetadata.property('email', 'email', true);
tableMetadata.property('password', 'password');
tableMetadata.property('scope', 'scope');
tableMetadata.property('active', 'active');
tableMetadata.property('resetPasswordToken', 'resetpasswordtoken');
tableMetadata.property('resetPasswordTimestamp', 'resetpasswordtimestamp');

let User = function (props) {
    let self = this;

    Object.keys(tableMetadata.properties).forEach(function (property) {
        self[property] = props[property];
    });
}

User.getRepository = () => {
    return BaseModel.createRepository(tableMetadata);
}

User.scopes = { ADMIN:'admin', USER:'user' };

tableMetadata.createModel = User;

module.exports = User;