// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoupon = require('../../../app/model/coupon');
import ExportCustomer = require('../../../app/model/customer');
import ExportCustomerCategory = require('../../../app/model/customer_category');
import ExportCustomerTag = require('../../../app/model/customer_tag');
import ExportProduct = require('../../../app/model/product');
import ExportProductCategory = require('../../../app/model/product_category');
import ExportRecodeCard = require('../../../app/model/recode_card');
import ExportRecodeConsume = require('../../../app/model/recode_consume');
import ExportRemainPeoduct = require('../../../app/model/remain_peoduct');
import ExportServe = require('../../../app/model/serve');
import ExportStore = require('../../../app/model/store');
import ExportUser = require('../../../app/model/user');
import ExportUserCategory = require('../../../app/model/user_category');
import ExportVipCard = require('../../../app/model/vip_card');

declare module 'egg' {
  interface IModel {
    Coupon: ReturnType<typeof ExportCoupon>;
    Customer: ReturnType<typeof ExportCustomer>;
    CustomerCategory: ReturnType<typeof ExportCustomerCategory>;
    CustomerTag: ReturnType<typeof ExportCustomerTag>;
    Product: ReturnType<typeof ExportProduct>;
    ProductCategory: ReturnType<typeof ExportProductCategory>;
    RecodeCard: ReturnType<typeof ExportRecodeCard>;
    RecodeConsume: ReturnType<typeof ExportRecodeConsume>;
    RemainPeoduct: ReturnType<typeof ExportRemainPeoduct>;
    Serve: ReturnType<typeof ExportServe>;
    Store: ReturnType<typeof ExportStore>;
    User: ReturnType<typeof ExportUser>;
    UserCategory: ReturnType<typeof ExportUserCategory>;
    VipCard: ReturnType<typeof ExportVipCard>;
  }
}
