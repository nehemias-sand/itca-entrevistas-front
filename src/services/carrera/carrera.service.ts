import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { CreateCarrera, UpdateCarrera } from './interfaces/carreras-request.interface'
import type { Carrera, CarreraResponse } from './interfaces/carreras-response.interface'
import type { GetCarrerasParams } from './interfaces/get-carreras-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetCarrerasParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Carrera>>(`/v1/admin/carrera`, config)
}

export const create = async (
  createCarrera: CreateCarrera
) => {
  return await axiosAdapter.post<CreateCarrera, CarreraResponse>(`/v1/admin/carrera`, createCarrera)
}

export const update = async (id: number, updateCarrera: UpdateCarrera) => {
  return await axiosAdapter.put<UpdateCarrera, CarreraResponse>(`/v1/admin/carrera/${id}`, updateCarrera)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<CarreraResponse>(`/v1/admin/carrera/${id}`)
}