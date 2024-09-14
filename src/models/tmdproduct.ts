import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tmdproduct {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'stock' })
  stock: number;

  @Column({ name: 'product_code' })
  productCode: string;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'created_by' })
  craetedBy: string;

  @Column({ name: 'created_date' })
  createdDate: Date;

  @Column({ name: 'modified_by' })
  modifiedBy: string;

  @Column({ name: 'modified_date' })
  modifiedDate: Date;
}
