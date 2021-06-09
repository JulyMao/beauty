'use strict';
module.exports = app => {
  return app.passport.authenticate('jwt', { successRedirect: '', session: false });
};
