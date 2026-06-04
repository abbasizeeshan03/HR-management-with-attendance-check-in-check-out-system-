import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';


@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}


  findAll(): Promise<Attendance[]> {
    return this.attendanceRepo.find({ order: { checkIn: 'DESC' } });
  }

  findByUser(userId: number): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      where: { userId },
      order: { checkIn: 'DESC' },
    });
  }

 
  async checkIn(dto: CreateAttendanceDto): Promise<Attendance> {
    const { userId } = dto;

  
    const openShift = await this.attendanceRepo.findOne({
      where: {
        userId,
        checkOut: null,
      },
    });

    if (openShift) {
      throw new BadRequestException(
        'Employee is already checked in! Please check out first.',
      );
    }

  
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayCheckIn = await this.attendanceRepo.findOne({
      where: {
        userId,
        checkIn: Between(todayStart, todayEnd),
        checkOut: null,
      },
    });

    if (todayCheckIn) {
      throw new BadRequestException(
        'Employee has already checked in today!',
      );
    }

    const checkInTime = new Date();

    // Define late threshold (e.g., 9:00 AM)
    const expectedStartTime = new Date(checkInTime);
    expectedStartTime.setHours(9, 0, 0, 0);

    const isLate = checkInTime > expectedStartTime;
    const lateMinutes = isLate
      ? Math.floor((checkInTime.getTime() - expectedStartTime.getTime()) / (1000 * 60))
      : 0;

    const status = isLate ? 'late' : 'present';

    const attendance = this.attendanceRepo.create({
      userId,
      checkIn: checkInTime,
      checkOut: null,
      status,
      totalHours: 0,
      lateMinutes,
    });

    return this.attendanceRepo.save(attendance);
  }

  
  async checkOut(userId: number): Promise<Attendance> {
    const openShift = await this.attendanceRepo.findOne({
      where: {
        userId,
        checkOut: null,
      },
    });

    if (!openShift) {
      throw new BadRequestException(
        'No active check-in found! Please check in first.',
      );
    }

    const checkOutTime = new Date();
    openShift.checkOut = checkOutTime;

   
    const diffMs = checkOutTime.getTime() - openShift.checkIn!.getTime();
    const totalHours = diffMs / (1000 * 60 * 60);
    openShift.totalHours = Math.round(totalHours * 100) / 100; 

    openShift.status = openShift.status === 'late' ? 'late' : 'present';

    return this.attendanceRepo.save(openShift);
  }
}
