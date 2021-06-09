'use strict';

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

module.exports = app => {
  const {
    passport,
    config,
  } = app;

  // passport-local
  passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'account',
    passwordField: 'password',
  }, (ctx, account, password, done) => {
    const profile = {
      provider: 'local',
      account,
      password,
    };
    passport.doVerify(ctx, profile, done);
  }));

  // passport-jwt
  passport.use(new JwtStrategy({
    passReqToCallback: true,
    secretOrKey: config.jwt.secret,
    jwtFromRequest({
      ctx,
    }) {
      let token = '';
      if (ctx.headers.authorization &&
        ctx.headers.authorization.split(' ')[0] === 'Bearer') {
        token = ctx.headers.authorization.split(' ')[1];
      } else if (ctx.query.accesstoken) {
        token = ctx.query.accesstoken;
      } else if (ctx.request.body.accesstoken) {
        token = ctx.request.body.accesstoken;
      } else if (ctx.isAuthenticated() && ctx.user) {
        token = ctx.user.token;
      }
      return token;
    },
  }, (ctx, payload, done) => {
    payload.provider = 'jwt';
    passport.doVerify(ctx, payload, done);
  }));

  // 校验用户
  passport.verify(async (ctx, profile, done) => {
    let user;
    switch (profile.provider) {
      case 'local':
        const {
          account,
          password,
        } = profile;
        user = await ctx.service.user.verify(account, password);
        if (!user) return;
        user.token = ctx.app.generateJWT(user.id, user.phone);
        break;
      case 'jwt':
        const {
          id,
        } = profile;
        user = await ctx.service.user.getUserByID(id);
        break;
    }

    return user;
  });

  // 序列化用户信息到 Session
  passport.serializeUser(async (ctx, user) => {
    const {
      id,
      username,
      token,
    } = user;
    return {
      id,
      username,
      token,
    };
  });
};
