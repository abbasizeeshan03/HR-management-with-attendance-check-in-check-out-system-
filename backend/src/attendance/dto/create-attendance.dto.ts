import { IsInt } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  userId: number;
}
