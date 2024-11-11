import { getAxiosAdapter } from '../common/axios.service'
import type { GetDocenteParams } from './interfaces/get-docentes-params.interface'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { Docente, DocenteResponse } from './interfaces/docentes-response.interface'
import type { CreateDocente, UpdateDocente } from './interfaces/docentes-request.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetDocenteParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Docente>>(`/v1/admin/docente`, config)
}

export const create = async (
  createDocente: CreateDocente
) => {
  return await axiosAdapter.post<CreateDocente, DocenteResponse>(`/v1/admin/docente/register`, createDocente)
}

export const update = async (id: number, updateDocente: UpdateDocente) => {
  return await axiosAdapter.put<UpdateDocente, DocenteResponse>(`/v1/admin/docente/${id}`, updateDocente)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<DocenteResponse>(`/v1/admin/docente/${id}`)
}
