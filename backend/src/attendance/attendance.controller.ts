import { Controller, Get, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.checkIn(createAttendanceDto);
  }

  @Post('checkout') // 👈 This maps to: http://localhost:3000/attendance/checkout
  checkOut(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.checkOut(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }
}