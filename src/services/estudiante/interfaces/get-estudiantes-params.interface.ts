import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'

export interface GetEstudianteParams extends PaginationParams {
  nombres_or_apellidos?: string
}
