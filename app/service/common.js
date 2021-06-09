'use strict';
/**
 * 统一日志处理服务
 */

const Service = require('egg').Service;

class CommonService extends Service {
  async getCity({
    where = {},
    attributes = {},
  }) {
    return this.ctx.model.AddressCity.findAll({
      where,
      attributes,
    });
  }

  /**
  * 计数
  */

  async findCount({ modelName, where = {}, include = [] }) {
    return this.ctx.model[modelName].count({
      where, include,
    });
  }

  /**
   * 分页查
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(array)}       列表
   */

  async findPage({
    modelName,
    where = {},
    page = {},
    attributes = {},
    include = [],
  }) {
    const {
      pagination,
    } = this.ctx.helper;
    const {
      order,
      offset,
      limit,
    } = pagination(page);
    return this.ctx.model[modelName].findAll({
      where,
      order,
      offset,
      limit,
      attributes,
      include,
    });
  }

  /**
   * 更新指定模型中指定数据
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */

  async update({
    modelName,
    where = {},
    attributes = {},
  }) {
    return this.ctx.model[modelName].update(attributes, { where })
      .then(() => this.ctx.model[modelName].findOne({
        where,
      }));
  }

  /**
   * 查一个
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */

  async findOne({
    modelName,
    where = {},
    attributes = {},
    include = [],
    order = [],
  }) {
    return this.ctx.model[modelName].findOne({ where, include, attributes, order });
  }

  /**
   * 查所有
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(array)}       列表
   */

  async findAll({
    modelName,
    where = {},
    attributes = {},
    include = [],
    order = [],
  }) {
    return this.ctx.model[modelName].findAll({ where, attributes, include, order });
  }
  /**
   * 查或创建
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */

  async findOrCreate({
    modelName,
    where = {},
  }) {
    return this.ctx.model[modelName].findOrCreate({ where }).then(([ r ]) => r);
  }
  /**
   * 查后更新或创建
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */

  async findUpdateOrCreate({
    modelName,
    attributes = {},
    where = {},
  }) {
    return this.ctx.model[modelName].findOne({ where }).then(obj => {
      if (obj) {
        this.ctx.model[modelName].update(attributes, { where })
          .then(() => this.ctx.model[modelName].findOne({
            where,
          }));
      } else {
        this.ctx.mode[modelName].create({ where });
      }
    });
  }

  /**
   * 删除
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(number)}      变动行数
   */

  async destroy({
    modelName,
    where = {},
  }) {
    return this.ctx.model[modelName].destroy({ where });
  }

  allpage({ pageIndex = 1, pageSize = 20, array = [] }) {
    const offset = (pageIndex - 1) * pageSize;
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
  }

  /**
   * 存在
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(bool)}      bool
   */

  async findExists({ modelName, where = {} }) {
    return this.ctx.model[modelName].count({ where }).then(count => {
      if (count > 0) {
        return true;
      }
      return false;
    });
  }
}

module.exports = CommonService;
