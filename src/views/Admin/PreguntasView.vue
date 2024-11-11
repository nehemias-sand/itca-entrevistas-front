<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <Button label="Agregar Pregunta" icon="pi pi-plus" @click="openNewPreguntaDialog" />
    </div>

    <DataTable
      :value="preguntas"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} preguntas"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="enunciado" header="Enunciado" sortable></Column>
      <Column field="tipo_respuesta.nombre" header="Tipo Respuesta" sortable></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditPreguntaDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeletePregunta(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="preguntaDialog"
      :header="dialogMode === 'new' ? 'Nueva Pregunta' : 'Editar Pregunta'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="enunciado" class="font-semibold block mb-2">Enunciado</label>
          <InputText
            id="enunciado"
            v-model.trim="pregunta.enunciado"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !pregunta.enunciado }"
          />
          <small class="p-error block mt-1" v-if="submitted && !pregunta.enunciado">
            El enunciado es requerido.
          </small>
        </div>
        <div class="field">
            <label for="tipoRespuesta" class="font-semibold block mb-2">Tipo de respuesta</label>
            <Dropdown
              id="tipoRespuesta"
              v-model="pregunta.id_tipo_respuesta"
              :options="tipoRespuesta"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione un tipo"
              :class="{ 'p-invalid': submitted && !pregunta.id_tipo_respuesta }"
            />
            <small class="p-error block mt-1" v-if="submitted && !pregunta.id_tipo_respuesta">
              El cargo es requerido.
            </small>
          </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="savePregunta" />
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { PaginationParams } from '@/services/common/interfaces/pagination-params.interface'
import type { CreatePregunta } from '@/services/pregunta/interface/pregunta-request.interface'
import type {
  Pregunta,
  TipoRespuesta
} from '@/services/pregunta/interface/pregunta-response.interface'
import * as preguntaService from '@/services/pregunta/pregunta.service'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { onMounted, reactive, watch } from 'vue'
import { ref } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

const preguntas = ref<Pregunta[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const preguntaDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref<'new' | 'edit'>('new')

const toast = useToast()
const confirm = useConfirm()

const tipoRespuesta = ref<TipoRespuesta[]>([])

const pregunta = reactive<CreatePregunta>({
  id: 0,
  enunciado: '',
  id_tipo_respuesta: 0
})

const params = reactive<PaginationParams>({
  paginate: true,
  page: 1,
  per_page: 10
})

const loadPreguntas = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await preguntaService.getAll(params)
    preguntas.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar las preguntas',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params,
  () => {
    loadPreguntas()
  }
)

const loadCatalogs = async () => {
  try {
    tipoRespuesta.value = (await catalogoService.getAllTiposRespuesta()).data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los catálogos',
      life: 3000
    })
  }
}

const onPage = (event: DataTablePageEvent) => {
  loadPreguntas(event.page + 1)
}

const openNewPreguntaDialog = () => {
  pregunta.id = 0
  pregunta.enunciado = ''
  pregunta.id_tipo_respuesta = 0
  submitted.value = false
  preguntaDialog.value = true
  dialogMode.value = 'new'
}

const openEditPreguntaDialog = (data: Pregunta) => {
  pregunta.id = data.id
  pregunta.enunciado = data.enunciado
  pregunta.id_tipo_respuesta = data.tipo_respuesta.id
  preguntaDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  preguntaDialog.value = false
  submitted.value = false
}

const savePregunta = async () => {
  submitted.value = true

  if (pregunta.enunciado && pregunta.id_tipo_respuesta) {
    try {
      if (dialogMode.value === 'new') {
        await preguntaService.create(pregunta)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pregunta creada', life: 3000 })
      } else {
        await preguntaService.update(pregunta.id, pregunta)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Pregunta actualizada',
          life: 3000
        })
      }
      preguntaDialog.value = false
      loadPreguntas()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar la pregunta',
        life: 3000
      })
    }
  }
}

const confirmDeletePregunta = (data: Pregunta) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar esta pregunta?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deletePregunta(data.id)
  })
}

const deletePregunta = async (id: number) => {
  try {
    await preguntaService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pregunta eliminada', life: 3000 })
    loadPreguntas()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar la pregunta',
      life: 3000
    })
  }
}

onMounted(() => {
  loadPreguntas()
  loadCatalogs()
})
</script>

<style scoped></style>
