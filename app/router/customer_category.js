'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 顾客分类相关
  apiRouter.post('/customer-category/create', middleware.adminUser,loginRequired, controller.customerCategory.addCustomerCategory); // 添加顾客分类
  apiRouter.patch('/customer-category/update/:id', middleware.adminUser, loginRequired, controller.customerCategory.patchCustomerCategory); // 修改顾客分类
  apiRouter.get('/customer-category/:id', loginRequired, controller.customerCategory.getCustomerCategory); // 获取我的顾客分类(顾客分类id)
  apiRouter.get('/customer-category/list/:id', loginRequired, middleware.pagination, controller.customerCategory.getCustomerCategoryList); // 获取我的顾客分类列表(店面id)
  apiRouter.post('/customer-category/del', middleware.adminUser, loginRequired, controller.customerCategory.delCustomerCategory); // 删除顾客分类
};
