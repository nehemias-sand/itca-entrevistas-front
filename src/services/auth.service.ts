import { getAxiosAdapter } from './axios-service'
import type { ChangePasswordRequest } from './interfaces/request/change-password-request.interface'
import type { LoginRequest } from './interfaces/request/login-request.interface'
import { type LoginResponse, type User } from './interfaces/response/login-response.interface'

const axiosAdapter = getAxiosAdapter()

export const login = async (loginRequest: LoginRequest) => {
  return await axiosAdapter.post<LoginRequest, LoginResponse>(`/v1/auth/login`, loginRequest)
}

export const changePassword = async (changePasswordRequest: ChangePasswordRequest) => {
  return await axiosAdapter.post<ChangePasswordRequest, User>(`/v1/user/change-password`, changePasswordRequest)
}
