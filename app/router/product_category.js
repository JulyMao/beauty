'use strict';

module.exports = app => {
  const { apiRouter, middleware, controller } = app;
  const loginRequired = middleware.loginRequired(app);
  // 产品分类相关
  apiRouter.post('/product-category/create', middleware.adminUser,loginRequired, controller.productCategory.addProductCategory); // 添加产品分类
  apiRouter.patch('/product-category/update/:id', middleware.adminUser, loginRequired, controller.productCategory.patchProductCategory); // 修改产品分类
  apiRouter.get('/product-category/:id', loginRequired, controller.productCategory.getProductCategory); // 获取我的产品分类(产品分类id)
  apiRouter.get('/product-category/list/:id', loginRequired, middleware.pagination, controller.productCategory.getProductCategoryList); // 获取我的产品分类列表(店面id)
  apiRouter.post('/product-category/del', middleware.adminUser, loginRequired, controller.productCategory.delProductCategory); // 删除产品分类
};
