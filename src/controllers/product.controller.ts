import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { Auth } from 'src/helpers/auth.helper';
import { createPaginationOptions } from 'src/helpers/pagination.helper';
import { responseError, response, responsePage } from 'src/helpers/response.helper';
import { ProductService } from 'src/services/product.service';
import {
  AddProductValidator,
  DeleteProductValidator,
  GetProductByCodeValidator,
  GetProductValidator,
  UpdateProductValidator,
} from 'src/validators/product.validator';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('getProduct')
  async getProduct(@Req() req, @Body() body: GetProductValidator) {
    try {
      const auth: Auth = req.auth;
      const pagination = createPaginationOptions(req);
      const [result, total] = await this.productService.getProduct(auth, pagination, body);
      return responsePage(result, total, pagination);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Get('getProductByCode')
  async getProductByCode(@Req() req, @Body() body: GetProductByCodeValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.productService.getProductByCode(auth, body);
      return response('Product found successfully.', result);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('addProduct')
  async addProduct(@Req() req, @Body() body: AddProductValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.productService.addProduct(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('updateProduct')
  async updateProduct(@Req() req, @Body() body: UpdateProductValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.productService.updateProduct(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Delete('deleteProduct')
  async deleteProduct(@Req() req, @Body() body: DeleteProductValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.productService.deleteProduct(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }
}
