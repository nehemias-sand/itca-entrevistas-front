import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { CreateCiclo, UpdateCiclo } from './interfaces/ciclos-request.interface'
import type { Ciclo, CicloResponse } from './interfaces/ciclos-response.interface'
import type { GetCiclosParams } from './interfaces/get-ciclos-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetCiclosParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Ciclo>>(`/v1/ciclo`, config)
}

export const create = async (
  createCico: CreateCiclo 
) => {
  return await axiosAdapter.post<CreateCiclo, CicloResponse>(`/v1/admin/ciclo`, createCico)
}

export const update = async (id: number, updateCiclo: UpdateCiclo) => {
  return await axiosAdapter.put<UpdateCiclo, CicloResponse>(`/v1/admin/ciclo/${id}`, updateCiclo)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<CicloResponse>(`/v1/admin/ciclo/${id}`)
}
