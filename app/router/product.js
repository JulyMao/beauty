'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 产品相关
  apiRouter.post('/product/create', middleware.adminUser,loginRequired, controller.product.addProduct); // 添加产品
  apiRouter.patch('/product/update/:id', middleware.adminUser, loginRequired, controller.product.patchProduct); // 修改产品
  apiRouter.get('/product/:id', loginRequired, controller.product.getProduct); // 获取我的产品(产品id)
  apiRouter.get('/product/list/:id', loginRequired, middleware.pagination, controller.product.getProductList); // 获取我的产品列表(店面id)
  apiRouter.post('/product/del', middleware.adminUser, loginRequired, controller.product.delProduct); // 删除产品
};
