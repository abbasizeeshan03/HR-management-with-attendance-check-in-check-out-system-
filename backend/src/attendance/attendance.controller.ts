import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService:
AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return 
this.attendanceService.checkIn(createAttendanceDto);
  }
  
  @Post('checkout')
  checkOut(@Body() dto: { userId: number }) {
    return this.attendanceService.checkOut(dto.userId);
  }

 
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

 
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
  return 
this.attendanceService.findByUser(Number(userId));
 }
}
