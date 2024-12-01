import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tdtransactiondetail {
  @PrimaryGeneratedColumn({ name: 'transaction_detail_id' })
  transactionDetailId: number;

  @Column({ name: 'transaction_id' })
  transactionId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ name: 'item_price' })
  itemPrice: number;
}
