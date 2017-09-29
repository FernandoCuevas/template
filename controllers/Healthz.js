'use strict';
let routes = [];
const basePath = '/healthz';

const config = require('../config');
const User = require('../models/User');
const logger = require('log4js').getLogger('global');
const service_name = 'template';

routes.push({
    method: 'GET',
    path: basePath,
    handler: (request, reply) => {
        User.getRepository().list(1).then(() => {
            let response = {
                status: true,
                service_name,
                details: {
                    api: 'OK',
                    database: 'OK'
                }
            }
            return reply(response);
        }).catch(err => {
            let response = {
                status: false,
                service_name,
                details: {
                    api: 'OK',
                    database: 'ERROR'
                }
            }
            logger.error(err);
            return reply(response).code(500);
        });
    }
});


module.exports = routes;