import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async checkIn(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // 1. Verify if the employee exists
    const user = await this.usersRepository.findOne({ where: { id: createAttendanceDto.userId } });
    if (!user) {
      throw new NotFoundException(`Employee with ID ${createAttendanceDto.userId} not found`);
    }

    // 2. SAFETY GUARD: Check if the employee is already checked in
    const activeCheckIn = await this.attendanceRepository.findOne({
      where: {
        user: { id: createAttendanceDto.userId },
        checkOut: IsNull(), // Looks for any open shift
      },
    });

    if (activeCheckIn) {
      throw new BadRequestException(`Employee is already checked in! Please check out first.`);
    }

    // 3. Create a new log entry if clear
    const log = this.attendanceRepository.create({
      user: user,
      checkIn: new Date(),
      status: 'Present',
    });

    return await this.attendanceRepository.save(log);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async checkOut(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // 1. Find the active check-in
    const activeLog = await this.attendanceRepository.findOne({
      where: {
        user: { id: createAttendanceDto.userId },
        checkOut: IsNull(),
      },
      order: { checkIn: 'DESC' },
    });

    if (!activeLog) {
      throw new NotFoundException(`No active check-in found for employee ID ${createAttendanceDto.userId}`);
    }

    // 2. Set the checkout timestamp
    const checkoutTime = new Date();
    activeLog.checkOut = checkoutTime;

    // 3. MATH TIME: Calculate time difference in hours
    const diffInMilliseconds = checkoutTime.getTime() - activeLog.checkIn.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Converts ms to decimal hours
    
    // Round it cleanly to 2 decimal places (e.g., 8.25 hours)
    activeLog.totalHours = Math.round(diffInHours * 100) / 100;

    // 4. Save and return updated log entry
    return await this.attendanceRepository.save(activeLog);
  }
}