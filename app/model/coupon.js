'use strict';
/*
  优惠券表
    id:        主键
    store_id:   店面id
    name:  优惠券名称
    price:    产品价格
    times:    可用次数
    start_dt:   开始时间
    end_dt: 结束时间
    describe: 产品描述
    create_persion_id:  创建人id

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const Coupon = app.model.define(
    'Coupon', {
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
      price: {
        type: DOUBLE,
        allowNull: true,
      },
      times: {
        type: INTEGER(3),
        allowNull: true,
      },
      start_dt: {
        type: DATE,
        get() {
          return this.getDataValue('start_dt') && moment(this.getDataValue('start_dt')).format('YYYY-MM-DD');
        },
      },
      end_dt: {
        type: DATE,
        get() {
          return this.getDataValue('end_dt') && moment(this.getDataValue('end_dt')).format('YYYY-MM-DD');
        },
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
      tableName: 'coupon',
    });


    Coupon.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return Coupon;
};
