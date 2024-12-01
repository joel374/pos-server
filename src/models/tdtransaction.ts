import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tdtransaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  transactionId: number;

  @Column({ name: 'buyer' })
  buyer: number;

  @Column({ name: 'cashier' })
  cashier: number;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'total_quantity' })
  totalQuantity: number;

  @Column({ name: 'cancelled' })
  cancelled: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'notes' })
  notes: string;

  @Column({ name: 'created_by' })
  craetedBy: string;

  @Column({ name: 'created_date' })
  createdDate: Date;

  @Column({ name: 'modified_by' })
  modifiedBy: string;

  @Column({ name: 'modified_date' })
  modifiedDate: Date;
}
