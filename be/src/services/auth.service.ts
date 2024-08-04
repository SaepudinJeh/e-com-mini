import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtUtils } from '../libs/utils/jwt.util';
import { Validation } from "../libs/validations/index.validation";
import { AuthValidation } from "../libs/validations/auth.validation";
import { UserLogin, UserRegister, UserType } from '../libs/types/user.type';

const prisma = new PrismaClient();

export class AuthService {
  async register(payload: UserType) {
    const validated = Validation.validate(AuthValidation.Register, payload);

    if(validated.email === "superadmin@mail.com") {
      validated.role = "admin";
    }

    console.log(validated);
    

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const { password, id,  ...user } = await prisma.user.create({
      data: {
        ...validated,
        password: hashedPassword,
      },
    });
    const token = JwtUtils.generateToken({email: user.email, role: user.role});
    return { token };
  }

  async login(payload: UserLogin) {
    const validated = Validation.validate(AuthValidation.Login, payload);

    const userData = await prisma.user.findUnique({ where: { email: validated.email } });
    if (!userData) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(validated.password, userData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = JwtUtils.generateToken({email: userData.email, role: userData.role});

    const { password, id,  createdAt, ...user } = userData

    return { user, token };
  }
}
