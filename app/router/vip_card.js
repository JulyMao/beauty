'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 会员卡相关
  apiRouter.post('/vip-card/create', middleware.adminUser,loginRequired, controller.vipCard.addVipCard); // 添加会员卡
  apiRouter.post('/vip-card/addProduct/:id', middleware.adminUser, loginRequired, controller.vipCard.addDiscountProduct); // 增加啊会员卡内产品(产品id)
  apiRouter.patch('/vip-card/update/:id', middleware.adminUser, loginRequired, controller.vipCard.patchvipCard); // 修改会员卡(卡id)
  apiRouter.get('/vip-card/:id', loginRequired, controller.vipCard.getvipCard); // 获取我的会员卡(会员卡id)
  apiRouter.get('/vip-card/list/:id', loginRequired, middleware.pagination, controller.vipCard.getvipCardList); // 获取我的会员卡列表(店面id)
  apiRouter.post('/vip-card/del', middleware.adminUser, loginRequired, controller.vipCard.delvipCard); // 删除会员卡(卡id)
  apiRouter.post('/vip-card/del', middleware.adminUser, loginRequired, controller.vipCard.delvipCard); // 删除会员卡内某些折扣产品(产品id)
};
