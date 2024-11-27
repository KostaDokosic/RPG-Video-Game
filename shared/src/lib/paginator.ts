import { FindAndCountOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export class Paginator {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_PAGE = 1;

  static async paginate<T extends Model>(
    model: {
      findAndCountAll: (
        options: FindAndCountOptions
      ) => Promise<{ rows: T[]; count: number }>;
    },
    queryOptions: FindAndCountOptions = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    let { page = Paginator.DEFAULT_PAGE, limit = Paginator.DEFAULT_LIMIT } =
      paginationOptions;
    if (isNaN(page)) page = Paginator.DEFAULT_PAGE;
    if (isNaN(limit)) limit = Paginator.DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const { rows, count } = await model.findAndCountAll({
      ...queryOptions,
      limit,
      offset,
    });

    return {
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }
}
