
'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  const passportLocal = middleware.passportLocal(app);
  // 用户相关
  apiRouter.post('/user/login', middleware.adminUser, passportLocal, controller.user.login); // 登录
  apiRouter.post('/user/logout', loginRequired, controller.user.logout); // 登出
  apiRouter.post('/user/add', loginRequired, controller.user.addUser); // 添加用户
  apiRouter.post('/user/del', loginRequired, controller.user.delUser); // 删除用户
  apiRouter.patch('/user/update/:id', loginRequired, controller.user.patchUser); // 修改用户信息
  apiRouter.patch('/user/phone/:id', loginRequired, controller.user.patchPhone); // 换绑手机号
  apiRouter.patch('/user/password/:id', loginRequired, controller.user.patchPassword); // 修改密码
  apiRouter.get('/user/list', loginRequired, middleware.pagination, controller.user.userList); // 获取用户列表
  apiRouter.get('/user/:id', loginRequired, controller.user.user); // 获取用户信息
};
