const jwt = require('express-jwt');
const { secret } = require('../config/db.user.config.json');

module.exports = authorizeFromParams;


function authorizeFromParams(roles = []){
    if (typeof roles === 'string'){
        roles = [roles];
    }

    return [
        // authenticate JWT token from req.query and attach decoded token to request as req.user
        jwt( { 
            secret, 
            algorithms: ['HS256'] ,
            getToken : function fromHeaderOrQuerystring(req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query && req.query.token) {
                return req.query.token;
                }
                return null;
            }
        }),

        // attach full user record to request object
        (req, res, next) => {
            // authorize based on user role
            if (roles.length && !roles.includes(req.user.role))
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });

            // authentication and authorization successful
            next();
        }
    ]
} 