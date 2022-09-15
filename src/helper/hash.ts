import * as bcrypt from 'bcrypt';

export default class Hash {
  static async hashString(str: string, saltOurRounds = 10) {
    return bcrypt.hash(str, saltOurRounds);
  }

  static async compare(str: string, hash) {
    return bcrypt.compare(str, hash);
  }
}
