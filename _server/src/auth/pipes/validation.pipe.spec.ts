import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { PipesModule } from './pipes.module';
import { AuthValidationPipe } from './validation.pipe';

describe('AuthValidationPipe', () => {
  let pipe: AuthValidationPipe;
  let registerDto: RegisterDto;
  let loginDto: LoginDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PipesModule],
    }).compile();

    pipe = module.get<AuthValidationPipe>(AuthValidationPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should validate input data', async () => {
    const input = { username: 'john', password: 'password' };
    const result = await pipe.transform(input);
    expect(result).toEqual(input);
  });

  it('should throw an error when input data is invalid', async () => {
    const input = { username: 'john', password: 12345 };
    await expect(pipe.transform(input)).rejects.toThrow();
  });
});
