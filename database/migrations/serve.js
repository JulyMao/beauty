'use strict';
/*
  店员服务表
    id:        主键
    store_id:   店面id
    customer_id:  客户id
    consume_id:    消费记录id
    serve_id: 服务店员id
    apportion_money:    分摊金额 
    remark: 备注

*/
const moment = require('moment');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, TEXT, DOUBLE } = Sequelize;
    await queryInterface.createTable(
    'Serve', {
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
        allowNull: false,
      },
      consume_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      serve_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      apportion_money: {
        type: DOUBLE,
        allowNull: true,
      },
      remarke: {
        type: TEXT,
        allowNull: true
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
    await queryInterface.dropTable('serve');
  },
};
