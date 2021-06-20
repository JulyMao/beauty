// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoupon = require('../../../app/controller/coupon');
import ExportCustomer = require('../../../app/controller/customer');
import ExportCustomerCategory = require('../../../app/controller/customer_category');
import ExportCustomerTag = require('../../../app/controller/customer_tag');
import ExportProduct = require('../../../app/controller/product');
import ExportProductCategory = require('../../../app/controller/product_category');
import ExportRecodeCard = require('../../../app/controller/recode_card');
import ExportRecodeConsume = require('../../../app/controller/recode_consume');
import ExportRemainProduct = require('../../../app/controller/remain_product');
import ExportServe = require('../../../app/controller/serve');
import ExportStore = require('../../../app/controller/store');
import ExportUser = require('../../../app/controller/user');
import ExportUserCategory = require('../../../app/controller/user_category');
import ExportVipCard = require('../../../app/controller/vip_card');

declare module 'egg' {
  interface IController {
    coupon: ExportCoupon;
    customer: ExportCustomer;
    customerCategory: ExportCustomerCategory;
    customerTag: ExportCustomerTag;
    product: ExportProduct;
    productCategory: ExportProductCategory;
    recodeCard: ExportRecodeCard;
    recodeConsume: ExportRecodeConsume;
    remainProduct: ExportRemainProduct;
    serve: ExportServe;
    store: ExportStore;
    user: ExportUser;
    userCategory: ExportUserCategory;
    vipCard: ExportVipCard;
  }
}
