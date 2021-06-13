'use strict';
/*
  用户表
    id:        主键
    store_id:   店面id
    username:  姓名
    password: 密码
    phone:    手机号
    sex:    性别
    wx_chat:    微信号
    birthday:  出生日期
    duty_id:  职务(用户分类)
    is_admin:  管理员  暂定0-店员，1-店长
    remark:备注


*/
'use strict';
const moment = require('moment');
module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, TEXT, DOUBLE } = Sequelize;
    await queryInterface.createTable(  'user', {
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
      username: {
        type: STRING(32),
        allowNull: false,
      },
      password: {
        type: STRING(64),
        allowNull: true,
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
      duty_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      is_admin: {
        type: INTEGER(1),
        allowNull: false,
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
    },
    );
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('user');
  },
};