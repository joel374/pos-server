import { Injectable } from '@nestjs/common';
import { Auth } from 'src/helpers/auth.helper';
import { Tdtransaction } from 'src/models/tdtransaction';
import { Tdtransactiondetail } from 'src/models/tdtransactiondetail';
import { Tmdproduct } from 'src/models/tmdproduct';
import { Tmduser } from 'src/models/tmduser';
import {
  CreateTransactionValidator,
  ReadTransactionValidator,
  UpdateTransactionValidator,
} from 'src/validators/transaction.validator';

@Injectable()
export class TransactionService {
  constructor() {}
  async readTransaction(auth: Auth, params: ReadTransactionValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const query = queryRunner.manager
        .getRepository(Tdtransaction)
        .createQueryBuilder('tdtransaction')
        .leftJoinAndMapMany(
          'tdtransaction.tdtransactiondetail',
          Tdtransactiondetail,
          'tdtransactiondetail',
          'tdtransaction.transactionId = tdtransactiondetail.transactionId',
        )
        .leftJoinAndMapOne(
          'tdtransactiondetail.tmdproduct',
          Tmdproduct,
          'tmdproduct',
          'tdtransactiondetail.productId = tmdproduct.productId',
        )
        .leftJoinAndMapOne(
          'tdtransactiondetail.cashiers',
          Tmduser,
          'cashiers',
          'tdtransaction.cashier = cashiers.userId',
        )
        .leftJoinAndMapOne('tdtransactiondetail.buyers', Tmduser, 'buyers', 'tdtransaction.buyer = buyers.userId')
        .select([
          'tdtransaction.buyer',
          'tdtransaction.cashier',
          'tdtransaction.totalAmount',
          'tdtransaction.date',
          'tdtransaction.notes',
          'tdtransaction.transactionId',
          'tdtransactiondetail.transactionDetailId',
          'tmdproduct.productName',
        ]);
      const result = await query
        .take(params.limit)
        .skip((params.page - 1) * params.limit)
        .getMany();
      const total = await query.getCount();
      await queryRunner.commitTransaction();
      return { result, total };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createTransaction(auth: Auth, params: CreateTransactionValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (auth.userData.role < 2) {
        throw new Error(`You can't add transaction`);
      }

      const transaction = await auth.conn
        .createQueryBuilder(Tdtransaction, 'tdtransaction')
        .select('max(tdtransaction.transactionId) as transactionId')
        .getRawOne();

      const transactionId = transaction.transactionId ? transaction.transactionId + 1 : 1;

      await queryRunner.manager
        .getRepository(Tdtransaction)
        .createQueryBuilder()
        .insert()
        .values({
          transactionId,
          buyer: params.buyer,
          cashier: params.cashier,
          notes: params.notes,
          totalAmount: params.totalAmount,
          totalQuantity: params.totalQuantity,
          date: new Date(),
          craetedBy: auth.userData.username,
          createdDate: new Date(),
          modifiedBy: auth.userData.username,
          modifiedDate: new Date(),
        })
        .execute();

      const productData = [];
      for (const product of params.productList) {
        const findProduct = await queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select(['tmdproduct.price', 'tmdproduct.discounts', 'tmdproduct.stock'])
          .where('tmdproduct.productId = :productId', { productId: product.productId })
          .getOne();

        productData.push({
          transactionId,
          productId: product.productId,
          itemPrice: findProduct.price,
          quantity: product.quantity,
          totalPrice: (findProduct.price - findProduct.discounts) * product.quantity,
        });

        await queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder()
          .update()
          .set({
            stock: findProduct.stock - product.quantity,
          })
          .where('product_id = :productId', { productId: product.productId })
          .execute();
      }

      await queryRunner.manager
        .getRepository(Tdtransactiondetail)
        .createQueryBuilder()
        .insert()
        .values(productData)
        .execute();

      await queryRunner.commitTransaction();
      return { message: 'Transaction has been successfully created.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTransaction(auth: Auth, params: UpdateTransactionValidator) {
    const queryRunner = auth.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (auth.userData.role < 2) {
        throw new Error(`You can't update transaction`);
      }
      console.log('updatenih');

      const [findProductDetail] = await Promise.all([
        queryRunner.manager
          .getRepository(Tdtransactiondetail)
          .createQueryBuilder('tdtransactiondetail')
          .select(['tdtransactiondetail.productId', 'tdtransactiondetail.quantity'])
          .where('tdtransactiondetail.transactionId = :transactionId', { transactionId: params.transactionId })
          .getMany(),
        queryRunner.manager
          .getRepository(Tdtransaction)
          .createQueryBuilder()
          .update()
          .set({
            buyer: params.buyer,
            cashier: auth.userData.userId,
            notes: params.notes,
            totalAmount: params.totalAmount,
            totalQuantity: params.totalQuantity,
            date: new Date(params.date),
            modifiedBy: auth.userData.username,
            modifiedDate: new Date(),
          })
          .where('transactionId = :transactionId', { transactionId: params.transactionId })
          .execute(),
        queryRunner.manager
          .getRepository(Tdtransactiondetail)
          .createQueryBuilder()
          .delete()
          .where('transactionId = :transactionId', { transactionId: params.transactionId })
          .execute(),
      ]);

      let index = 0;
      const productData = [];
      for (const product of params.productList) {
        const findProduct = await queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder('tmdproduct')
          .select(['tmdproduct.price', 'tmdproduct.discounts', 'tmdproduct.stock'])
          .where('tmdproduct.productId = :productId', { productId: product.productId })
          .getOne();

        productData.push({
          transactionId: params.transactionId,
          productId: product.productId,
          itemPrice: findProduct.price,
          quantity: product.quantity,
          totalPrice: (findProduct.price - findProduct.discounts) * product.quantity,
        });

        await queryRunner.manager
          .getRepository(Tmdproduct)
          .createQueryBuilder()
          .update()
          .set({
            stock: findProductDetail[index].quantity + findProduct.stock - product.quantity,
          })
          .where('product_id = :productId', { productId: product.productId })
          .execute();
        index++;
      }

      await queryRunner.manager
        .getRepository(Tdtransactiondetail)
        .createQueryBuilder()
        .insert()
        .values(productData)
        .execute();

      await queryRunner.commitTransaction();
      return { message: 'Transaction has been successfully updated.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
