import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetResultadoEntrevistaParams extends PaginationParams {
  id_ciclo?: number
}
