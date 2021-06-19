'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class ProductCategoryController extends Controller {
    /**
     * 增加产品类别
     */
    async addProductCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加产品' });
        }
        const nameExists = await common.findExists({ modelName: 'ProductCategory', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '产品分类已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.ProductCategory.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的产品分类
     */
    async getProductCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'ProductCategory', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看产品分类' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的产品列表
     */
    async getProductCategoryList(){
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
          common.findCount({ modelName: 'ProductCategory', page, where }),
          common.findPage({ modelName: 'ProductCategory', page, where }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有产品列表(之后关联店面做查询)
     */
    async getAllProductCategoryList(){
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
            common.findCount({ modelName: 'ProductCategory', page, where }),
            common.findPage({ modelName: 'ProductCategory', page, where }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改产品分类
     */
    async patchProductCategory(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改产品分类' });
        }
        const nameExists = await common.findExists({ modelName: 'ProductCategory', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '产品分类已存在' });
        }
        const attributes = {  name: body.name, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'ProductCategory', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除产品分类
     */
    async delProductCategory(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除产品分类' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'ProductCategory', where  } )
        return success({ ctx, msg: '删除成功' })
    }

}

module.exports = ProductCategoryController;