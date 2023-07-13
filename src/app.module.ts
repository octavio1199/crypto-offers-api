import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { config } from './shared/typeorm/db.config';
import { OfferModule } from './app/offer/offer.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, OfferModule],
      useFactory: (): DataSourceOptions => config,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
