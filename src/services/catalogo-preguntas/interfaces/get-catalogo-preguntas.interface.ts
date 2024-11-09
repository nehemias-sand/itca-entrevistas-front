import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetCatalogoPreguntasParams extends PaginationParams {
  nombre?: string
}
