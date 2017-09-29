'use strict';
const Hapi = require('hapi');
const Good = require('good');
const config = require('./config');
const log4js = require('log4js');
log4js.configure('logs/log_config.json', {});
const UserRepository = require('./models/User').getRepository();
const User = require('./models/User');
const logger = log4js.getLogger('global');
const routes = require('./controllers/index');

const authStrategies = [
    {
        //standard for all endpoints, requires a token and an active user.
        name: 'token', scheme: 'jwt', config: {
            key: config.app.secret,
            validateFunc: (request, decodedToken, callback) => {
                User.getRepository().get(decodedToken.id).then(users => {
                    let user = users[0];
                    if (user && user.active) {
                        return callback(null, true, { id: user.id, scope: user.scope, active: user.active, user });
                    } else {
                        return callback(null, false, undefined);
                    }
                }).catch(err => {
                    logger.error(err);
                });
            },
            verifyOptions: { algorithms: ['HS256'] }  // only allow HS256 algorithm 
        }
    }
];

const server = new Hapi.Server();
server.connection({ port: config.app.port, routes: { cors: true } });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Sanity check');
    }
});

server.register(require('hapi-auth-jwt'), (err) => {
    if (err) {
        logger.error(err);
        throw err;
    }
    authStrategies.forEach(strat => {
        server.auth.strategy(strat.name, strat.scheme, strat.config);
    });

    //register all routes in controllers/index
    server.route(routes);
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {
    if (err) {
        throw err;
    }
    server.start(() => {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});