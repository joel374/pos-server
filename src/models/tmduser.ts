import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tmduser {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'profile_picture' })
  profilePicture: string;

  @Column({ name: 'role' })
  role: number;

  @Column({ name: 'created_by' })
  craetedBy: string;

  @Column({ name: 'created_date' })
  createdDate: Date;

  @Column({ name: 'modified_by' })
  modifiedBy: string;

  @Column({ name: 'modified_date' })
  modifiedDate: Date;
}
