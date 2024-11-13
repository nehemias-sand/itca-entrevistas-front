<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="field">
        <label for="estudiante" class="font-semibold">Estudiante</label>
        <Dropdown
          id="estudiante"
          v-model="selectedEstudiante"
          :options="estudiantes"
          optionLabel="nombre_completo"
          filter
          placeholder="Seleccione un estudiante"
          class="w-full"
          @change="onEstudianteChange"
        />
      </div>
      <div class="field" v-if="selectedEstudiante">
        <label for="ciclo" class="font-semibold">Ciclo</label>
        <Dropdown
          id="ciclo"
          v-model="selectedCiclo"
          :options="ciclos"
          optionLabel="codigo"
          placeholder="Seleccione un ciclo"
          class="w-full"
          @change="onCicloChange"
        />
      </div>
    </div>

    <div v-if="selectedEstudiante" class="mb-4 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        Información del Estudiante
      </h2>
      <div class="flex flex-wrap justify-start mb-4">
        <p class="w-full md:w-1/2 mb-2">
          <span class="font-semibold text-gray-700">Nombre:</span>
          {{ selectedEstudiante.nombre_completo }}
        </p>
        <p class="w-full md:w-1/2 mb-2">
          <span class="font-semibold text-gray-700">Correo:</span> {{ selectedEstudiante.correo }}
        </p>
      </div>
      <h3 class="text-lg font-semibold mb-3 text-gray-800">Carrera</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="seguimiento in selectedEstudiante.seguimientos_carrera"
          :key="seguimiento.id"
          class="bg-gray-50 p-4 rounded-md"
        >
          <h4 class="font-semibold text-md mb-2 text-gray-800">{{ seguimiento.carrera.nombre }}</h4>
          <p class="mb-1">
            <span class="font-medium text-gray-700">Jornada:</span> {{ seguimiento.jornada.nombre }}
          </p>
          <p class="mb-1">
            <span class="font-medium text-gray-700">Modalidad:</span>
            {{ seguimiento.modalidad.nombre }}
          </p>
          <p class="mb-1">
            <span class="font-medium text-gray-700">Regional:</span>
            {{ seguimiento.regional.nombre }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="selectedCiclo && selectedCiclo.catalogos.length > 0" class="mb-4">
      <label for="catalogo" class="font-semibold">Catálogo de Preguntas</label>
      <Dropdown
        id="catalogo"
        v-model="selectedCatalogo"
        :options="selectedCiclo.catalogos"
        optionLabel="nombre"
        placeholder="Seleccione un catálogo"
        class="w-full"
        @change="onCatalogoChange"
      />
    </div>

    <div v-if="selectedCatalogo" class="mb-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Preguntas</h2>
      <div
        v-for="pregunta in selectedCatalogo.preguntas"
        :key="pregunta.id"
        class="mb-4 p-4 bg-white rounded-lg shadow-sm"
      >
        <label :for="'pregunta-' + pregunta.id" class="font-semibold text-gray-700 block mb-2">
          {{ pregunta.enunciado }}
        </label>
        <InputText
          v-if="pregunta.tipo_respuesta.nombre === 'Abierta'"
          :id="'pregunta-' + pregunta.id"
          v-model="respuestas[pregunta.id]"
          class="w-full"
          :class="{ 'p-invalid': submitted && !respuestas[pregunta.id] }"
        />
        <Dropdown
          v-else
          :id="'pregunta-' + pregunta.id"
          v-model="respuestas[pregunta.id]"
          :options="['Sí', 'No']"
          placeholder="Seleccione una respuesta"
          class="w-full"
          :class="{ 'p-invalid': submitted && !respuestas[pregunta.id] }"
        />
        <small class="p-error block mt-1" v-if="submitted && !respuestas[pregunta.id]">
          Esta pregunta es requerida
        </small>
      </div>
    </div>

    <div class="mb-4">
      <label for="observaciones" class="font-semibold text-gray-700 block mb-2"
        >Observaciones</label
      >
      <Textarea
        id="observaciones"
        v-model="observaciones"
        rows="3"
        class="w-full"
        placeholder="Ingrese sus observaciones"
      />
    </div>

    <div class="mb-4">
      <label class="font-semibold flex items-center text-gray-700">
        <Checkbox v-model="aprobada" :binary="true" @change="aprobarEntrevista" />
        <span class="ml-2">Aprobada</span>
      </label>
    </div>

    <Dialog
      v-model:visible="showConfirmDialog"
      header="Confirmar"
      :style="{ width: '350px' }"
      :modal="true"
    >
      <p class="m-0">¿Está seguro de no aprobar al estudiante?</p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="cancelarAprobacion" class="p-button-text" />
        <Button label="Sí" icon="pi pi-check" @click="confirmarAprobacion" autofocus />
      </template>
    </Dialog>

    <Button
      label="Guardar Entrevista"
      icon="pi pi-check"
      @click="verificarGuardarEntrevista"
      class="p-button-primary"
      :disabled="!isFormValid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import type {
  CreateEntrevista,
  SeguimientosEntrevista
} from '@/services/entrevista/interfaces/entrevista-request.interface'
import * as entrevistaService from '@/services/entrevista/entrevista.service'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { Estudiante } from '@/services/estudiante/interfaces/estudiantes-response.interface'
import type {
  CatalogoPreguntaCiclo,
  Ciclo
} from '@/services/ciclo/interfaces/ciclos-response.interface'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const toast = useToast()

