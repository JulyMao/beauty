'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/store')(app);
  require('./router/user')(app);
  require('./router/product_category')(app);
  require('./router/user_category')(app);
  require('./router/customer_category')(app);
  require('./router/customer_tag')(app);
  require('./router/vip_card')(app);
  require('./router/coupon')(app);
  require('./router/customer')(app);
};
