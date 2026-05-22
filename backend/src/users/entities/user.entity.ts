import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('users') // This creates a table named 'users' in PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: 'employee' }) // Access roles: 'admin' or 'employee'
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  // This links our user to their multiple check-in/out records
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}