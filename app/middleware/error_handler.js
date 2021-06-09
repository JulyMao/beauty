'use strict';

const Raven = require('raven');
const _ = require('lodash');

module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      console.log('err=================>');
      console.log(err);
      if (err.name === 'AuthenticationError') {
        err.message = '请先登录';
      }
      if (err.name === 'SequelizeValidationError') {
        err.status = 400;
      }
      if (err.name === 'SequelizeDatabaseError') {
        err.status = 400;
      }
      if (_.indexOf(err.name) === -1) {
        Raven.captureException(err);
      }
      app.emit('error', err, this);
      if (err.code === 'isv.BUSINESS_LIMIT_CONTROL') {
        err.message = '短信发送过于频繁，请稍后重试';
      }
      const status = err.status || 500;
      // 生产环境下不将错误内容返回给客户端
      const error = status === 500 && app.config.env === 'prod'
        ? '服务器错误，请联系管理员'
        : err.message;
      ctx.helper.fail({ ctx, code: status, res: error, msg: err.message || '' });
      if (status === 422) {
        ctx.helper.fail({ ctx, code: status, res: err.errors });
      }
      ctx.status = status;
    }
  };
};
