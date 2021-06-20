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
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const Serve = app.model.define(
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
    }, {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'serve',
    });


    Serve.associate = function() {
    app.model.Serve.belongsTo(app.model.User, { targetKey: 'id', foreignKey: 'serve_id', as: 'serveToUser' });
    app.model.Serve.belongsTo(app.model.Customer, { targetKey: 'id', foreignKey: 'customer_id', as: 'serveToCustomer' });
    app.model.Serve.belongsTo(app.model.RecodeConsume, { targetKey: 'id', foreignKey: 'consume_id', as: 'serveToConsume' });
  };
  return Serve;
};
