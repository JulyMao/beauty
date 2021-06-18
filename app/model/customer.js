'use strict';
/*
  客户表
    id:        主键
    store_id:   店面id
    name:  姓名
    phone:    手机号
    sex:    性别
    wx_chat:    微信号
    birthday:  出生日期
    total_balance:  总余额
    total_debt: 总欠款
    is_vip: 是否是会员
    ticket_num: 消费券个数
    course_card_num:    疗程卡个数
    category_id:    客户类别id
    tag:    客户标签
    remark:备注

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const Customer = app.model.define(
    'Customer', {
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
        type: STRING(32),
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
      sex: {
        type: STRING(10),
        allowNull: true,
      },
      wx_chat: {
        type: STRING(50),
        allowNull: true,
      },
      birthday: {
        type: DATE,
        get() {
          return this.getDataValue('updated_at') && moment(this.getDataValue('updated_at')).format('YYYY-MM-DD');
        },
        allowNull: true,
      },
      total_balance: {
        type: DOUBLE,
        allowNull: true,
      },
      total_debt: {
        type: DOUBLE,
        allowNull: true,
      },
      is_vip: {
        type: INTEGER(1),
        allowNull: true,
      },
      ticket_num: {
        type: INTEGER(3),
        allowNull: true,
      },
      course_card_num: {
        type: INTEGER(3),
        allowNull: true,
      },
      category_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      tag: {
        type: STRING(200),
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
      tableName: 'customer',
    });

    Customer.associate = function() {
    app.model.Customer.belongsTo(app.model.CustomerCategory, { foreignKey: 'category_id', targetKey: 'id', as: 'customerCategory' });
  };
  return Customer;
};
