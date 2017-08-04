/**
 * Created by kresimir on 26.06.17..
 */

module.exports = {

    name: process.env.npm_config_cake_house_cookie_name || 'cakehouse',

    maxAge: process.env.npm_config_cake_house_cookie_max_Age || (1000 * 60 * 15),

    httpOnly: process.env.npm_config_cake_house_cookie_http_Only || true,

    signed: process.env.npm_config_cake_house_cookie_signed || true,

    secretKey: process.env.npm_config_cake_house_cookie_secretKey || 'cakehouse'
    
};