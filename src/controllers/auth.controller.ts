import { Body, Controller, Post, Req } from '@nestjs/common';
import { Auth } from 'src/helpers/auth.helper';
import { responseError, response } from 'src/helpers/response.helper';
import { AuthService } from 'src/services/auth.service';
import {
  ChangePasswordValidator,
  LoginAccountValidator,
  RegisterAccountValidator,
} from 'src/validators/auth.validator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registerAccount')
  async registerAccount(@Req() req, @Body() body: RegisterAccountValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.authService.registerAccount(auth, body);
      return response(result.message, result.data);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('loginAccount')
  async loginAccount(@Req() req, @Body() body: LoginAccountValidator) {
    try {
      const result = await this.authService.loginAccount(body);
      return response(result.message, result.accessToken);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('changePassword')
  async changePassword(@Req() req, @Body() body: ChangePasswordValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.authService.changePassword(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }
}
