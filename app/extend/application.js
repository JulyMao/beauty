'use strict';


module.exports = {
  /**
   * 子路由 /api
   */
  get apiRouter() {
    return this.router.namespace('/api');
  },

  /**
           * 生成jwt
           * @param {Int} id
           * @param {String} username
           */

  generateJWT(id, phone) {
    const { config } = this;
    const token = this.jwt.sign({ id, phone }, config.jwt.secret, {
      expiresIn: '2 days',
    });
    return token;
  },

  /**
           * 验证jwt
           * @param {Object} ctx
           */

  verifyToken(ctx) {
    const { config } = this;
    const token = config.jwt.getToken(ctx);
    if (!token) return null;
    return this.jwt.verify(token, config.jwt.secret);
  },
};
