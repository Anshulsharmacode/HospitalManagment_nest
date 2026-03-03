import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '13.235.234.7',
      port: 5432,
      username: 'postgres',
      password: 'anshul',
      database: 'hospital',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
  ],
})
export class DataBaseModule {}
