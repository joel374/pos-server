import { IsNotEmpty } from 'class-validator';
export class RegisterAccountValidator {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  email: string;
}

export class LoginAccountValidator {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordValidator {
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  confirmPassword: string;
}
