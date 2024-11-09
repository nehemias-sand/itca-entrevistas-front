import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetDocenteParams extends PaginationParams {
  nombres_or_apellidos?: string
}
