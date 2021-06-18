'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 客户相关
  apiRouter.post('/customer/create', middleware.adminUser,loginRequired, controller.customer.addCustomer); // 添加客户
  apiRouter.patch('/customer/update/:id', middleware.adminUser, loginRequired, controller.customer.patchCustomer); // 修改客户
  apiRouter.get('/customer/:id', loginRequired, controller.customer.getCustomer); // 获取我的客户(客户id)
  apiRouter.get('/customer/list/:id', loginRequired, middleware.pagination, controller.customer.getCustomerList); // 获取我的客户列表(店面id)
  apiRouter.post('/customer/del', middleware.adminUser, loginRequired, controller.customer.delCustomer); // 删除客户
};
