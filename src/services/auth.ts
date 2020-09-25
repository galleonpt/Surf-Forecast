import bcrypt from 'bcrypt';

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
}
