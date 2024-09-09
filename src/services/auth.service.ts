import { Injectable } from '@nestjs/common';
import { Tmduser } from 'src/models/tmduser';
import {
  ChangePasswordValidator,
  LoginAccountValidator,
  RegisterAccountValidator,
} from 'src/validators/auth.validator';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth, getAuth } from 'src/helpers/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly conn: Connection,
    private jwtService: JwtService,
  ) {}
  async registerAccount(auth: Auth, params: RegisterAccountValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findEmail = await queryRunner.manager
        .getRepository(Tmduser)
        .createQueryBuilder('tmduser')
        .select(['tmduser.email'])
        .where('tmduser.email = :email', { email: params.email })
        .getOne();

      if (findEmail) {
        throw new Error('Email has been registered');
      }

      const password = await this.generateTempPassword(12);
      const hashPassword = await bcrypt.hash(password, 10);

      await queryRunner.manager
        .getRepository(Tmduser)
        .createQueryBuilder('tmduser')
        .insert()
        .values({
          username: params.username,
          email: params.email,
          password: hashPassword,
          craetedBy: auth.userData.username,
          createdDate: new Date(),
          modifiedBy: auth.userData.username,
          modifiedDate: new Date(),
        })
        .execute();

      await queryRunner.commitTransaction();
      return {
        message: 'Succesfully create account',
        data: {
          email: params.email,
          password: password,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async loginAccount(params: LoginAccountValidator) {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findAccount = await queryRunner.manager
        .getRepository(Tmduser)
        .createQueryBuilder('tmduser')
        .select(['tmduser.email', 'tmduser.userId', 'tmduser.password'])
        .where('tmduser.email = :email', { email: params.email })
        .getOne();

      if (!findAccount) {
        throw new Error('Sorry, your email is not found');
      }

      const checkPassword = await bcrypt.compare(params.password, findAccount.password);
      if (!checkPassword) {
        throw new Error('Your Email or Password is wrong');
      }

      await getAuth(findAccount.userId);
      return {
        message: 'Login Success',
        accessToken: await this.jwtService.signAsync({ userId: findAccount.userId }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async changePassword(auth: Auth, params: ChangePasswordValidator) {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findAccount = await queryRunner.manager
        .getRepository(Tmduser)
        .createQueryBuilder('tmduser')
        .where('tmduser.userId = :userId', { userId: auth.userData.userId })
        .getOne();

      const [checkOldPassword, checkNewPassword] = await Promise.all([
        bcrypt.compare(params.oldPassword, findAccount.password),
        bcrypt.compare(params.newPassword, findAccount.password),
      ]);
      if (!checkOldPassword) {
        throw new Error('Your Old Password is wrong');
      }

      if (checkNewPassword) {
        throw new Error(`Your New Password has been used`);
      }

      if (params.newPassword !== params.confirmPassword) {
        throw new Error(`Your New Password doesn't match`);
      }

      const hashPassword = await bcrypt.hash(params.confirmPassword, 10);
      await queryRunner.manager
        .getRepository(Tmduser)
        .createQueryBuilder('tmduser')
        .update()
        .where('tmduser.user_id = :userId', { userId: auth.userData.userId })
        .set({
          password: hashPassword,
          modifiedBy: auth.userData.username,
          modifiedDate: new Date(),
        })
        .execute();

      return {
        message: 'Sucess Change Password, please relogin',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async generateTempPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    return password;
  }
}
