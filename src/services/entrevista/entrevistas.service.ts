import { getAxiosAdapter } from '../common/axios.service'
import type { CreateEntrevista } from './interfaces/entrevista-request.interface'
import type { EntrevistaResponse } from './interfaces/entrevista-response.interface'

const axiosAdapter = getAxiosAdapter()

export const create = async (
  createEntrevista: CreateEntrevista
) => {
  return await axiosAdapter.post<CreateEntrevista, EntrevistaResponse>(`/v1/admin/catalogo-preguntas`, createEntrevista)
}
