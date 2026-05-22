import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('attendance_logs')
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number; // 👈 Added ! here

  @Column({ type: 'timestamp' })
  checkIn!: Date; // 👈 Added ! here

  @Column({ type: 'timestamp', nullable: true })
  checkOut!: Date | null; // 👈 Added ! and | null here

  @Column({ default: 'Present' })
  status!: string; // 👈 Added ! here

  // New column for storing calculated work duration
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalHours!: number | null; // 👈 Added ! and | null here

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User; // 👈 Added ! here
}