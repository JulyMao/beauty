'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class CustomerTagController extends Controller {
    /**
     * 增加顾客标签
     */
    async addCustomerTag(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加顾客' });
        }
        const nameExists = await common.findExists({ modelName: 'CustomerTag', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '顾客标签已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.CustomerTag.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的顾客标签
     */
    async getCustomerTag(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'CustomerTag', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看顾客标签' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的顾客列表
     */
    async getCustomerTagList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
          name: { $like: `%${name}%` },
          id: id,
        };
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'CustomerTag', page, where }),
          common.findPage({ modelName: 'CustomerTag', page, where }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllCustomerTagList(){
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
            common.findCount({ modelName: 'CustomerTag', page, where }),
            common.findPage({ modelName: 'CustomerTag', page, where }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改顾客标签
     */
    async patchCustomerTag(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改顾客标签' });
        }
        const nameExists = await common.findExists({ modelName: 'CustomerTag', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '顾客标签已存在' });
        }
        const attributes = {  name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'CustomerTag', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除顾客标签
     */
    async delCustomerTag(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除顾客标签' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'CustomerTag', where  } )
        return success({ ctx, msg: '删除成功' })
    }

}

module.exports = CustomerTagController;