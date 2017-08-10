/**
 * Created by kresimir on 26.06.17..
 */

module.exports = {

    name: process.env.npm_config_cake_house_cookie_name || 'cakehouse',

    maxAge: process.env.npm_config_cake_house_cookie_max_Age || (30 * 24 * 60 * 60 * 1000), // 30 days is default max age

    httpOnly: process.env.npm_config_cake_house_cookie_http_Only || true,

    signed: process.env.npm_config_cake_house_cookie_signed || true,

    secretKey: process.env.npm_config_cake_house_cookie_secretKey || 'cakehouse'

};
