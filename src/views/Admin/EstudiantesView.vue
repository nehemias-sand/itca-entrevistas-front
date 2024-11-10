<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Button label="Agregar Estudiante" icon="pi pi-plus" @click="openNewEstudianteDialog" />
        <div class="flex items-center space-x-2">
          <FileUpload
            mode="basic"
            :customUpload="true"
            @uploader="importCSV"
            accept=".csv"
            :auto="true"
            chooseLabel="Importar CSV"
          />
          <Button label="Descargar Plantilla" icon="pi pi-download" @click="downloadCSVTemplate" class="p-button-secondary" />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="params.nombres_or_apellidos"
          placeholder="Buscar por nombre o apellido"
        />
      </IconField>
    </div>

    <DataTable
      :value="estudiantes"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} estudiantes"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="nombres" header="Nombres" sortable></Column>
      <Column field="apellidos" header="Apellidos" sortable></Column>
      <Column field="correo" header="Correo" sortable></Column>
      <Column header="Carreras">
        <template #body="slotProps">
          <div
            v-for="seguimiento in slotProps.data.seguimientos_carrera"
            :key="seguimiento.id"
            class="mb-1"
          >
            {{ seguimiento.carrera.nombre }}
          </div>
        </template>
      </Column>
      <Column header="Jornadas">
        <template #body="slotProps">
          <div
            v-for="seguimiento in slotProps.data.seguimientos_carrera"
            :key="seguimiento.id"
            class="mb-1"
          >
            {{ seguimiento.jornada.nombre }}
          </div>
        </template>
      </Column>
      <Column header="Modalidades">
        <template #body="slotProps">
          <div
            v-for="seguimiento in slotProps.data.seguimientos_carrera"
            :key="seguimiento.id"
            class="mb-1"
          >
            {{ seguimiento.modalidad.nombre }}
          </div>
        </template>
      </Column>
      <Column header="Regionales">
        <template #body="slotProps">
          <div
            v-for="seguimiento in slotProps.data.seguimientos_carrera"
            :key="seguimiento.id"
            class="mb-1"
          >
            {{ seguimiento.regional.nombre }}
          </div>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditEstudianteDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeleteEstudiante(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="estudianteDialog"
      :header="dialogMode === 'new' ? 'Nuevo Estudiante' : 'Editar Estudiante'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Información Personal</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="field">
            <label for="nombres" class="font-semibold block mb-2">Nombres</label>
            <InputText
              id="nombres"
              v-model.trim="estudiante.nombres"
              required
              autofocus
              :class="{ 'p-invalid': submitted && !estudiante.nombres }"
            />
            <small class="p-error block mt-1" v-if="submitted && !estudiante.nombres">
              Los nombres son requeridos.
            </small>
          </div>
          <div class="field">
            <label for="apellidos" class="font-semibold block mb-2">Apellidos</label>
            <InputText
              id="apellidos"
              v-model.trim="estudiante.apellidos"
              required
              :class="{ 'p-invalid': submitted && !estudiante.apellidos }"
            />
            <small class="p-error block mt-1" v-if="submitted && !estudiante.apellidos">
              Los apellidos son requeridos.
            </small>
          </div>
        </div>

        <div class="mb-6">
          <div class="field">
            <label for="correo" class="font-semibold block mb-2">Correo Electrónico</label>
            <InputText
              id="correo"
              v-model.trim="estudiante.correo"
              required
              type="email"
              :class="{ 'p-invalid': submitted && !estudiante.correo }"
            />
            <small class="p-error block mt-1" v-if="submitted && !estudiante.correo">
              El correo es requerido y debe ser válido.
            </small>
          </div>
        </div>

        <template v-if="dialogMode === 'new'">
          <h2 class="text-xl font-bold mb-4">Información Académica</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="carrera" class="font-semibold block mb-2">Carrera</label>
              <Dropdown
                id="carrera"
                v-model="estudiante.id_carrera"
                :options="carreras"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una carrera"
                :class="{ 'p-invalid': submitted && !estudiante.id_carrera }"
              />
              <small class="p-error block mt-1" v-if="submitted && !estudiante.id_carrera">
                La carrera es requerida.
              </small>
            </div>
            <div class="field">
              <label for="jornada" class="font-semibold block mb-2">Jornada</label>
              <Dropdown
                id="jornada"
                v-model="estudiante.id_jornada"
                :options="jornadas"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una jornada"
                :class="{ 'p-invalid': submitted && !estudiante.id_jornada }"
              />
              <small class="p-error block mt-1" v-if="submitted && !estudiante.id_jornada">
                La jornada es requerida.
              </small>
            </div>
            <div class="field">
              <label for="modalidad" class="font-semibold block mb-2">Modalidad</label>
              <Dropdown
                id="modalidad"
                v-model="estudiante.id_modalidad"
                :options="modalidades"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una modalidad"
                :class="{ 'p-invalid': submitted && !estudiante.id_modalidad }"
              />
              <small class="p-error block mt-1" v-if="submitted && !estudiante.id_modalidad">
                La modalidad es requerida.
              </small>
            </div>
            <div class="field">
              <label for="regional" class="font-semibold block mb-2">Regional</label>
              <Dropdown
                id="regional"
                v-model="estudiante.id_regional"
                :options="regionales"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una regional"
                :class="{ 'p-invalid': submitted && !estudiante.id_regional }"
              />
              <small class="p-error block mt-1" v-if="submitted && !estudiante.id_regional">
                La regional es requerida.
              </small>
            </div>
          </div>
        </template>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-primary"
            @click="saveEstudiante"
          />
        </div>
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { CreateEstudiate } from '@/services/estudiante/interfaces/estudiantes-request.interface'
import type { GetEstudianteParams } from '@/services/estudiante/interfaces/get-estudiantes-params.interface'
import { onMounted, reactive, ref, watch } from 'vue'
import * as estudianteService from '@/services/estudiante/estudiante.service'
import type { Estudiante } from '@/services/estudiante/interfaces/estudiantes-response.interface'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { Carrera } from '@/services/carrera/interfaces/carreras-response.interface'
import type {
  Jornada,
  Modalidad,
  Regional
} from '@/services/catalogo/interfaces/catalogos-response.interface'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { DataTablePageEvent } from 'primevue/datatable'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()

const estudiantes = ref<Estudiante[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const estudianteDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref('new')

const carreras = ref<Carrera[]>([])
const jornadas = ref<Jornada[]>([])
const modalidades = ref<Modalidad[]>([])
const regionales = ref<Regional[]>([])

const estudiante = reactive<CreateEstudiate>({
  id: 0,
  nombres: '',
  apellidos: '',
  correo: '',
  id_carrera: 0,
  id_jornada: 0,
  id_modalidad: 0,
  id_regional: 0
})

const params = reactive<GetEstudianteParams>({
  nombres_or_apellidos: '',
  paginate: true,
  page: 1,
  per_page: 5
})

const loadEstudiantes = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await estudianteService.getAll(params)
    estudiantes.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los estudiantes',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params.nombres_or_apellidos,
  () => {
    loadEstudiantes()
  }
)

const loadCatalogos = async () => {
  try {
    carreras.value = (await catalogoService.getAllCarreras()).data
    jornadas.value = (await catalogoService.getAllJornadas()).data
    modalidades.value = (await catalogoService.getAllModalidades()).data
    regionales.value = (await catalogoService.getAllRegionales()).data
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
  loadEstudiantes(event.page + 1)
}

const openNewEstudianteDialog = () => {
  estudiante.id = 0
  estudiante.nombres = ''
  estudiante.apellidos = ''
  estudiante.correo = ''
  estudiante.id_carrera = 0
  estudiante.id_jornada = 0
  estudiante.id_modalidad = 0
  estudiante.id_regional = 0
  submitted.value = false
  estudianteDialog.value = true
  dialogMode.value = 'new'
}

const openEditEstudianteDialog = (data: Estudiante) => {
  estudiante.id = data.id
  estudiante.nombres = data.nombres
  estudiante.apellidos = data.apellidos
  estudiante.correo = data.correo
  estudianteDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  estudianteDialog.value = false
  submitted.value = false
}

const saveEstudiante = async () => {
  submitted.value = true

  if (isFormValid()) {
    try {
      if (dialogMode.value === 'new') {
        await estudianteService.create(estudiante)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Estudiante creado',
          life: 3000
        })
      } else {
        await estudianteService.update(estudiante.id, estudiante)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Estudiante actualizado',
          life: 3000
        })
      }
      estudianteDialog.value = false
      loadEstudiantes()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el estudiante',
        life: 3000
      })
    }
  }
}

