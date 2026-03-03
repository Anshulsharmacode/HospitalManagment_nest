import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'REMOVED_HOST',
      port: 5432,
      username: 'postgres',
      password: 'REMOVED_PASSWORD',
      database: 'hospital',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
  ],
})
export class DataBaseModule {}
