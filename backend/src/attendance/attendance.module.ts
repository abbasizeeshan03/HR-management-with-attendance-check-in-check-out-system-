import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity'; // 👈 Import the User entity

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, User])], // 👈 Add User here!
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}