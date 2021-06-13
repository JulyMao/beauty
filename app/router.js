'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/store')(app);
  require('./router/user')(app);
  require('./router/productCategory')(app);
  require('./router/userCategory')(app);
};
