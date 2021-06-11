'use strict';
/*
  店面表
    id:        主键
    name:   店面名称
    simple_name:    简称
    address:  店面地址
    principal:  负责人
    phone:  负责人电话
    expire_at:  到期时间
    last_pay_at:  上次续费时间
    correlation_store:  店面关联字段
    remark:备注

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;

  const Store = app.model.define(
    'Store', {
      id: {
        type: INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: STRING(100),
        allowNull: true,
      },
      simple_name: {
        type: STRING(50),
        allowNull: true,
      },
      principal: {
        type: STRING(50),
        allowNull: false,
      },
      phone: {
        type: STRING(11),
        validate: {
          isEven(value) {
            if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/i.test(value) && value !== null) {
              throw new Error('请填入正确的手机号！');
            }
          },
        },
        allowNull: false,
      },
      expire_at: {
        type: DATE,
        get() {
          return this.getDataValue('expire_at') && moment(this.getDataValue('expire_at')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      last_pay_at: {
        type: DATE,
        get() {
          return this.getDataValue('last_pay_at') && moment(this.getDataValue('last_pay_at')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      correlation_store: {
        type: STRING(100),
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
    }, {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'store',
    });

    Store.associate = function() {
    // app.model.User.belongsTo(app.model.Info, { foreignKey: 'id', targetKey: 'user_id', as: 'info' });
  };
  return Store;
};
