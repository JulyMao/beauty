'use strict';

module.exports = app => {
  return app.passport.authenticate('local', {
    successRedirect: '',
  });
};
