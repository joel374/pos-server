import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReadTransactionValidator {
  search: string;
  page: number;
  limit: number;
}

export class CreateTransactionValidator {
  @IsArray()
  productList: ProductList[];

  @IsOptional()
  buyer: number;

  @IsNumber()
  cashier: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  totalQuantity: number;

  @IsOptional()
  @IsString()
  notes: string;
}

export class UpdateTransactionValidator {
  @IsNumber()
  transactionId: number;

  @IsArray()
  productList: ProductList[];

  @IsOptional()
  buyer: number;

  @IsNumber()
  cashier: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  totalQuantity: number;

  @IsOptional()
  @IsString()
  notes: string;

  @IsString()
  date: string;
}

class ProductList {
  productId: number;
  quantity: number;
}
