'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class RecodeCardController extends Controller {
    /**
     * 添加划卡记录
     */
     async addRecodeCard(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo) {
        return fail({ ctx, code: 401, msg: '无权添加划卡记录' });
        }
        const where = { store_id: userInfo.store_id, customer_id: body.customer_id, create_persion_id: ctx.user.id, serve_id: body.serve_id,
            product_id: body.product_id, times: body.times, remark: body.remark };
        const res = await ctx.model.RecodeCard.create( where );
        const remainInfo = await common.findOne({ modelName: 'RemainProduct', where: { store_id: userInfo.store_id, customer_id: body.customer_id, product_id: body.product_id } });
        if(!res && !remainInfo){
            return fail({ code: 400, msg: '添加失败' });
        }
       const remain_num = remainInfo.remain_num - body.times;
        await common.update({ modelName: 'RemainProduct', where: { store_id: userInfo.store_id, customer_id: body.customer_id, product_id: body.product_id },
             attributes: { remain_num: remain_num } })
        await common.update({ modelName: 'Customer', attributes: { updated_at: moment() } })
        return success({ ctx, res });
    }

    /**
     * 查询划卡记录详情
     */
     async getRecodeCard(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const include = [
            {
                model: ctx.model.Customer,
                as: 'recodeCardToCustomer',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToCreateUser',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToServeUser',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.Product,
                as: 'recodeCardToProduct',
                attributes: ['id','name'],
            },
        ];
        const res = await common.findOne({ modelName: 'RecodeCard', where: { id: id } }, include)
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看划卡记录' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询店面划卡记录列表
     */
    async getRecodeCardList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customerOrAll, customer_name = '', customer_phone = '',user_name = '',user_phone = '', product_name = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        let where = {};
        if (customerOrAll === 'all' && userInfo.is_admin === 1){
            where = { store_id: id }
        }else if (customerOrAll === 'customer'){
            where = { customer_id: id }
        }else{
            return fail({ ctx, code: 400, msg: '参数错误' });
        }
        const include = [
            {
                model: ctx.model.Customer,
                as: 'recodeCardToCustomer',
                attributes: ['id','name','phone'],
                where: { name: { $like: `%${customer_name}%` }, phone: { $like: `%${customer_phone}%` } },
                require: true
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToCreateUser',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToServeUser',
                attributes: ['id','name'],
                where: { name: { $like: `%${user_name}%` }, phone: { $like: `%${user_phone}%` } },
                require: true
            },
            {
                model: ctx.model.Product,
                as: 'recodeCardToProduct',
                attributes: ['id','name'],
                where: { name: { $like: `%${product_name}%` } },
                require: true
            },
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'RecodeCard', page, where, include }),
          common.findPage({ modelName: 'RecodeCard', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllRecodeCardList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { key } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customer_name = '', customer_phone = '',user_name = '', user_phone = '', product_name = '',store_id = '' } = ctx.request.query;
        if (key !== 'maowei123'){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
            store_id: { $like: `%${store_id}%` },
          };
          const include = [
            {
                model: ctx.model.Customer,
                as: 'recodeCardToCustomer',
                attributes: ['id','name','phone'],
                where: { name: { $like: `%${customer_name}%` }, phone: { $like: `%${customer_phone}%` } },
                require: true
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToCreateUser',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'recodeCardToServeUser',
                attributes: ['id','name'],
                where: { name: { $like: `%${user_name}%` }, phone: { $like: `%${user_phone}%` } },
                require: true
            },
            {
                model: ctx.model.Product,
                as: 'recodeCardToProduct',
                attributes: ['id','name'],
                where: { name: { $like: `%${product_name}%` } },
                require: true
            },
        ];
          const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'RecodeCard', page, where, include }),
            common.findPage({ modelName: 'RecodeCard', page, where, include }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }
}
module.exports = RecodeCardController;