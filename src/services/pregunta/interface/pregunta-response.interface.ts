export interface PreguntaResponse {
  data: Pregunta[]
}

export interface Pregunta {
  id: number
  enunciado: string
  tipo_respuesta: TipoRespuesta
}

export interface TipoRespuesta {
  id: number
  nombre: string
}
