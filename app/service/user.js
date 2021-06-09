'use strict';

// const _ = require('lodash');
const Service = require('egg').Service;

class UserService extends Service {
  /**
  * 根据ID查找用户
  */

  async getUserByID(id, attributes = {}, include = []) {
    const { User } = this.ctx.model;
    return User.findOne({ attributes, where: { id }, include });
  }

  /**
  * 添加用户
  */

  async addUser(where) {
    const { User } = this.ctx.model;
    return User.create(where)
      .then(() => this.ctx.model.User.findOne({
        where,
      }));
  }

  /**
  * 验证用户信息
  */

  async verify(account, password) {
    const { User } = this.ctx.model;
    const where = { $or: { phone: account, username: account }, password };
    const user = await User.findOne({ where });

    if (!user) {
      const phoneRes = await User.findOne({ where: { $or: { phone: account, userName: account } } });
      let errMsg;
      if (!phoneRes) {
        errMsg = '手机号不存在';
      } else {
        errMsg = '密码错误';
      }
      const err = new Error(errMsg);
      err.status = 400;
      throw err;
    } else {
      return user;
    }
  }
}

module.exports = UserService;
