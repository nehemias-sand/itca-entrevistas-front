import type { Pregunta } from "@/services/pregunta/interface/pregunta-response.interface"

export interface CicloResponse {
  data: Ciclo[]
}

export interface Ciclo {
  id: number
  codigo: string
  anio: string
  numero: string
  catalogos: CatalogoPreguntaCiclo[]
}

export interface CatalogoPreguntaCiclo {
  id: number
  nombre: string
  preguntas: Pregunta[]
}