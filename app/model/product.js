'use strict';
/*
  用户表
    id:        主键
    store_id:   店面id
    product_name:  产品名称
    type_id: 产品类型id
    price:    产品价格
    times:    可用次数
    describe: 产品描述
    create_persion_id:  创建人id

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const Product = app.model.define(
    'Product', {
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
      product_name: {
        type: STRING(100),
        allowNull: false,
      },
      type_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      price: {
        type: DOUBLE,
        allowNull: true,
      },
      times: {
        type: INTEGER(3),
        allowNull: true,
      },
      describe: {
        type: TEXT,
        allowNull: true,
      },
      create_persion_id: {
        type: INTEGER(11),
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
      tableName: 'product',
    });


    Product.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return Product;
};
