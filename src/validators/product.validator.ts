import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddProductValidator {
  @IsNotEmpty()
  productName: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
  @IsNotEmpty()
  @IsString()
  productCode: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateProductValidator {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsNotEmpty()
  productName: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
  @IsNotEmpty()
  @IsString()
  productCode: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class DeleteProductValidator {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

export class GetProductValidator {
  @IsOptional()
  @IsString()
  search: string;
}

export class GetProductByCodeValidator {
  @IsNotEmpty()
  @IsString()
  productCode: string;
}
