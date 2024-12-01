import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from 'modules/config/config.module';
import { ConfigService } from 'modules/config/config.service';
import { Tdtransaction } from 'src/models/tdtransaction';
import { Tdtransactiondetail } from 'src/models/tdtransactiondetail';
import { Tmdproduct } from 'src/models/tmdproduct';
import { Tmduser } from 'src/models/tmduser';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
          type: configService.get('DB_TYPE') as any,
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT'), 10),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [Tmduser, Tmdproduct, Tdtransaction, Tdtransactiondetail],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
