'use strict';
/*
  消费记录表
    id:        主键
    store_id:   店面id
    customer_id:  客户id
    user_id: 员工id
    vip_or_product:    办卡还是买产品
    vip_or_product_id:    卡或产品id
    coupon_id:    优惠券id
    discount:    折扣数
    should_money:  应收金额
    discount_money:  优惠金额
    real_monry: 实收金额
    category:   匿名消费还是注册消费
    pay_type:   支付类型（微信、支付宝、银行卡、现金等）
    remark:备注


*/
const moment = require('moment');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, TEXT, DOUBLE } = Sequelize;
    await queryInterface.createTable(
    'RecodeConsume', {
      id: {
        type: INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      store_id: {
        type: INTEGER(11),
        allowNull: false,
      },
      customer_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      user_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      vip_or_product: {
        type: STRING(20),
        allowNull: true,
      },
      vip_or_product_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      coupon_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      discount: {
        type: DOUBLE,
        allowNull: true,
      },
      should_money: {
        type: DOUBLE,
        allowNull: true,
      },
      discount_money: {
        type: DOUBLE,
        allowNull: true,
      },
      real_monry: {
        type: DOUBLE,
        allowNull: true,
      },
      category: {
        type: STRING(20),
        allowNull: true,
      },
      pay_type: {
        type: STRING(20),
        allowNull: true,
      },
      remake: {
        type: TEXT,
        allowNull: true,
      },
      updated_at: {
        type: DATE,
        get() {
          return this.getDataValue('updated_at') && moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      created_at: {
        type: DATE,
        get() {
          return this.getDataValue('created_at') && moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      deleted_at: {
        type: DATE,
        get() {
          return this.getDataValue('deleted_at') && moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('recode_consume');
  },
};
