'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 划卡记录相关
  apiRouter.post('/recode-card/create', middleware.adminUser,loginRequired, controller.recodeCard.addRecodeCard); // 添加划卡记录
  apiRouter.get('/recode-consume/:id', loginRequired, controller.recodeCard.getRecodeCard); // 获取我的划卡记录(划卡记录id)
  apiRouter.get('/recode-card/list/:id', loginRequired, middleware.pagination, controller.recodeCard.getRecodeCardList); // 获取我的划卡记录列表(店面id)
};
