'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 产品分类相关
  apiRouter.post('/customer-tag/create', middleware.adminUser,loginRequired, controller.customerTag.addCustomerTag); // 添加产品分类
  apiRouter.patch('/customer-tag/update/:id', middleware.adminUser, loginRequired, controller.customerTag.patchCustomerTag); // 修改产品分类
  apiRouter.get('/customer-tag/:id', loginRequired, controller.customerTag.getCustomerTag); // 获取我的产品分类(产品分类id)
  apiRouter.get('/customer-tag/list/:id', loginRequired, middleware.pagination, controller.customerTag.getCustomerTagList); // 获取我的产品分类列表(店面id)
  apiRouter.post('/customer-tag/del', middleware.adminUser, loginRequired, controller.customerTag.delCustomerTag); // 删除产品分类
};