const estudiantes = ref<Estudiante[]>([])
const ciclos = ref<Ciclo[]>([])
const selectedEstudiante = ref<Estudiante | null>(null)
const selectedCiclo = ref<Ciclo | null>(null)
const selectedCatalogo = ref<CatalogoPreguntaCiclo | null>(null)
const respuestas = reactive<{ [key: string]: string }>({})
const observaciones = ref<string>('')
const aprobada = ref<boolean>(false)
const submitted = ref<boolean>(false)
const showConfirmDialog = ref<boolean>(false)

const aprobarEntrevista = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  if (!isChecked) {
    showConfirmDialog.value = true
  }
}

const cancelarAprobacion = () => {
  aprobada.value = true
  showConfirmDialog.value = false
}

const confirmarAprobacion = () => {
  aprobada.value = false
  showConfirmDialog.value = false
  guardarEntrevista()
}

const verificarGuardarEntrevista = () => {
  if (!aprobada.value) {
    showConfirmDialog.value = true
  } else {
    guardarEntrevista()
  }
}

const isFormValid = computed(() => {
  if (!selectedEstudiante.value || !selectedCiclo.value || !selectedCatalogo.value) {
    return false
  }
  return selectedCatalogo.value.preguntas.every((pregunta) => !!respuestas[pregunta.id])
})

onMounted(async () => {
  try {
    estudiantes.value = (await catalogoService.getAllEstudiantes()).data
    ciclos.value = (await catalogoService.getAllCiclos()).data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los datos iniciales',
      life: 3000
    })
  }
})

const onEstudianteChange = () => {
  selectedCiclo.value = null
  selectedCatalogo.value = null
  Object.keys(respuestas).forEach((key) => delete respuestas[key])
  submitted.value = false
}

const onCicloChange = () => {
  selectedCatalogo.value = null
  Object.keys(respuestas).forEach((key) => delete respuestas[key])
  submitted.value = false
}

const onCatalogoChange = () => {
  Object.keys(respuestas).forEach((key) => delete respuestas[key])
  submitted.value = false
}

const guardarEntrevista = async () => {
  submitted.value = true

  if (!isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Por favor, complete todos los campos requeridos',
      life: 3000
    })
    return
  }

  const seguimientos: SeguimientosEntrevista[] = selectedCatalogo.value!.preguntas.map(
    (pregunta) => ({
      id_pregunta: pregunta.id,
      respuesta: respuestas[pregunta.id]
    })
  )

  const entrevista: CreateEntrevista = {
    aprobada: aprobada.value,
    observaciones: observaciones.value,
    id_estudiante: selectedEstudiante.value!.id,
    id_ciclo: selectedCiclo.value!.id,
    id_catalogo: selectedCatalogo.value!.id,
    id_carrera: selectedEstudiante.value!.seguimientos_carrera[0].carrera.id,
    seguimientos: seguimientos
  }

  try {
    await entrevistaService.create(entrevista)
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Entrevista guardada correctamente',
      life: 3000
    })
    // Resetear el formulario
    selectedEstudiante.value = null
    selectedCiclo.value = null
    selectedCatalogo.value = null
    Object.keys(respuestas).forEach((key) => delete respuestas[key])
    observaciones.value = ''
    aprobada.value = false
    submitted.value = false
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la entrevista',
      life: 3000
    })
  }
}
</script>

<style scoped></style>
