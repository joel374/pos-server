import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Auth } from 'src/helpers/auth.helper';
import { createPaginationOptions } from 'src/helpers/pagination.helper';
import { response, responseError, responsePage } from 'src/helpers/response.helper';
import { TransactionService } from 'src/services/transaction.service';
import {
  CreateTransactionValidator,
  ReadTransactionValidator,
  UpdateTransactionValidator,
} from 'src/validators/transaction.validator';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Get('readTransaction')
  async readTransaction(@Req() req, @Query() query: ReadTransactionValidator) {
    try {
      const auth: Auth = req.auth;
      const pagination = createPaginationOptions(req);
      const result = await this.transactionService.readTransaction(auth, {
        search: query.search,
        limit: query.limit,
        page: query.page,
      });
      return responsePage(result.result, result.total, pagination);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('createTransaction')
  async createTransaction(@Req() req, @Body() body: CreateTransactionValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.transactionService.createTransaction(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Post('updateTransaction')
  async updateTransaction(@Req() req, @Body() body: UpdateTransactionValidator) {
    try {
      const auth: Auth = req.auth;
      const result = await this.transactionService.updateTransaction(auth, body);
      return response(result.message);
    } catch (error) {
      return responseError(error.message);
    }
  }
}
