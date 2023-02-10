import bcrypt from "bcrypt";

class Secure {
  static encryptToHash = async (plainText: string) => {
    return await bcrypt.hash(plainText, 10);
  };

  static compareHash = async (plainText: string, hashedText: string) => {
    return await bcrypt.compare(plainText, hashedText);
  };
}

export default Secure;
