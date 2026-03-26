import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: Secret,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};
