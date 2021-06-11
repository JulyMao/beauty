'use strict';
/*
  客户类型表
    id:        主键
    store_id:   店面id
    name: 类型名称
    money:  金额（消费达到某个金额到某类）
    create_persion_id: 创建人id
    describe: 描述

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const CustomerCategory = app.model.define(
    'CustomerCategory', {
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
      name: {
        type: STRING(100),
        allowNull: false,
      },
      money: {
        type: DOUBLE,
        allowNull: true
      },
      create_persion_id: {
        type: INTEGER(11),
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
    }, {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'customer_category',
    });


    CustomerCategory.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return CustomerCategory;
};
