'use strict';
/*
  客户剩余产品数表
    id:        主键
    store_id:   店面id
    customer_id:  客户id
    product_id:    产品id
    remain_num: 剩余次数 

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const RemainProduct = app.model.define(
    'RemainProduct', {
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
      product_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      remain_num: {
        type: INTEGER(3),
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
      tableName: 'remain_product',
    });


    RemainProduct.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return RemainProduct;
};
