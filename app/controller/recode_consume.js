'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class RecodeConsumeController extends Controller {
    /**
     * 添加消费记录
     */
     async addRecodeConsume(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo) {
        return fail({ ctx, code: 401, msg: '无权添加消费记录' });
        }
        const where = { store_id: userInfo.store_id, customer_id: body.customer_id, user_id: ctx.user.id, vip_or_product: body.vip_or_product,
         vip_or_product_id: body.vip_or_product_id, coupon_id: body.coupon_id, discount: body.discount, should_money: body.should_money,
         discount_money: body.discount_money, real_money: body.real_money, category: body.category, pay_type: body.pay_type, remark: body.remark };
        const res = await ctx.model.RecodeConsume.create( where );
        
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        if (body.customer_id !== ''){
            const customerInfo = await common.findOne({ modelName: 'Customer', where: { id: body.customer_id } });
            await common.update({ modelName: 'Customer', where: { id: body.customer_id }, attributes: { total_banlance: customerInfo.total_banlance + body.should_money } })
        }
        return success({ ctx, res });
    }

    /**
     * 查询消费记录详情
     */
     async getRecodeConsume(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const info = await common.findOne({ modelName: 'RecodeConsume', where: { id: id } })
        const include = [
            {
                model: ctx.model.Customer,
                as: 'customer',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'user',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.Coupon,
                as: 'coupon',
                attributes: ['id','name'],
            },
        ];
        if (info.vip_or_product === 'vip') {
            include.push({
                model: ctx.model.VipCard,
                as: 'vipCard',
                attributes: ['id','name'],
            })
        } else {
            include.push({
                model: ctx.model.Product,
                as: 'product',
                attributes: ['id','name'],
            }) 
        }
        const res = await common.findOne({ modelName: 'RecodeConsume', where: { id: id } }, include)
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看消费记录' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询店面消费记录列表
     */
    async getRecodeConsumeList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customer_name = '', customer_phone = '',user_name = '', user_phone = '', vip_card_name = '', product_name = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
          store_id: id,
        };
        const include = [
            {
                model: ctx.model.Customer,
                as: 'customer',
                attributes: ['id','name','phone'],
                where: { name: { $like: `%${customer_name}%` }, phone: { $like: `%${customer_phone}%` } },
                require: true
            },
            {
                model: ctx.model.User,
                as: 'user',
                attributes: ['id','name'],
                where: { name: { $like: `%${user_name}%` }, phone: { $like: `%${user_phone}%` } },
                require: true
            },
            {
                model: ctx.model.Coupon,
                as: 'coupon',
                attributes: ['id','name'],
                where: { name: { $like: `%${coupon_name}%` } },
                require: true
            },
        ];
        if (info.vip_or_product === 'vip') {
            include.push({
                model: ctx.model.VipCard,
                as: 'vipCard',
                attributes: ['id','name'],
                where: { name: { $like: `%${vip_card_name}%` } },
                require: true
            })
        } else {
            include.push({
                model: ctx.model.Product,
                as: 'product',
                attributes: ['id','name'],
                where: { name: { $like: `%${product_name}%` } },
                require: true
            }) 
        }
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'RecodeConsume', page, where, include }),
          common.findPage({ modelName: 'RecodeConsume', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllRecodeConsumeList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { key } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customer_name = '', customer_phone = '',user_name = '', user_phone = '', vip_card_name = '', product_name = '',store_id = '' } = ctx.request.query;
        if (key !== 'maowei123'){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
            store_id: { $like: `%${store_id}%` },
          };
          const include = [
            {
                model: ctx.model.Customer,
                as: 'customer',
                attributes: ['id','name','phone'],
                where: { name: { $like: `%${customer_name}%` }, phone: { $like: `%${customer_phone}%` } },
                require: true
            },
            {
                model: ctx.model.User,
                as: 'user',
                attributes: ['id','name'],
                where: { name: { $like: `%${user_name}%` }, phone: { $like: `%${user_phone}%` } },
                require: true
            },
            {
                model: ctx.model.Coupon,
                as: 'coupon',
                attributes: ['id','name'],
                where: { name: { $like: `%${coupon_name}%` } },
                require: true
            },
        ];
        if (info.vip_or_product === 'vip') {
            include.push({
                model: ctx.model.VipCard,
                as: 'vipCard',
                attributes: ['id','name'],
                where: { name: { $like: `%${vip_card_name}%` } },
                require: true
            })
        } else {
            include.push({
                model: ctx.model.Product,
                as: 'product',
                attributes: ['id','name'],
                where: { name: { $like: `%${product_name}%` } },
                require: true
            }) 
        }
          const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'RecodeConsume', page, where, include }),
            common.findPage({ modelName: 'RecodeConsume', page, where, include }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }
}
module.exports = RecodeConsumeController;