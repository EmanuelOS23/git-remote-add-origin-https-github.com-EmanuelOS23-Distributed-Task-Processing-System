import { z } from 'zod';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { comparePassword } from '../../utils/bcrypt';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../presentation/middlewares/errorHandler';

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginUserDTO = z.infer<typeof loginUserSchema>;

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatch = await comparePassword(data.password, user.password);

    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({ userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
