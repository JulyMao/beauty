'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 消费记录相关
  apiRouter.post('/recode-consume/create', middleware.adminUser,loginRequired, controller.recodeConsume.addRecodeConsume); // 添加消费记录
  apiRouter.get('/recode-consume/:id', loginRequired, controller.recodeConsume.getRecodeConsume); // 获取我的消费记录(消费记录id)
  apiRouter.get('/recode-consumelist/:id', loginRequired, middleware.pagination, controller.recodeConsume.getRecodeConsumeList); // 获取我的消费记录列表(店面id)
};
