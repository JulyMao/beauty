'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 服务相关
  apiRouter.post('/serve/create', middleware.adminUser,loginRequired, controller.serve.addServe); // 添加服务
  apiRouter.patch('/serve/update/:id', middleware.adminUser, loginRequired, controller.serve.patchServe); // 修改服务
  apiRouter.get('/serve/:id', loginRequired, controller.serve.getServe); // 获取我的服务(服务id)
  apiRouter.get('/serve/list/:id', loginRequired, middleware.pagination, controller.serve.getServeList); // 获取消费记录服务列表(消费记录id)
  apiRouter.get('/serve/store-list/:id', loginRequired, middleware.pagination, controller.serve.getStoreServeList); // 获取我的店面服务列表(店面id)
  apiRouter.post('/serve/del', middleware.adminUser, loginRequired, controller.serve.delServe); // 删除服务
};