const isFormValid = () => {
  if (dialogMode.value === 'new') {
    return (
      estudiante.nombres &&
      estudiante.apellidos &&
      estudiante.correo &&
      estudiante.id_carrera &&
      estudiante.id_jornada &&
      estudiante.id_modalidad &&
      estudiante.id_regional
    )
  } else {
    return estudiante.nombres && estudiante.apellidos && estudiante.correo
  }
}

const confirmDeleteEstudiante = (data: Estudiante) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar este estudiante?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteEstudiante(data.id)
  })
}

const deleteEstudiante = async (id: number) => {
  try {
    await estudianteService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estudiante eliminado', life: 3000 })
    loadEstudiantes()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el estudiante',
      life: 3000
    })
  }
}

const importCSV = async (event: any) => {
  const file = event.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('estudiantes_csv', file)
    try {
      await estudianteService.importCSV(formData)
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estudiantes importados correctamente',
        life: 3000
      })
      loadEstudiantes()
    } catch (error) {
      console.log(error);
      
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron importar los estudiantes',
        life: 3000
      })
    }
  }
}

const downloadCSVTemplate = () => {
  const template = 'nombres,apellidos,correo,id_carrera,id_jornada,id_modalidad,id_regional\n'
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'estudiantes_csv.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

onMounted(() => {
  loadEstudiantes()
  loadCatalogos()
})
</script>

<style scoped></style>
