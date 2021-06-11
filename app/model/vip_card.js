'use strict';
/*
  会员卡表
    id:        主键
    store_id:   店面id
    customer_id:  客户id
    product_id: 产品id
    create_persion_id: 创建人id
    card_name:  卡名称
    price:    卡价格
    discount:    卡折扣
    sale:   优惠价格 （暂不用）
    describe: 产品描述

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const VipCard = app.model.define(
    'VipCard', {
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
      create_persion_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      card_name: {
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
    }, {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'vip_card',
    });


    VipCard.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return VipCard;
};
