'use strict';
/*
  会员卡表
    id:        主键
    store_id:   店面id
    *customer_id:  客户id
    product_id: 产品id
    create_persion_id: 创建人id
    name:  卡名称
    price:    卡价格
    discount:    卡折扣
    sale:   优惠价格 （暂不用）
    describe: 产品描述

*/
const moment = require('moment');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, TEXT, DOUBLE } = Sequelize;
    await queryInterface.createTable(
    'vip_card', {
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
      // customer_id: {
      //   type: INTEGER(11),
      //   allowNull: false,
      // },
      product_id: {
        type: STRING(256),
        allowNull: true,
      },
      create_persion_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      name: {
        type: STRING(100),
        allowNull: false,
      },
      price: {
        type: DOUBLE,
        allowNull: true,
      },
      discount: {
        type: DOUBLE,
        allowNull: true,
      },
      describe: {
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
    await queryInterface.dropTable('vip_card');
  },
};
