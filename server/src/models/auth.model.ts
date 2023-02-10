import User from "../entity/user.entity";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";
import { connection } from "../db/db";

class AuthModel {
  static findUserByEmail = async (email: string) => {
    try {
      const userRepo = (await connection).getRepository(User);
      const user = userRepo.findOneBy({ email });
      return user;
    } catch (err: any) {
      throw err;
    }
  };

  static register = async (userDTO: RegisterUserDTO) => {
    try {
      const userRepo = (await connection).getRepository(User);
      const user = userRepo.create(userDTO);
      await userRepo.save(user);
    } catch (err: any) {
      throw err;
    }
  };
}

export default AuthModel;
