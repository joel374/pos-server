import { Injectable } from '@nestjs/common';
import { Auth } from 'src/helpers/auth.helper';
import {
  AddProductValidator,
  DeleteProductValidator,
  GetProductByCodeValidator,
  GetProductValidator,
  UpdateProductValidator,
} from 'src/validators/product.validator';
import { Tmdproduct } from 'src/models/tmdproduct';
import { PaginationOptions } from 'src/helpers/pagination.helper';

@Injectable()
export class ProductService {
  constructor() {}

  async getProduct(auth: Auth, pagination: PaginationOptions, params: GetProductValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const qProduct = queryRunner.manager.getRepository(Tmdproduct).createQueryBuilder('tmdproduct');

      if (params.search && params.search.trim() !== '') {
        qProduct.where('tmdproduct.productName LIKE :productName', { productName: `%${params.search}%` });
      }
      const result = await qProduct.skip(pagination.skip).take(pagination.limit).getManyAndCount();

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getProductByCode(auth: Auth, params: GetProductByCodeValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager
        .getRepository(Tmdproduct)
        .createQueryBuilder('tmdproduct')
        .where('tmdproduct.productCode = :productCode', { productCode: params.productCode })
        .getOne();

      if (!result) {
        throw new Error('Product not found. Please check the productCode and try again.');
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addProduct(auth: Auth, params: AddProductValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [productName, productCode] = await Promise.all([
        queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select('tmdproduct.productName')
          .where('tmdproduct.productName = :productName', { productName: params.productName })
          .getOne(),
        queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select('tmdproduct.productCode')
          .where('tmdproduct.productCode = :productCode', { productCode: params.productCode })
          .getOne(),
      ]);

      if (productName) {
        throw new Error('A product with this name already exists. Please add a product with a different name.');
      }

      if (productCode) {
        throw new Error('A product with this code already exists. Please add a product with a different code.');
      }

      await queryRunner.manager
        .getRepository(Tmdproduct)
        .createQueryBuilder('tmdproduct')
        .insert()
        .values({
          productName: params.productName,
          productCode: params.productCode,
          description: params.description,
          discounts: params.discounts,
          price: params.price,
          stock: params.stock,
          craetedBy: auth.userData.username,
          createdDate: new Date(),
          modifiedBy: auth.userData.username,
          modifiedDate: new Date(),
        })
        .execute();

      await queryRunner.commitTransaction();
      return {
        message: 'Product has been successfully added.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(auth: Auth, params: UpdateProductValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [productName, productCode] = await Promise.all([
        queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select('tmdproduct.productName')
          .where('tmdproduct.productName = :productName', { productName: params.productName })
          .andWhere('tmdproduct.productId != :productId', { productId: params.productId })
          .getOne(),
        queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select('tmdproduct.productCode')
          .where('tmdproduct.productCode = :productCode', { productCode: params.productCode })
          .andWhere('tmdproduct.productId != :productId', { productId: params.productId })
          .getOne(),
      ]);

      if (productName) {
        throw new Error('A product with this name already exists. Please update a product with a different name.');
      }

      if (productCode) {
        throw new Error('A product with this code already exists. Please update a product with a different code.');
      }

      await queryRunner.manager
        .getRepository(Tmdproduct)
        .createQueryBuilder('tmdproduct')
        .update()
        .where('tmdproduct.product_id = :productId', { productId: params.productId })
        .set({
          productName: params.productName,
          productCode: params.productCode,
          description: params.description,
          discounts: params.discounts,
          price: params.price,
          stock: params.stock,
          modifiedBy: auth.userData.username,
          modifiedDate: new Date(),
        })
        .execute();

      await queryRunner.commitTransaction();
      return {
        message: 'Product has been successfully updated.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(auth: Auth, params: DeleteProductValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productName = await queryRunner.manager
        .getRepository(Tmdproduct)
        .createQueryBuilder('tmdproduct')
        .select('tmdproduct.productId')
        .where('tmdproduct.productId = :productId', { productId: params.productId })
        .getOne();

      if (!productName) {
        throw new Error('Product not found. Please check the productId and try again.');
      }

      await queryRunner.manager
        .getRepository(Tmdproduct)
        .createQueryBuilder('tmdproduct')
        .delete()
        .where('tmdproduct.product_id = :productId', { productId: params.productId })
        .execute();

      await queryRunner.commitTransaction();
      return {
        message: 'Product has been successfully deleted.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
