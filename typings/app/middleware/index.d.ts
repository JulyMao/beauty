// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdminUser = require('../../../app/middleware/admin_user');
import ExportErrorHandler = require('../../../app/middleware/error_handler');
import ExportLoginRequired = require('../../../app/middleware/login_required');
import ExportPagination = require('../../../app/middleware/pagination');
import ExportPassportLocal = require('../../../app/middleware/passport_local');

declare module 'egg' {
  interface IMiddleware {
    adminUser: typeof ExportAdminUser;
    errorHandler: typeof ExportErrorHandler;
    loginRequired: typeof ExportLoginRequired;
    pagination: typeof ExportPagination;
    passportLocal: typeof ExportPassportLocal;
  }
}
