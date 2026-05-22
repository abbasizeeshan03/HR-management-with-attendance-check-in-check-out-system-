import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',          // Your default PostgreSQL username
      password: 'zeeshan', // ⚠️ REPLACE THIS with your actual PostgreSQL password!
      database: 'hr_attendance_db',
      autoLoadEntities: true,
      synchronize: true,             // Automatically syncs database tables with your code
    }),
    UsersModule,
    AttendanceModule,
  ],
})
export class AppModule {}