'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class CouponController extends Controller {
    /**
     * 增加优惠券
     */
     async addCoupon(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加优惠券' });
        }
        const nameExists = await common.findExists({ modelName: 'Coupon', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '优惠券已存在' });
        }
        const where = { store_id: userInfo.store_id, name: body.name, price: body.price, times: body.times, 
            start_dt: body.start_dt, end_dt: body.end_dt, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await ctx.model.Coupon.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的优惠券
     */
     async getCoupon(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'Coupon', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看优惠券' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的优惠券列表
     */
    async getCouponList(){
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
          common.findCount({ modelName: 'Coupon', page, where }),
          common.findPage({ modelName: 'Coupon', page, where }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有顾客列表(之后关联店面做查询)
     */
    async getAllCouponList(){
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
            common.findCount({ modelName: 'Coupon', page, where }),
            common.findPage({ modelName: 'Coupon', page, where }),
          ]);
          const res = { total, pageSize, pageIndex, items };
          return success({ ctx, res });
    }

    /**
     * 修改优惠券
     */
    async patchCoupon(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改优惠券' });
        }
        const nameExists = await common.findExists({ modelName: 'Coupon', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '优惠券已存在' });
        }
        const attributes = { name: body.name, price: body.price, times: body.times, 
            start_dt: body.start_dt, end_dt: body.end_dt, create_persion_id: ctx.user.id, describe: body.describe };
        const res = await common.update( { modelName: 'Coupon', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除优惠券
     */
    async delCoupon(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除优惠券' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'Coupon', where  } )
        return success({ ctx, msg: '删除成功' })
    }
}
module.exports = CouponController;