'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class ProductController extends Controller {
    /**
     * 增加产品
     */
     async addProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加产品' });
        }
        const nameExists = await common.findExists({ modelName: 'Product', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '产品已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, type_id: body.type_id, price: body.price, times: body.times, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.Product.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的产品
     */
     async getProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const include = [
            {
                model: ctx.model.ProductCategory,
                as: 'productCategory',
                attributes: ['id','name'],
            }
        ];
        const res = await common.findOne({ modelName: 'Product', where: { id: id } }, include)
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看产品' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的产品列表
     */
    async getProductList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { name = '', productCate = '' } = ctx.request.query;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
          name: { $like: `%${name}%` },
          id: id,
        };
        const include = [
            {
                model: ctx.model.ProductCategory,
                as: 'productCategory',
                attributes: ['id','name'],
                where: { name: { $like: `%${productCate}%` } },
                require: true
            }
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'Product', page, where, include }),
          common.findPage({ modelName: 'Product', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllProductList(){
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
          const include = [
            {
                model: ctx.model.ProductCategory,
                as: 'productCategory',
                attributes: ['id','name'],
                where: { name: { $like: `%${productCate}%` } },
                require: true
            }
        ];
          const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'Product', page, where, include }),
            common.findPage({ modelName: 'Product', page, where, include }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改产品
     */
    async patchProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改产品' });
        }
        const nameExists = await common.findExists({ modelName: 'Product', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '产品已存在' });
        }
        const attributes = {  name: body.name, type_id: body.type_id, price: body.price, times: body.times, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'Product', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除产品
     */
    async delProduct(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除产品' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'Product', where  } )
        return success({ ctx, msg: '删除成功' })
    }
}
module.exports = ProductController;