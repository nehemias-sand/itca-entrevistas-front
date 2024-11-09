import { getAxiosAdapter } from '../common/axios.service'
import type { GetDocenteParams } from './interfaces/get-docentes-params.interface'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { Docente } from './interfaces/docentes-response.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetDocenteParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Docente>>(`/v1/admin/docente`, config)
}
