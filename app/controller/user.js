'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

class UserController extends Controller {
    /**
     * 用户登陆
     * @returns 用户信息
     */

  async login() {
    const { ctx } = this;
    const { success } = ctx.helper;

    const { user } = ctx;
    const { token } = user;
    let res = _.pick(user.toJSON(), [ 'id', 'username', 'phone', 'is_admin' ]);
    res = Object.assign(res, { token });
    return success({ ctx, res });
  }
  /**
            * 登出
            */

  async logout() {
    const { ctx } = this;
    const { success } = ctx.helper;

    ctx.logout();
    ctx.session = null;
    const res = { ok: true };

    return success({ ctx, res });
  }
  /**
            * 添加用户
            */

  async addUser() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { body } = ctx.request;
    const { common, user } = ctx.service;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (!userInfo || !userInfo.is_admin) {
      return fail({ ctx, code: 401, msg: '无权添加用户' });
    }
    const phoneExists = await common.findExists({ modelName: 'User', where: { phone: body.phone } });
    if (phoneExists) {
      return fail({ ctx, code: 400, msg: '手机号已存在' });
    }
    const where = { username: body.username, phone: body.phone, is_admin: body.is_admin, password: body.password };
    const res = await user.addUser(where);
    console.log(res);
    if (!res) {
      return fail({ ctx, code: 400, msg: '添加失败' });
    }
    if (res.is_admin === 0) {
      common.findOrCreate({ modelName: 'Info', where: { user_id: res.id, phone: res.phone, username: res.username } });
    }
    return success({ ctx, res });
  }
  /**
          * 删除用户
          */

  async delUser() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { body } = ctx.request;
    const { common } = ctx.service;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (!userInfo || !userInfo.is_admin) {
      return fail({ ctx, msg: '无权删除用户' });
    }
    const where = { id: { in: body.id.split(',') } };
    const res = await common.destroy({ modelName: 'User', where });
    if (!res) {
      return fail({ ctx, msg: '删除失败' });
    }
    common.destroy({ modelName: 'Info', where: { user_id: { in: body.id.split(',') } } });
    return success({ ctx, msg: '删除成功' });
  }
  /**
                                                                                                        * 修改用户信息
                                                                                                        */

  async patchUser() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { id } = ctx.params;
    const { common } = ctx.service;
    const { body } = ctx.request;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (ctx.user.id !== Number(id) && (!userInfo || !userInfo.is_admin)) {
      return fail({ ctx, msg: '无权修改用户信息' });
    }
    const user = await common.findOne({ modelName: 'User', where: { id } });
    if (user.phone !== body.phone) {
      const phoneExists = await common.findExists({ modelName: 'User', where: { phone: body.phone } });
      if (phoneExists) {
        return fail({ ctx, code: 400, msg: '手机号已存在，请更换手机号' });
      }
    }

    const attributes = _.pick(body, [ 'username', 'password', 'phone' ]);
    const [ res, resInfo ] = await Promise.all([
      common.update({ modelName: 'User', where: { id }, attributes }),
      common.update({ modelName: 'Info', where: { user_id: id }, attributes: { username: body.username, phone: body.phone } }),
    ]);
    if (!res && !resInfo) {
      return fail({ ctx, msg: '修改信息失败' });
    }
    return success({ ctx, res });
  }
  /**
          * 换绑手机号
          */

  async patchPhone() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { id } = ctx.params;
    const { common } = ctx.service;
    const { body } = ctx.request;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (ctx.user.id !== Number(id) && (!userInfo || !userInfo.is_admin)) {
      return fail({ ctx, msg: '无权换绑手机号' });
    }
    const phoneExists = await common.findExists({ modelName: 'User', where: { phone: body.phone } });
    if (phoneExists) {
      return fail({ ctx, msg: '手机号已存在，请更换手机号' });
    }
    const attributes = _.pick(body, [ 'phone' ]);
    const res = await common.update({ modelName: 'User', where: { id }, attributes });
    if (!res) {
      return fail({ ctx, msg: '换绑手机号失败' });
    }
    return success({ ctx, res });
  }
  /**
          * 修改密码
          */

  async patchPassword() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { id } = ctx.params;
    const { common } = ctx.service;
    const { body } = ctx.request;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (ctx.user.id !== Number(id) && (!userInfo || !userInfo.is_admin)) {
      return fail({ ctx, msg: '无权修改密码' });
    }
    if (body.oldPassword === body.password) {
      return fail({ ctx, code: 400, msg: '您的新密码与旧密码重复' });
    }
    const user = await common.findOne({ modelName: 'User', where: { id, password: body.oldPassword } });
    if (!user) {
      return fail({ ctx, code: 400, msg: '旧密码错误' });
    }
    const attributes = _.pick(body, [ 'password' ]);
    const res = await common.update({ modelName: 'User', where: { id }, attributes });
    console.log(res);
    if (!res) {
      return fail({ ctx, msg: '修改密码失败' });
    }
    return success({ ctx, msg: '修改密码成功' });
  }
  /**
          * 获取用户列表
          */

  async userList() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { page } = ctx;
    const { pageSize, pageIndex } = page;
    const { common } = ctx.service;
    const { username = '', is_admin = '' } = ctx.request.query;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if (userInfo.is_admin === 0) {
      return fail({ ctx, msg: '您不是管理员' });
    }
    const where = {
      is_admin,
      username: { $like: `%${username}%` },
    };
    const include = [{
      model: ctx.model.Info,
      as: 'info',
      attributes: [ 'id', 'is_validated', 'username' ],
    }];
    const [ total, items ] = await Promise.all([
      common.findCount({ modelName: 'User', page, where }),
      common.findPage({ modelName: 'User', page, where, include }),
    ]);
    const res = { total, pageSize, pageIndex, items };
    return success({ ctx, res });
  }
  /**
          * 获取用户信息
          */

  async user() {
    const { ctx } = this;
    const { success, fail } = ctx.helper;
    const { common } = ctx.service;
    const { id } = ctx.params;
    const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
    if ((userInfo.is_admin === 0) && ctx.user.id !== Number(id)) {
      return fail({ ctx, msg: '无权查看用户信息' });
    }
    const where = { id };
    const res = await common.findOne({ modelName: 'User', where });
    return success({ ctx, res });
  }
}


module.exports = UserController;
