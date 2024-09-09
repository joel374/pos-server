import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DatabaseModule } from 'modules/databases/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ConfigModule } from 'modules/config/config.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '30d' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'auth/loginAccount',
        method: RequestMethod.POST,
      })
      .forRoutes(AuthController);
  }
}
