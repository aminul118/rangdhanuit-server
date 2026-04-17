/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { User } from '../modules/User/User.model';
import { IUser } from '../modules/User/User.interface';
import { jwtStrategy } from './passport/jwt.strategy';

passport.use(jwtStrategy);

passport.serializeUser((user: Partial<IUser>, done) => {
  done(null, (user as any)._id);
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
