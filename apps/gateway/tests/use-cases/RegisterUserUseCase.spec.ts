import { UserRepository } from '../../../domain/repositories/UserRepository';
import { RegisterUserUseCase } from '../RegisterUserUseCase';

// Mock puro usando o Jest, demonstrando o isolamento do Banco de Dados
const mockUserRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  it('deve registrar um usuário com sucesso e realizar o hash da senha', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue({
      id: '123',
      name: 'Emanuel',
      email: 'teste@email.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await registerUserUseCase.execute({
      name: 'Emanuel',
      email: 'teste@email.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('id', '123');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('teste@email.com');
    expect(mockUserRepository.create).toHaveBeenCalled();
  });

  it('deve falhar se o e-mail já estiver em uso', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: '123',
      name: 'Emanuel',
      email: 'teste@email.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      registerUserUseCase.execute({
        name: 'Outro User',
        email: 'teste@email.com',
        password: 'password123',
      })
    ).rejects.toThrow('Email already in use');
  });
});
