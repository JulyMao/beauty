'use strict';
const _ = require('lodash');
const moment = require('moment');
const Controller = require('egg').Controller;

class StoreController extends Controller {
    /**
     * 注册店面
     */
    async register(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        if (body.key !== 'maowei123')
        {
            return fail({ ctx, code: 400, msg: '无权创建' })
        }
        const phoneExists = await common.findExists({ modelName: 'Store', where: { phone: body.phone } });
        if (phoneExists) {
            return fail({ ctx, code: 400, msg: '手机号已存在' });
        }
        const where = { name: body.name, simple_name: body.simple_name, address: body.address,
            principal: body.principal, phone: body.phone, expire_at: moment().add(365,'days').format('YYYY-MM-DD'),
             last_pay_at: moment().format('YYYY-MM-DD'),correlation_store: body.correlation_store, remark: body.remark };
        const res = await ctx.model.Store.create( where );
        if (!res){
            return fail({ ctx, msg: '添加失败' });
        }
        console.log(res)
        await ctx.model.User.create({ store_id: res.id, username: body.principal, phone: body.phone, password: body.phone.toString().substr(5),is_admin: 1 });
        await ctx.model.UserCategory.create({ store_id: res.id, name: '店长', create_persion_id: -1 ,describe: '' });
        await ctx.model.UserCategory.create({ store_id: res.id, name: '前台', create_persion_id: -1 ,describe: '' });
        await ctx.model.UserCategory.create({ store_id: res.id, name: '美容师', create_persion_id: -1 ,describe: '' });
        await ctx.model.ProductCategory.create({ store_id: res.id, name: '普通产品', create_persion_id: -1 ,describe: '' });
        await ctx.model.ProductCategory.create({ store_id: res.id, name: '疗程卡', create_persion_id: -1 ,describe: '' });
        await ctx.model.ProductCategory.create({ store_id: res.id, name: '套卡', create_persion_id: -1 ,describe: '' });
        return success({ ctx, res, msg: '添加成功' })
    }
    /**
     * 修改店面信息
     */
    async patchStore(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { id } = ctx.params;
        const { body } = ctx.request;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.is_admin === 0 || userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权修改' });
        }
        const attributes = _.pick(body, [ 'name', 'simple_name', 'address', 'principal', 'phone', 'remark' ]);
        const res = await common.update({ modelName: 'Store', where: { id: id }, attributes });
        return success({ ctx, res });
    }

    /**
     * 查看我的店面信息
     */
    async getStore(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const res =  await common.findOne({ modelName: 'Store', where: { id: id } });
        return success({ ctx, res })
    }

    /**
     * 查看我的店面列表
     */
    async getStoreList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { id } = ctx.params;
        const { common } = ctx.service;
        const userInfo = await common.findOne({ modelName: 'User', where: { id: ctx.user.id } });
        if (userInfo.store_id !== id){
            return fail({ ctx, code: 400, msg: '无权查看' });
        }
        const where = { id: id };
        const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'Store', page, where }),
            common.findPage({ modelName: 'Store', page, where }),
          ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 查看所有店面列表
     */
    async getAllStoreList(){
        const { ctx } = this;
        const { success, fail } = ctx.helper;
        const { page } = ctx;
        const { pageSize, pageIndex } = page;
        const { common } = ctx.service;
        const { query } = ctx.request;
        const { name = '', simple_name = '', principal = '', phone = '' } = query;
        if (body.key !== 'maowei123')
        {
            return fail({ ctx, code: 400, msg: '无权查看' })
        }
        const where = { name: { $like: `%${name}%` }, simple_name: { $like: `%${simple_name}%` }, principal: { $like: `%${principal}%` }, phone: { $like: `%${phone}%` } }
        const [ total, items ] = await Promise.all([
            common.findCount({ modelName: 'Store', page, where }),
            common.findPage({ modelName: 'Store', page, where }),
          ]);
        const res = { total, pageSize, pageIndex, items };
        return success({ ctx, res });
    }

    /**
     * 删除店面
     */
    async getStore(){
        const { ctx } = this
        const { success,fail } = ctx.helper
        const { body } = ctx.request;
        const { common } = ctx.service;
        const where = { id: { in: body.id.split(',') } };
        await common.update({ modelName: 'Store', where , attributes: { deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') } } )
        return success({ ctx, msg: '删除成功' })
    }
}




module.exports = StoreController;
