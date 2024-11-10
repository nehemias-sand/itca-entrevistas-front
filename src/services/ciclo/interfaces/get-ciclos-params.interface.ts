import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetCiclosParams extends PaginationParams {
  anio?: number
}
