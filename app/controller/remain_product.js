'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class RemainProductController extends Controller {
    /**
     * 购买产品
     */
    async buyProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const product = await common.findOne({ modelName: 'Product', where: { id: body.product_id } });
        const customerProduct = await common.findOne({ modelName: 'RemainProduct', where: { store_id: userInfo.store_id, customer_id: body.customer_id, product_id: body.product_id } });
        let where = {};
        let res = {};
        if (!customerProduct){
            where = { store_id: userInfo.store_id, customer_id: body.customer_id, product_id: body.product_id, remain_num: product.times }
            res = await ctx.model.RemainProduct.create( where );
        }else{
            where = { store_id: userInfo.store_id, customer_id: body.customer_id, product_id: body.product_id }
            res = await common.update({ modelName: 'RemainProduct', where, attributes: { remain_num: customerProduct.remain_num + product.times } });
        }
        if(res == {}){
            return fail({ code: 400, msg: '购买失败' });
        }
        const [ customerInfo, productInfo ] = await Promise.all([
            common.findOne({ modelName: 'Customer', where: { store_id: userInfo.store_id, id: body.customer_id } }),
            common.findOne({ modelName: 'Product', where: { store_id: userInfo.store_id, id: body.product_id } })
        ])
        await common.update({ modelName: 'Customer', where: { store_id: userInfo.store_id, id: body.customer_id }, attributes: { total_banlance: customerInfo.total_banlance - productInfo.price } })
        return success({ ctx, res });
    }

    /**
     * 获取某个顾客剩余产品
     */
    async getCustomerRemainProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if ( !userInfo ){
            return fail({ code: 400, msg: '无权查看' })
        }
        const res = await common.findAll({ modelName: 'RemainProduct', where: { store_id: userInfo.store_id, customer_id: id } })
        if(!res){
            return fail({ code: 400, msg: '查询失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 获取店内所有顾客剩余产品或者某个顾客所有的剩余产品
     */
    async getAllCustomerRemainProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customerOrAll, customer_name = '', product_name = '' } = ctx.request.query;
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
                as: 'remainProductToCustomer',
                attributes: ['id','name'],
                where: { name: { $like: `%${customer_name}%` } },
                require: true
            },
            {
                model: ctx.model.Product,
                as: 'remainProductToProduct',
                attributes: ['id','name'],
                where: { name: { $like: `%${product_name}%` } },
                require: true
            }
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'RemainProduct', page, where, include }),
          common.findPage({ modelName: 'RemainProduct', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

   
}
module.exports = RemainProductController;