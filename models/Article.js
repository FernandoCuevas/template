'use strict';
const BaseModel = require('./BaseModel');
const TableMetadata = require('./TableMetadata');

const tableMetadata = new TableMetadata('articles');
tableMetadata.property('id', 'id', true); //first 8 characters of a v4 uuid
tableMetadata.property('title', 'title');
tableMetadata.property('body', 'body');

const constraints = [];
constraints.push({ test: (article) => article.title, message: "title cannot be empty" });
constraints.push({ test: (article) => article.body, message: "body cannot be empty" });


let Article = function (props) {
    let self = this;
    Object.keys(tableMetadata.properties).forEach(function (property) {
        self[property] = props[property];
    });

    self.isValid = () => BaseModel.isValid(self, constraints);
}

Article.getRepository = () => {
    return BaseModel.createRepository(tableMetadata);
}
tableMetadata.createModel = Article;

module.exports = Article;