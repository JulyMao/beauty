'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 用户分类相关
  apiRouter.post('/user-category/create', middleware.adminUser,loginRequired, controller.userCategory.addUserCategory); // 添加用户分类
  apiRouter.patch('/user-category/update/:id', middleware.adminUser, loginRequired, controller.userCategory.patchUserCategory); // 修改用户分类
  apiRouter.get('/user-category/:id', loginRequired, controller.userCategory.getUserCategory); // 获取我的用户分类(用户分类id)
  apiRouter.get('/user-category/list/:id', loginRequired, middleware.pagination, controller.userCategory.getUserCategoryList); // 获取我的用户分类列表(店面id)
  apiRouter.post('/user-category/del', middleware.adminUser, loginRequired, controller.userCategory.delUserCategory); // 删除用户分类
};
