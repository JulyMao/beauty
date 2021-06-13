'use strict';
module.exports = async (ctx, next) => {
  const { fail } = ctx.helper;
  const { body } = ctx.request;
  const { common } = ctx.service;
  const resUser = await common.findOne({ modelName: 'User', where: { username: body.account, password: body.password } });
  const resPhone = await common.findOne({ modelName: 'User', where: { phone: body.account, password: body.password } });
  if (resPhone) {
    return next();
  }
  if (!resUser || resUser.is_admin === 0) {
    return fail({ ctx, code: 400, msg: '权限不足' });
  }
  if (!resUser) {
    return fail({ ctx, code: 400, msg: '权限不足' });
  }
  return next();
};
