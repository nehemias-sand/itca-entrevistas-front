import { getAxiosAdapter } from '../common/axios.service'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'
import type { CreateEntrevista } from './interfaces/entrevista-request.interface'
import type {
  EntrevistaResponse,
  ResultadoEntrevista
} from './interfaces/entrevista-response.interface'
import type { GetResultadoEntrevistaParams } from './interfaces/get-resultados-entrevista-params.interface'

const axiosAdapter = getAxiosAdapter()

export const getAllResultados = async (params: GetResultadoEntrevistaParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<ResultadoEntrevista>>(
    `/v1/entrevista/resultados`,
    config
  )
}

export const create = async (createEntrevista: CreateEntrevista) => {
  return await axiosAdapter.post<CreateEntrevista, EntrevistaResponse>(
    `/v1/docente/entrevista`,
    createEntrevista
  )
}

export const exportToExcel = async (idCiclo?: number) => {
  return await axiosAdapter.get<{ file: string }>(`/v1/entrevista/export`, {
    params: { id_ciclo: idCiclo },
    responseType: 'json'
  })
}
