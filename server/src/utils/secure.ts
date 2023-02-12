import bcrypt from "bcrypt";
import { v4 } from "uuid";

class Secure {
  static getUUID = () => {
    return v4();
  };

  static encryptToHash = async (plainText: string) => {
    return await bcrypt.hash(plainText, 10);
  };

  static compareHash = async (plainText: string, hashedText: string) => {
    const isSame = await bcrypt.compare(plainText, hashedText);
    return isSame;
  };
}

export default Secure;
