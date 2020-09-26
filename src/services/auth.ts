import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
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

  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }
}
