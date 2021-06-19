'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class UserCategoryController extends Controller {
    /**
     * 增加用户类别
     */
     async addUserCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加用户' });
        }
        const nameExists = await common.findExists({ modelName: 'UserCategory', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '用户分类已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.UserCategory.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的用户分类
     */
    async getUserCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'UserCategory', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看用户分类' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的用户列表
     */
    async getUserCategoryList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看用户分类' });
        }
        const where = {
          name: { $like: `%${name}%` },
          id: id,
        };
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'UserCategory', page, where }),
          common.findPage({ modelName: 'UserCategory', page, where }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有用户列表(之后关联店面做查询)
     */
    async getAllUserCategoryList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { key } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '',store_id = '' } = ctx.request.query;
        if (key !== 'maowei123'){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
            name: { $like: `%${name}%` },
          };
          const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'UserCategory', page, where }),
            common.findPage({ modelName: 'UserCategory', page, where }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改用户分类
     */
    async patchUserCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改用户分类' });
        }
        const nameExists = await common.findExists({ modelName: 'UserCategory', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '用户分类已存在' });
        }
        const attributes = {  name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'UserCategory', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除用户分类
     */
    async delUserCategory(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        if (!userInfo || !userInfo.is_admin) {
            return fail({ ctx, msg: '无权删除用户分类' });
          }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'UserCategory', where  } )
        return success({ ctx, msg: '删除成功' })
    }
}

module.exports = UserCategoryController;