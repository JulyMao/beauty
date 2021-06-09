'use strict';
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
// jwt插件
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
// 鉴权
exports.passport = {
  enable: true,
  package: 'egg-passport',
};
// 校验插件
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
// 路由转发
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

if (process.env.EGG_ENABLE_ALINODE === '1') {
  // alinode 监控
  exports.alinode = {
    enable: true,
    package: 'egg-alinode',
  };
}
