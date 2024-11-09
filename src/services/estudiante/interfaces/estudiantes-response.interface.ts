import type { Carrera } from '@/services/carrera/interfaces/carreras-response.interface'
import type {
  Jornada,
  Modalidad,
  Regional
} from '@/services/catalogo/interfaces/catalogos-response.interface'

export interface EstudianteResponse {
  data: Estudiante[]
}

export interface Estudiante {
  id: number
  nombres: string
  apellidos: string
  correo: string
  nombre_completo: string
  seguimientos_carrera: SeguimientosCarreraEstudiante[]
}

export interface SeguimientosCarreraEstudiante {
  id: number
  carrera: Omit<Carrera, 'facultad' | 'seguimientos'>
  jornada: Jornada
  modalidad: Modalidad
  regional: Regional
  evaluado: boolean
}
