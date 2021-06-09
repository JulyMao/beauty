'use strict';

const passport = require('./passport');
module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      console.log('beforeStart =====>');
    });
  }

  passport(app);
};
