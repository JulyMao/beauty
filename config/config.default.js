/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1623206056309_1488';

// add your config here
config.middleware = [ 'errorHandler' ];
// sequelize数据库配置
config.sequelize = {
  dialect: 'mysql',
  database: process.env.DB_DATABASE || 'fish_manage_api',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '3306',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8',
  collate: 'utf8_general_ci',
  timezone: 'Asia/Shanghai',
};
// csrf关闭
config.security = {
  csrf: {
    enable: false,
  },
};
// jwt 配置
config.jwt = {
  secret: 'jobapijwtsecret',
  getToken(ctx) {
    if (
      ctx.headers.autorization &&
      (ctx.headers.authorization.split(' ')[0] === 'Bearer' ||
        ctx.headers.authorization.split(' ')[0] === 'Token')
    ) {
      return ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query && ctx.query.token) {
      return ctx.query.token;
    }
    return null;
  },
};
return config;
};

