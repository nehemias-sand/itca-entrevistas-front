import { getAxiosAdapter } from '../common/axios.service'
import { type RegisterAdmin, type UpdateUser, type User } from '../auth/interfaces/login-response.interface'
import type { PaginationParams } from '../common/interfaces/pagination-params.interface'
import type { ChangeEstadoResponse } from './interfaces/change-estado-response.interface'
import type { ApiPaginatedResponse } from '../common/interfaces/api-paginated-response.interface'

const axiosAdapter = getAxiosAdapter()

export const getAll = async (params: PaginationParams) => {
  const config = {
    params
  }

  return await axiosAdapter.get<ApiPaginatedResponse<User>>(`/v1/admin/user`, config)
}

export const registerAdmin = async (
  registerAdminRequest: RegisterAdmin
) => {
  return await axiosAdapter.post<RegisterAdmin, User>(`/v1/admin/user/register`, registerAdminRequest)
}

export const update = async (id: number, updateUser: UpdateUser) => {
  return await axiosAdapter.put<UpdateUser, User>(`/v1/admin/user/${id}`, updateUser)
}

export const changeEstado = async (id: number) => {
  return await axiosAdapter.put<{}, ChangeEstadoResponse>(`/v1/admin/user/change-estado/${id}`)
}
