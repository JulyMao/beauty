'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 产品分类相关
  apiRouter.post('/customer-tag/create', middleware.adminUser,loginRequired, controller.productCategory.addCustomerTag); // 添加产品分类
  apiRouter.patch('/customer-tag/update/:id', middleware.adminUser, loginRequired, controller.productCategory.patchCustomerTag); // 修改产品分类
  apiRouter.get('/customer-tag/:id', loginRequired, controller.productCategory.getCustomerTag); // 获取我的产品分类(产品分类id)
  apiRouter.get('/customer-tag/list/:id', loginRequired, middleware.pagination, controller.productCategory.getCustomerTagList); // 获取我的产品分类列表(店面id)
  apiRouter.post('/customer-tag/del', middleware.adminUser, loginRequired, controller.productCategory.delCustomerTag); // 删除产品分类
};
