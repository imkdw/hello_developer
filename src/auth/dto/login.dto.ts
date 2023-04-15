import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  email: string;

  @MinLength(10)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
  password: string;
}
