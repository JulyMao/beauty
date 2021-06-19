'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class VipCardController extends Controller {
    /**
     * 增加会员卡
     */
    async addVipCard(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加会员卡' });
        }
        const nameExists = await common.findExists({ modelName: 'VipCard', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '会员卡已存在' });
        }
        const productArr = body.product_id.split(',')
        productArr.array.forEach(product_id => {
            let where = { store_id: userInfo.store_id, product_id: product_id, name: body.name, price: body.price, discount: body.discount, create_persion_id: ctx.user.id, describe: body.describe };
            await ctx.model.VipCard.create( where );
        });
        return success({ ctx, msg: '添加成功' });
    }

    /**
     * 查询我的会员卡
     */
    async getVipCard(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'VipCard', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看会员卡' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的会员卡列表
     */
    async getVipCardList(){
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
          common.findCount({ modelName: 'VipCard', page, where }),
          common.findPage({ modelName: 'VipCard', page, where }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有会员卡列表(之后关联店面做查询)
     */
    async getAllVipCardList(){
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
            common.findCount({ modelName: 'VipCard', page, where }),
            common.findPage({ modelName: 'VipCard', page, where }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改会员卡
     */
    async patchVipCard(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改会员卡' });
        }
        const nameExists = await common.findExists({ modelName: 'VipCard', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '会员卡已存在' });
        }
        const attributes = { name: body.name, price: body.price, discount: body.discount, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'VipCard', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 增加某一会员卡的折扣产品
     */
    async addDiscountProduct(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
            return fail({ ctx, code: 401, msg: '无权修改' });
        }
        const where = { store_id: userInfo.store_id, product_id: body.product_id, name: body.name, price: body.price, discount: body.discount, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.VipCard.create( where )
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }


    /**
     * 删除会员卡
     */
    async delVipCard(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除会员卡' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'VipCard', where  } )
        return success({ ctx, msg: '删除成功' })
    }
    
        /**
     * 删除会员卡内某些折扣产品
     */
         async delDiscountProduct(){
            const { ctx } = this
            const { success,fail } = ctx.helper
            const { body } = ctx.request;
            const { common } = ctx.service;
            const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
            if (!userInfo || !userInfo.is_admin) {
              return fail({ ctx, msg: '无权删除会员卡' });
            }
            const where = { product_id: { in: body.id.split(',') } };
            await common.destroy({ modelName: 'VipCard', where  } )
            return success({ ctx, msg: '删除成功' })
        }

}

module.exports = VipCardController;