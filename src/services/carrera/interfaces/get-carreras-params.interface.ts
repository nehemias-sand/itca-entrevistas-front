import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetCarrerasParams extends PaginationParams {
  nombre?: string
}
