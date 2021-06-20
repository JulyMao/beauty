'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 剩余产品相关
  apiRouter.post('/remain-product/buy', loginRequired, controller.remainProduct.buyProduct); // 购买产品
  apiRouter.get('/remain-product/:id', loginRequired, controller.remainProduct.getCustomerRemainProduct); // 获取某个顾客剩余产品(顾客id)
  apiRouter.get('/remain-product/list/:id', loginRequired, middleware.pagination, controller.remainProduct.getAllCustomerRemainProduct); // 获取店内所以顾客剩余产品(店面id)

};
