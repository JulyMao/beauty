// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportStore = require('../../../app/controller/store');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    store: ExportStore;
    user: ExportUser;
  }
}
