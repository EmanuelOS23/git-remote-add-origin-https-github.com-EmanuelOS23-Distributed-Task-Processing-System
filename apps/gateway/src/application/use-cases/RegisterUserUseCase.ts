import { z } from 'zod';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { hashPassword } from '../../utils/bcrypt';
import { AppError } from '../../presentation/middlewares/errorHandler';

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterUserDTO = z.infer<typeof registerUserSchema>;

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: RegisterUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
