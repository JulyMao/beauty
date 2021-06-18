'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 优惠券相关
  apiRouter.post('/coupon/create', middleware.adminUser,loginRequired, controller.coupon.addCoupon); // 添加优惠券
  apiRouter.patch('/coupon/update/:id', middleware.adminUser, loginRequired, controller.coupon.patchCoupon); // 修改优惠券
  apiRouter.get('/coupon/:id', loginRequired, controller.coupon.getCoupon); // 获取我的优惠券(优惠券id)
  apiRouter.get('/coupon/list/:id', loginRequired, middleware.pagination, controller.coupon.getCouponList); // 获取我的优惠券列表(店面id)
  apiRouter.post('/coupon/del', middleware.adminUser, loginRequired, controller.coupon.delCoupon); // 删除优惠券
};
