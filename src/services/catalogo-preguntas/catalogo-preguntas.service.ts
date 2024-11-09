import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { CreateCatalogoPreguntas, UpdateCatalogoPreguntas } from './interfaces/catalogo-preguntas-request.interface'
import type { CatalogoPreguntas, CatalogoPreguntasResponse } from './interfaces/catalogo-preguntas-response.interface'
import type { GetCatalogoPreguntasParams } from './interfaces/get-catalogo-preguntas.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: GetCatalogoPreguntasParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<CatalogoPreguntas>>(
    `/v1/admin/catalogo-preguntas`,
    config
  )
}

export const create = async (
  createCarrera: CreateCatalogoPreguntas
) => {
  return await axiosAdapter.post<CreateCatalogoPreguntas, CatalogoPreguntasResponse>(`/v1/admin/catalogo-preguntas`, createCarrera)
}

export const update = async (id: number, updateCarrera: UpdateCatalogoPreguntas) => {
  return await axiosAdapter.put<UpdateCatalogoPreguntas, CatalogoPreguntasResponse>(`/v1/admin/catalogo-preguntas/${id}`, updateCarrera)
}

export const remove = async (id: number) => {
  return await axiosAdapter.delete<CatalogoPreguntasResponse>(`/v1/admin/catalogo-preguntas/${id}`)
}
