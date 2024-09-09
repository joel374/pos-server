import { HttpException } from '@nestjs/common';
// import { Pagination, PaginationOptions } from './pagination.helper';

export class Response {
  message: string;
  data: any;

  constructor(message: string, data: any) {
    this.message = message;
    this.data = data;
  }
}

export const response = (message: string, data: any = null) => new Response(message, data);

// export const responsePage = (results: any[], total: number, paginationOptions: PaginationOptions) => {
//   return new Pagination(results, total, paginationOptions);
// };

// export const responsePageEmpty = (paginationOptions: PaginationOptions) => {
//   return new Pagination([], 0, paginationOptions);
// };

export const responseError = (message: string, code: number = 400) => {
  return Promise.reject(new HttpException({ message: message }, code));
};

export const responseSF6 = (message: string, data: any = null, status: boolean) => {
  if (status === true) {
    return new Response(message, data);
  } else {
    if (message) {
      return Promise.reject(new HttpException({ message: message }, 422));
    } else {
      return Promise.reject(new HttpException({ message: 'Something when wrong' }, 422));
    }
  }
};
