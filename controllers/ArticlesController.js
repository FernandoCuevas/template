'use strict';
let routes = [];
const Boom = require('boom');
const config = require('../config');
const BaseModel = require('../models/BaseModel');
const Article = require('../models/Article');
const logger = require('log4js').getLogger('global');
const basePath = '/articles';

//Creates a new article 
routes.push({
    method: 'POST',
    path: basePath,
    config: {
        auth: {
            strategy: 'token'
        }
    },
    handler: (request, reply) => {
        let article = new Article(request.payload);
        Article.getRepository().create(article).then(id => {
            return reply(id);
        }).catch(err => {
            logger.error(err);
            return reply(Boom.badImplementation());
        });
    }
});

//Update an article
routes.push({
    method: 'PUT',
    path: basePath + '/{id}',
    config: {
        auth: {
            strategy: 'token'
        }
    },
    handler: (request, reply) => {
        Article.getRepository().get(request.params.id).then((results) => {
            let article = results[0];
            if (!article) {
                return reply(Boom.notFound('Article not found.'));
            }
            delete request.payload.id;
            BaseModel.deepAssign(article, request.payload);
            Article.getRepository().update(article).then(reply).catch(err => {
                logger.error(err);
                return reply(Boom.badImplementation(err));
            });
        }).catch(err => {
            logger.error(err);
            return reply(Boom.badImplementation(err));
        });
    }
});

//Lists all the articles
routes.push({
    method: 'GET',
    path: basePath,
    config: {
        auth: {
            strategy: 'token'
        }
    },
    handler: (request, reply) => {
        Article.getRepository().list().then(reply).catch(err => {
            logger.error(err);
            return reply(Boom.badImplementation(err));
        });
    }
});

//GET a single article
routes.push({
    method: 'GET',
    path: basePath + '/{id}',
    config: {
        auth: {
            strategy: 'token'
        }
    },
    handler: (request, reply) => {
        Article.getRepository().get(request.params.id).then(results => {
            let article = results[0];
            if (!article) {
                return reply(Boom.notFound());
            }
            reply(article);
        }).catch(err => {
            logger.error(err);
            return reply(Boom.badImplementation(err));
        });
    }
});

//Admin ONLY
//DELETE an article
routes.push({
    method: 'DELETE',
    path: basePath + '/{id}',
    config: {
        auth: {
            strategy: 'token',
            scope: 'admin'
        }
    },
    handler: (request, reply) => {
        Article.getRepository().del(request.params.id).then(() => {
            logger.info(`Admin ${request.auth.credentials.id} deleted an article of id:${request.params.id}`);
            reply();
        }).catch(err => {
            logger.error(err);
            return reply(Boom.badImplementation(err));
        });
    }
});

module.exports = routes;