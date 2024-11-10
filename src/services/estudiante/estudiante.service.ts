import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { CreateEstudiate, UpdateEstudiante } from './interfaces/estudiantes-request.interface'
import type { Estudiante, EstudianteResponse } from './interfaces/estudiantes-response.interface'
import type { GetEstudianteParams } from './interfaces/get-estudiantes-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetEstudianteParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<Estudiante>>(`/v1/estudiante`, config)
}

export const create = async (
  createEstudiante: CreateEstudiate
) => {
  return await axiosAdapter.post<CreateEstudiate, EstudianteResponse>(`/v1/admin/estudiante/register`, createEstudiante)
}

export const importCSV = async (
  formData: FormData
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  return await axiosAdapter.post<FormData, {}>(`/v1/admin/estudiante/import`, formData, config)
}

export const update = async (id: number, updateEstudiante: UpdateEstudiante) => {
  return await axiosAdapter.put<UpdateEstudiante, EstudianteResponse>(`/v1/admin/estudiante/${id}`, updateEstudiante)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<EstudianteResponse>(`/v1/admin/estudiante/${id}`)
}
