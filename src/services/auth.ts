import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/user';

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(pw: string, salt = 10): Promise<string> {
    return await bcrypt.hash(pw, salt);
  }

  public static async comparePassword(
    pw: string,
    hashedPW: string
  ): Promise<boolean> {
    return await bcrypt.compare(pw, hashedPW);
  }

  /*eslint no-new: "error"*/
  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
  }
}
