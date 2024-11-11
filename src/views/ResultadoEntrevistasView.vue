<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <label for="ciclo" class="font-semibold">Ciclo:</label>
        <Dropdown
          id="ciclo"
          v-model="selectedCiclo"
          :options="ciclos"
          filter
          optionLabel="codigo"
          placeholder="Seleccione un ciclo"
          class="w-64"
          @change="loadResultados()"
        />
      </div>
      <Button
        label="Exportar a Excel"
        icon="pi pi-file-excel"
        @click="exportToExcel"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="resultados"
      :paginator="true"
      :rows="10"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} resultados"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="estudiante.nombre_completo" header="Estudiante" sortable></Column>
      <Column field="aprobada" header="Aprobada" sortable>
        <template #body="slotProps">
          <span :class="slotProps.data.aprobada ? 'text-green-600' : 'text-red-600'">
            {{ slotProps.data.aprobada ? 'Sí' : 'No' }}
          </span>
        </template>
      </Column>
      <Column field="ciclo.codigo" header="Ciclo" sortable></Column>
      <Column field="docente.nombre_completo" header="Docente" sortable></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-info mr-2"
            @click="openInterviewDetails(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="interviewDetailsVisible"
      :header="
        selectedInterview
          ? `Entrevista de ${selectedInterview.estudiante.nombre_completo}`
          : 'Detalles de la Entrevista'
      "
      :modal="true"
      :style="{ width: '70vw' }"
      :maximizable="true"
      class="p-fluid"
    >
      <div v-if="selectedInterview" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1 md:col-span-2 bg-gray-100 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Información General</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-medium text-gray-600">Estudiante:</p>
              <p>{{ selectedInterview.estudiante.nombre_completo }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-600">Docente:</p>
              <p>{{ selectedInterview.docente.nombre_completo }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-600">Aprobada:</p>
              <p :class="selectedInterview.aprobada ? 'text-green-600' : 'text-red-600'">
                {{ selectedInterview.aprobada ? 'Sí' : 'No' }}
              </p>
            </div>
            <div>
              <p class="font-medium text-gray-600">Carrera:</p>
              <p>{{ selectedInterview.carrera.nombre }}</p>
            </div>
          </div>
        </div>

        <div class="col-span-1 md:col-span-2">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Observaciones</h3>
          <p class="bg-gray-50 p-3 rounded-lg">{{ selectedInterview.observaciones }}</p>
        </div>

        <div class="col-span-1 md:col-span-2">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Preguntas y Respuestas</h3>
          <div
            v-for="pregunta in selectedInterview.preguntas"
            :key="pregunta.id"
            class="mb-4 bg-gray-50 p-4 rounded-lg"
          >
            <p class="font-medium text-gray-700 mb-1">{{ pregunta.enunciado }}</p>
            <p class="pl-4 border-l-2 border-gray-300">{{ pregunta.respuesta }}</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { type DataTablePageEvent } from 'primevue/datatable'
import * as entrevistaService from '@/services/entrevista/entrevista.service'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { Ciclo } from '@/services/ciclo/interfaces/ciclos-response.interface'
import type { ResultadoEntrevista } from '@/services/entrevista/interfaces/entrevista-response.interface'

const toast = useToast()

const resultados = ref<ResultadoEntrevista[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const ciclos = ref<Ciclo[]>([])
const selectedCiclo = ref<Ciclo | null>(null)
const interviewDetailsVisible = ref(false)
const selectedInterview = ref<ResultadoEntrevista | null>(null)

const loadResultados = async (page = 1) => {
  loading.value = true
  try {
    const response = await entrevistaService.getAllResultados({
      page,
      per_page: 10,
      id_ciclo: selectedCiclo.value?.id
    })
    resultados.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los resultados',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const onPage = (event: DataTablePageEvent) => {
  loadResultados(event.page + 1)
}

const loadCiclos = async () => {
  try {
    ciclos.value = (await catalogoService.getAllCiclos()).data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los ciclos',
      life: 3000
    })
  }
}

const openInterviewDetails = (interview: ResultadoEntrevista) => {
  selectedInterview.value = interview
  interviewDetailsVisible.value = true
}

const exportToExcel = async () => {
  try {
    const response = await entrevistaService.exportToExcel(selectedCiclo.value?.id)
    
    // Extract the base64 data from the response
    const base64Data = response.file.split(',')[1]

    // Convert base64 to blob
    const binaryString = window.atob(base64Data)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // Create and click download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'resultados_entrevistas.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.log(error);
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo exportar a Excel',
      life: 3000
    })
  }
}

onMounted(() => {
  loadCiclos()
  loadResultados()
})
</script>

<style scoped>
.p-dialog-content {
  padding: 0 !important;
}
</style>
