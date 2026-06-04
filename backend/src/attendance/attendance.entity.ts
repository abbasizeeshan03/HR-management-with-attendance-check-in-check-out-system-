import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', nullable: true })
  checkIn: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date | null;

  @Column({ default: 'incomplete' })
  status: 'present' | 'late' | 'absent' | 'incomplete';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalHours: number;

  @Column({ type: 'int', default: 0 })
  lateMinutes: number;
}
