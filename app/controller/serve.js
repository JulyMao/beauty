'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class ServeController extends Controller {
    /**
     * 增加服务
     */
    async addServe(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权添加服务' });
        }
        const nameExists = await common.findExists({ modelName: 'Serve', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '服务已存在' });
        }
        const where = { store_id: userInfo.store_id, customer_id: body.customer_id, consume_id: body.consume_id, serve_id: body.serve_id, apportion_money: body.apportion_money, remark: body.remark };
        const res = await ctx.model.Serve.create( where );
        if(!res){
            return fail({ code: 400, msg: '添加失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询我的服务,服务id
     */
    async getServe(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        const res = await common.findOne({ modelName: 'Serve', where: { id: id } })
        if (!userInfo || userInfo.store_id !== res.store_id) {
            return fail({ ctx, code: 401, msg: '无权查看服务' });
        }
        return success({ ctx, res });
    }

    /**
     * 查询某个消费记录的服务分配列表，消费记录id
     */
    async getServeList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
            consume_id: id,
        };
        const include = [
            {
                model: ctx.model.Customer,
                as: 'serveToCustomer',
                attributes: ['id','name'],
            },
            {
                model: ctx.model.User,
                as: 'serveToUser',
                attributes: ['id','name'],
            },
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'Serve', page, where, include }),
          common.findPage({ modelName: 'Serve', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查看店面内所以服务情况
     */
    async getStoreServeList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { id } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customerName = '',userName = '', customerPhone= '',userPhone = '' } = ctx.request.query;
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
                as: 'serveToCustomer',
                attributes: ['id','name'],
                where = { name: { $like: `%${customerName}%` }, phone: { $like: `%${customerPhone}%` } },
            },
            {
                model: ctx.model.User,
                as: 'serveToUser',
                attributes: ['id','name'],
                where = { name: { $like: `%${userName}%` }, phone: { $like: `%${userPhone}%` } },
            },
            {
                model: ctx.model.RcodeConsume,
                as: 'serveToConsume',
                attributes: ['id','name'],
            },
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'Serve', page, where, include }),
          common.findPage({ modelName: 'Serve', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查询所有产品列表(之后关联店面做查询)
     */
    async getAllServeList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { key } = ctx.params;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { customerName = '',userName = '', customerPhone= '',userPhone = '',store_id = '' } = ctx.request.query;
        if (key !== 'maowei123'){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = {
          id: { $like: `%${store_id}%` },

        };
        const include = [
            {
                model: ctx.model.Customer,
                as: 'serveToCustomer',
                attributes: ['id','name'],
                where = { name: { $like: `%${customerName}%` }, phone: { $like: `%${customerPhone}%` } },
            },
            {
                model: ctx.model.User,
                as: 'serveToUser',
                attributes: ['id','name'],
                where = { name: { $like: `%${userName}%` }, phone: { $like: `%${userPhone}%` } },
            },
            {
                model: ctx.model.RcodeConsume,
                as: 'serveToConsume',
                attributes: ['id','name'],
            },
        ];
        const [ total, items ] = await Promise.all([
          common.findCount({ modelName: 'Serve', page, where, include }),
          common.findPage({ modelName: 'Serve', page, where, include }),
        ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 修改服务
     */
    async patchServe(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
        return fail({ ctx, code: 401, msg: '无权修改服务' });
        }
        const nameExists = await common.findExists({ modelName: 'Serve', where: { name: body.name } });
        if (nameExists) {
          return fail({ ctx, code: 400, msg: '服务已存在' });
        }
        const attributes = { serve_id: body.serve_id, apportion_money: body.apportion_money, remark: body.remark };
        const res = await common.update( { modelName: 'Serve', where: { id: body.id }, attributes } );
        if(!res){
            return fail({ code: 400, msg: '修改失败' });
        }
        return success({ ctx, res });
    }

    /**
     * 删除服务
     */
    async delServe(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (!userInfo || !userInfo.is_admin) {
          return fail({ ctx, msg: '无权删除服务' });
        }
        const where = { id: { in: body.id.split(',') } };
        await common.destroy({ modelName: 'Serve', where  } )
        return success({ ctx, msg: '删除成功' })
    }

}

module.exports = ServeController;