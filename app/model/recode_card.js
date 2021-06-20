'use strict';
/*
  划卡记录表
    id:        主键
    store_id:   店面id
    customer_id:  客户id
    create_persion_id: 员工id
    serve_id:   服务id
    product_id:    产品id
    times:  划卡次数
    remark:备注

*/
const moment = require('moment');
module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT, DOUBLE } = app.Sequelize;

  const RecodeCard = app.model.define(
    'RecodeCard', {
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
      create_persion_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      serve_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      product_id: {
        type: INTEGER(11),
        allowNull: true,
      },
      times: {
        type: INTEGER(3),
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
      tableName: 'recode_card',
    });


    RecodeCard.associate = function() {
      app.model.RecodeCard.belongsTo(app.model.Customer, { targetKey: 'id', foreignKey: 'customer_id', as: 'recodeCardToCustomer' });
      app.model.RecodeCard.belongsTo(app.model.Product, { targetKey: 'id', foreignKey: 'product_id', as: 'recodeCardToProduct' });
      app.model.RecodeCard.belongsTo(app.model.User, { targetKey: 'id', foreignKey: 'serve_id', as: 'recodeCardToCreateUser' });
      app.model.RecodeCard.belongsTo(app.model.User, { targetKey: 'id', foreignKey: 'create_persion_id', as: 'recodeCardToServeUser' });
  };
  return RecodeCard;
};
