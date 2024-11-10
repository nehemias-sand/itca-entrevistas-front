<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <Button label="Agregar Carrera" icon="pi pi-plus" @click="openNewCareerDialog" />
    </div>

    <div class="mb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="params.nombre" placeholder="Buscar por nombre" />
      </IconField>
    </div>

    <DataTable
      :value="careers"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} carreras"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="facultad.nombre" header="Facultad" sortable></Column>
      <Column header="Seguimientos">
        <template #body="slotProps">
          <div
            v-for="seguimiento in slotProps.data.seguimientos"
            :key="seguimiento.id"
            class="mb-1"
          >
            {{ seguimiento.jornada.nombre }} - {{ seguimiento.modalidad.nombre }} -
            {{ seguimiento.regional.nombre }}
          </div>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditCareerDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeleteCareer(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="careerDialog"
      :header="dialogMode === 'new' ? 'Nueva Carrera' : 'Editar Carrera'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field form-field">
          <label for="nombre" class="font-semibold">Nombre</label>
          <InputText
            id="nombre"
            v-model.trim="career.nombre"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !career.nombre }"
          />
          <small class="p-error" v-if="submitted && !career.nombre">El nombre es requerido.</small>
        </div>
        <div class="field form-field">
          <label for="facultad" class="font-semibold">Facultad</label>
          <Dropdown
            id="facultad"
            v-model="career.id_facultad"
            :options="facultades"
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccione una facultad"
            :class="{ 'p-invalid': submitted && !career.id_facultad }"
          />
          <small class="p-error" v-if="submitted && !career.id_facultad"
            >La facultad es requerida.</small
          >
        </div>
      </div>

      <h3 class="text-lg font-semibold mt-4 mb-2">Seguimientos</h3>
      <div
        v-for="(seguimiento, index) in career.seguimientos"
        :key="index"
        class="mb-4 p-4 border rounded-lg"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field form-field">
            <label :for="'jornada' + index" class="font-semibold">Jornada</label>
            <Dropdown
              :id="'jornada' + index"
              v-model="seguimiento.id_jornada"
              :options="jornadas"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una jornada"
            />
          </div>
          <div class="field form-field">
            <label :for="'modalidad' + index" class="font-semibold">Modalidad</label>
            <Dropdown
              :id="'modalidad' + index"
              v-model="seguimiento.id_modalidad"
              :options="modalidades"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una modalidad"
            />
          </div>
          <div class="field form-field">
            <label :for="'regional' + index" class="font-semibold">Regional</label>
            <Dropdown
              :id="'regional' + index"
              v-model="seguimiento.id_regional"
              :options="regionales"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una regional"
            />
          </div>
          <div class="field form-field">
            <label :for="'coordinador' + index" class="font-semibold">Coordinador</label>
            <Dropdown
              :id="'coordinador' + index"
              v-model="seguimiento.id_coordinador"
              :options="coordinadores"
              optionLabel="nombre_completo"
              optionValue="id"
              placeholder="Seleccione un coordinador"
              filter
            />
          </div>
        </div>
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger mt-2"
          @click="removeSeguimiento(index)"
        />
      </div>
      <Button label="Agregar Seguimiento" icon="pi pi-plus" class="mt-2" @click="addSeguimiento" />

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCareer" />
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import * as carreraService from '@/services/carrera/carrera.service'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { Carrera } from '@/services/carrera/interfaces/carreras-response.interface'
import type {
  Facultad,
  Jornada,
  Modalidad,
  Regional
} from '@/services/catalogo/interfaces/catalogos-response.interface'
import type { Docente } from '@/services/docente/interfaces/docentes-response.interface'
import type { CreateCarrera } from '@/services/carrera/interfaces/carreras-request.interface'
import type { GetCarrerasParams } from '@/services/carrera/interfaces/get-carreras-params.interface'
import type { DataTablePageEvent } from 'primevue/datatable'

const toast = useToast()
const confirm = useConfirm()

const careers = ref<Carrera[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const careerDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref<'new' | 'edit'>('new')

const facultades = ref<Facultad[]>([])
const jornadas = ref<Jornada[]>([])
const modalidades = ref<Modalidad[]>([])
const regionales = ref<Regional[]>([])
const coordinadores = ref<Docente[]>([])

const career = reactive<CreateCarrera>({
  id: 0,
  nombre: '',
  id_facultad: 0,
  seguimientos: []
})

const params = reactive<GetCarrerasParams>({
  nombre: '',
  paginate: true,
  page: 1,
  per_page: 10
})

const loadCareers = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await carreraService.getAll(params)
    careers.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar las carreras',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params.nombre,
  () => {
    loadCareers()
  }
)

const loadCatalogs = async () => {
  try {
    facultades.value = (await catalogoService.getAllFacultades()).data
    jornadas.value = (await catalogoService.getAllJornadas()).data
    modalidades.value = (await catalogoService.getAllModalidades()).data
    regionales.value = (await catalogoService.getAllRegionales()).data
    coordinadores.value = (await catalogoService.getAllDocentes()).data
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
  loadCareers(event.page + 1)
}

const openNewCareerDialog = () => {
  career.id = 0
  career.nombre = ''
  career.id_facultad = 0
  career.seguimientos = [{ id_jornada: 0, id_modalidad: 0, id_regional: 0, id_coordinador: 0 }]
  submitted.value = false
  careerDialog.value = true
  dialogMode.value = 'new'
}

const openEditCareerDialog = (data: Carrera) => {
  career.id = data.id
  career.nombre = data.nombre
  career.id_facultad = data.facultad.id
  career.seguimientos = data.seguimientos.map((s) => ({
    id_jornada: s.jornada.id,
    id_modalidad: s.modalidad.id,
    id_regional: s.regional.id,
    id_coordinador: s.coordinador.id
  }))
  careerDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  careerDialog.value = false
  submitted.value = false
}

const addSeguimiento = () => {
  career.seguimientos.push({ id_jornada: 0, id_modalidad: 0, id_regional: 0, id_coordinador: 0 })
}

const removeSeguimiento = (index: number) => {
  career.seguimientos.splice(index, 1)
}

const saveCareer = async () => {
  submitted.value = true

  if (career.nombre && career.id_facultad && career.seguimientos.length > 0) {
    try {
      if (dialogMode.value === 'new') {
        await carreraService.create(career)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Carrera creada', life: 3000 })
      } else {
        await carreraService.update(career.id, career)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Carrera actualizada',
          life: 3000
        })
      }
      careerDialog.value = false
      loadCareers()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar la carrera',
        life: 3000
      })
    }
  }
}

const confirmDeleteCareer = (data: Carrera) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar esta carrera?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteCareer(data.id)
  })
}

const deleteCareer = async (id: number) => {
  try {
    await carreraService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Carrera eliminada', life: 3000 })
    loadCareers()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar la carrera',
      life: 3000
    })
  }
}

onMounted(() => {
  loadCareers()
  loadCatalogs()
})
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
