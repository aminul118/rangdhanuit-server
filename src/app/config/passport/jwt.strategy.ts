import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import envVars from '../env';
import { User } from '../../modules/User/User.model';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envVars.JWT_ACCESS_SECRET,
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
