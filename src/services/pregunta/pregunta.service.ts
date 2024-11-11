import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { PaginationParams } from '../common/interfaces/pagination-params.interface'
import type { CreatePregunta, UpdatePregunta } from './interface/pregunta-request.interface'
import type { Pregunta, PreguntaResponse } from './interface/pregunta-response.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: PaginationParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Pregunta>>(`/v1/admin/pregunta`, config)
}

export const create = async (
  createPregunta: CreatePregunta
) => {
  return axiosAdapter.post<CreatePregunta, PreguntaResponse>(`/v1/admin/pregunta`, createPregunta)
}

export const update = async (id: number, updatePregunta: UpdatePregunta) => {
  return await axiosAdapter.put<UpdatePregunta, PreguntaResponse>(`/v1/admin/pregunta/${id}`, updatePregunta)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<PreguntaResponse>(`/v1/admin/pregunta/${id}`)
} 