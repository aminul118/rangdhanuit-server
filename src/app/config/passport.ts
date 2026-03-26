import passport from 'passport';
import { User } from '../modules/User/User.model';
import { jwtStrategy } from './passport/jwt.strategy';

passport.use(jwtStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
