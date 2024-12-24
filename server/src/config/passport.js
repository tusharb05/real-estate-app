const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  console.log('\n\n\n\n\n\n\n\n');
  console.log(payload);
  console.log('\n\n\n\n\n\n\n\n');
  try {
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }
    const user = await User.findOne({ where: { id: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    // console.log('\n\n\n\n\n\n\n\n\n');
    // console.log(user);
    // console.log('\n\n\n\n\n\n\n\n\n');
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
