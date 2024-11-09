import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { Estudiante } from './interfaces/estudiantes-response.interface'
import type { GetEstudianteParams } from './interfaces/get-estudiantes-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetEstudianteParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Estudiante>>(`/v1/admin/estudiante`, config)
}
