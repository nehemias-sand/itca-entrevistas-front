import { getAxiosAdapter } from '../common/axios.service'
import type { DocenteResponse } from '../docente/interfaces/docentes-response.interface'
import type { EstudianteResponse } from '../estudiante/interfaces/estudiantes-response.interface'
import type {
  CarreraCatalogoResponse,
  CicloResponse,
  FacultadResponse,
  JornadaResponse,
  ModalidadResponse,
  PreguntaResponse,
  RegionalResponse
} from './interfaces/catalogos-response.interface'

const axiosAdapter = getAxiosAdapter()

export const getAllFacultades = async () => {
  return await axiosAdapter.get<FacultadResponse>(`/v1/admin/catalogo/facultad`)
}

export const getAllJornadas = async () => {
  return await axiosAdapter.get<JornadaResponse>(`/v1/admin/catalogo/jornada`)
}

export const getAllModalidades = async () => {
  return await axiosAdapter.get<ModalidadResponse>(`/v1/admin/catalogo/modalidad`)
}

export const getAllRegionales = async () => {
  return await axiosAdapter.get<RegionalResponse>(`/v1/admin/catalogo/regional`)
}

export const getAllDocentes = async () => {
  return await axiosAdapter.get<DocenteResponse>(`/v1/admin/docente`, { params: { paginate: false } })
}

export const getAllPreguntas = async () => {
  return await axiosAdapter.get<PreguntaResponse>(`/v1/admin/pregunta`, { params: { paginate: false } })
}

export const getAllCiclos = async () => {
  return await axiosAdapter.get<CicloResponse>(`/v1/ciclo`, { params: { paginate: false } })
}

export const getAllEstudiantes = async () => {
  return await axiosAdapter.get<EstudianteResponse>(`/v1/estudiante`, { params: { paginate: false } })
}

export const getAllCarreras = async () => {
  return await axiosAdapter.get<CarreraCatalogoResponse>(`/v1/admin/carrera`, { params: { paginate: false } })
}