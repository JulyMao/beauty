'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class CustomerController extends Controller {
    /**
     * 增加客户
     */
     async addCustomer(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加客户' });
        }
        const nameExists = await common.findExists({ modelName: 'Customer', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '客户已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, sex: body.sex, wx_chat: body.wx_chat, birthday: body.birthday,
             total_balance: 0, total_debt: 0, is_vip: 0, ticket_num: 0, course_card_num: 0, tag: body.tag, remark: body.remark };
        const res = await ctx.model.Customer.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的客户
     */
     async getCustomer(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const include = [
            {
                model: ctx.model.CustomerCategory,
                as: 'customerCategory',
                attributes: ['id','name'],
            }
        ];
        const res = await common.findOne({ modelName: 'Customer', where: { id: id, deleted_at: null  } }, include)
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看客户' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的客户列表
     */
    async getCustomerList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '', customerCate = '', tag_name = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, mgs: '无权查看' });
        }
        const where = {
          name: { $like: `%${name}%` },
          tag: { $like: `${tag_name}` },
          id: id,
          deleted_at: null 
        };
        const include = [
            {
                model: ctx.model.CustomerCategory,
                as: 'CustomerCategory',
                attributes: ['id','name'],
                where: { name: { $like: `%${customerCate}%` } },
                require: true
            }
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'Customer', page, where, include }),
          common.findPage({ modelName: 'Customer', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllCustomerList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { key } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '',store_id = '', customerCate = '', tag_name = '' } = ctx.request.query;
        if (key !== 'maowei123'){
            return fail({ ctx, code: 400, mgs: '无权查看' });
        }
        const where = {
            name: { $like: `%${name}%` },
            tag: { $like: `${tag_name}` },
            deleted_at: null 
          };
          const include = [
            {
                model: ctx.model.CustomerCategory,
                as: 'CustomerCategory',
                attributes: ['id','name'],
                where: { name: { $like: `%${customerCate}%` } },
                require: true
            }
        ];
          const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'Customer', page, where, include }),
            common.findPage({ modelName: 'Customer', page, where, include }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改客户
     */
    async patchCustomer(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改客户' });
        }
        const nameExists = await common.findExists({ modelName: 'Customer', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '客户已存在' });
        }
        const attributes = { name: body.name, sex: body.sex, wx_chat: body.wx_chat, 
            birthday: body.birthday, tag: body.tag, remark: body.remark };
        const res = await common.update( { modelName: 'Customer', where: { id: body.id, deleted_at: null }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除客户
     */
    async delCustomer(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除客户' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.update({ modelName: 'Customer', where, attributes: { deleted_at: moment() }  } )
        return success({ ctx, msg: '删除成功' })
    }
}
module.exports = CustomerController;