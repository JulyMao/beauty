'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  const passportLocal = middleware.passportLocal(app);
  // 店面相关
  apiRouter.post('/store/register', controller.store.register); // 创建店面
  apiRouter.patch('/store/update/:id', middleware.adminUser, loginRequired, controller.store.patchStore); // 修改店面信息
  apiRouter.get('/store/:id', loginRequired, controller.store.getStore); // 获取我的店面信息
  apiRouter.get('/user/list/:id', loginRequired, middleware.pagination, controller.store.getStoreList); // 获取我的店面列表
};
