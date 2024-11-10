import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { PaginationParams } from '../common/interfaces/pagination-params.interface'
import type { Pregunta } from './interface/pregunta-response.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: PaginationParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Pregunta>>(`/v1/admin/pregunta`, config)
}
