import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { Ciclo } from './interfaces/ciclos-response.interface'
import type { GetCiclosParams } from './interfaces/get-ciclos-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetCiclosParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Ciclo>>(`/v1/ciclo`, config)
}

