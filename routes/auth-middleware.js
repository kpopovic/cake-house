/**
 * Created by kresimir on 26.06.17..
 */

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const users = require('../repository/users-db');
const cookieConf = require('../config/cookie-conf');

// http://www.blitter.se/utils/basic-authentication-header-generator/

router.all('/', async function (req, res, next) {
    try {
        if (req.originalUrl === '/favicon.ico') {
            res.end();
        } else if (req.originalUrl === '/v1/user/logout' && req.method === 'GET') {
            res.clearCookie(cookieConf.name);
            res.json({ code: 0, type: 'USER_LOGOUT', message: 'User cookie is cleared' });
        } else if (req.originalUrl === '/v1/user' && req.method === 'POST') {
            next();
        } else if (req.originalUrl === '/v1/user' && req.method === 'GET') { // user pressed Login button
            // verify route via Basic auth
            const user = auth(req);
            const result = await users.userId(req.db, user.name, user.pass);
            const userId = result[0].id;

            if (result && userId) {
                const options = {
                    maxAge: cookieConf.maxAge,
                    httpOnly: cookieConf.httpOnly, // The cookie only accessible by the web server
                    signed: cookieConf.signed // Indicates if the cookie should be signed
                };

                const token = { userId: userId };
                res.cookie(cookieConf.name, token, options);
                res.json({ code: 0, type: 'BASIC_AUTH_VALID', message: 'User is valid' });
            } else {
                res.clearCookie(cookieConf.name);
                res.json({ code: -1, type: 'BASIC_AUTH_NOT_VALID', message: 'User is not valid' });
            }
        } else { // verify route via cookie
            const tokenDecoded = req.signedCookies[cookieConf.name];
            if (tokenDecoded && tokenDecoded.hasOwnProperty('userId')) {
                req.userId = parseInt(tokenDecoded.userId);
            } else {
                console.warn("UserId is not found");
            }

            if (req.originalUrl === '/' || req.originalUrl === '/index') {
                if (req.userId) {
                    next();
                } else {
                    res.clearCookie(cookieConf.name);
                    res.redirect('/login');
                }
            } else if (req.originalUrl === '/login') {
                if (req.userId) {
                    res.redirect('/');
                } else {
                    res.clearCookie(cookieConf.name);
                    next();
                }
            } else if (req.originalUrl.startsWith('/v1')) {
                if (req.userId) {
                    next();
                } else {
                    res.clearCookie(cookieConf.name);
                    res.json({ code: -1, type: 'COOKIE_NOT_VALID', message: 'User is not valid' });
                }
            } else {
                console.log("route unknown=" + req.originalUrl);
                res.clearCookie(cookieConf.name);
                res.json({ code: -1, type: 'UNSUPPORTED_ROUTE', message: 'Route is not valid' });
            }
        }
    } catch (err) {
        console.error(err);
        res.clearCookie(cookieConf.name);
        res.json({ code: -1, type: 'BASIC_AUTH_NOT_VALID', message: 'Internal error' });
    }
});

module.exports = router;
