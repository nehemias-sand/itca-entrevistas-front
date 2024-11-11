<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Button label="Agregar Docente" icon="pi pi-plus" @click="openNewDocenteDialog" />
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
      :value="docentes"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} docentes"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="carnet" header="Carnet" sortable></Column>
      <Column field="nombres" header="Nombres" sortable></Column>
      <Column field="apellidos" header="Apellidos" sortable></Column>
      <Column field="usuario.email" header="Email" sortable></Column>
      <Column field="cargo.nombre" header="Cargo" sortable></Column>
      <Column field="facultad.nombre" header="Facultad" sortable></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditDocenteDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeleteDocente(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="docenteDialog"
      :header="dialogMode === 'new' ? 'Nuevo Docente' : 'Editar Docente'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Información Personal</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="field">
            <label for="carnet" class="font-semibold block mb-2">Carnet</label>
            <InputText
              id="carnet"
              v-model.trim="docente.carnet"
              required
              autofocus
              :class="{ 'p-invalid': submitted && !docente.carnet }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.carnet">
              El carnet requerido.
            </small>
          </div>
          <div class="field">
            <label for="nombres" class="font-semibold block mb-2">Nombres</label>
            <InputText
              id="nombres"
              v-model.trim="docente.nombres"
              required
              autofocus
              :class="{ 'p-invalid': submitted && !docente.nombres }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.nombres">
              Los nombres son requeridos.
            </small>
          </div>
          <div class="field">
            <label for="apellidos" class="font-semibold block mb-2">Apellidos</label>
            <InputText
              id="apellidos"
              v-model.trim="docente.apellidos"
              required
              :class="{ 'p-invalid': submitted && !docente.apellidos }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.apellidos">
              Los apellidos son requeridos.
            </small>
          </div>
          <div class="field">
            <label for="email" class="font-semibold block mb-2">Correo Electrónico</label>
            <InputText
              id="email"
              v-model.trim="docente.email"
              required
              type="email"
              :class="{ 'p-invalid': submitted && !docente.email }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.email">
              El correo es requerido y debe ser válido.
            </small>
          </div>
        </div>

        <h2 class="text-xl font-bold mb-4">Información Académica</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label for="carrera" class="font-semibold block mb-2">Cargo</label>
            <Dropdown
              id="carrera"
              v-model="docente.id_cargo"
              :options="cargos"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione un cargo"
              :class="{ 'p-invalid': submitted && !docente.id_cargo }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.id_cargo">
              El cargo es requerido.
            </small>
          </div>
          <div class="field">
            <label for="facultad" class="font-semibold block mb-2">Facultad</label>
            <Dropdown
              id="facultad"
              v-model="docente.id_facultad"
              :options="facultades"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una facultad"
              :class="{ 'p-invalid': submitted && !docente.id_facultad }"
            />
            <small class="p-error block mt-1" v-if="submitted && !docente.id_facultad">
              La facultad es requerida.
            </small>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-primary"
            @click="saveDocente"
          />
        </div>
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { Cargo, Facultad } from '@/services/catalogo/interfaces/catalogos-response.interface'
import type { CreateDocente } from '@/services/docente/interfaces/docentes-request.interface'
import type { Docente } from '@/services/docente/interfaces/docentes-response.interface'
import type { GetDocenteParams } from '@/services/docente/interfaces/get-docentes-params.interface'
import * as docenteService from '@/services/docente/docente.service'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { onMounted, reactive, ref, watch } from 'vue'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { DataTablePageEvent } from 'primevue/datatable'

const toast = useToast()
const confirm = useConfirm()
const docentes = ref<Docente[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const docenteDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref('new')

const cargos = ref<Cargo[]>([])
const facultades = ref<Facultad[]>([])

const docente = reactive<CreateDocente>({
  id: 0,
  carnet: '',
  nombres: '',
  apellidos: '',
  email: '',
  id_cargo: 0,
  id_facultad: 0
})

const params = reactive<GetDocenteParams>({
  nombres_or_apellidos: '',
  paginate: true,
  page: 1,
  per_page: 5
})

const loadDocentes = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await docenteService.getAll(params)
    docentes.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los docentes',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params.nombres_or_apellidos,
  () => {
    loadDocentes()
  }
)

const loadCatalogos = async () => {
  try {
    cargos.value = (await catalogoService.getAllCargos()).data
    facultades.value = (await catalogoService.getAllFacultades()).data
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
  loadDocentes(event.page + 1)
}

const openNewDocenteDialog = () => {
  docente.id = 0
  docente.carnet = ''
  docente.nombres = ''
  docente.apellidos = ''
  docente.email = ''
  docente.id_cargo = 0
  docente.id_facultad = 0
  submitted.value = false
  docenteDialog.value = true
  dialogMode.value = 'new'
}

const openEditDocenteDialog = (data: Docente) => {
  docente.id = data.id
  docente.carnet = data.carnet
  docente.nombres = data.nombres
  docente.email = data.usuario.email
  docente.apellidos = data.apellidos
  docente.id_cargo = data.cargo.id
  docente.id_facultad = data.facultad.id
  docenteDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  docenteDialog.value = false
  submitted.value = false
}

const saveDocente = async () => {
  submitted.value = true

  if (
    docente.carnet &&
    docente.nombres &&
    docente.apellidos &&
    docente.email &&
    docente.id_cargo &&
    docente.id_facultad
  ) {
    try {
      if (dialogMode.value === 'new') {
        await docenteService.create(docente)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Docente creado',
          life: 3000
        })
      } else {
        await docenteService.update(docente.id, docente)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Docente actualizado',
          life: 3000
        })
      }
      docenteDialog.value = false
      loadDocentes()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el docente',
        life: 3000
      })
    }
  }
}

const confirmDeleteDocente = (data: Docente) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar este docente?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteDocente(data.id)
  })
}

const deleteDocente = async (id: number) => {
  try {
    await docenteService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Docente eliminado', life: 3000 })
    loadDocentes()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el docente',
      life: 3000
    })
  }
}

onMounted(() => {
  loadDocentes()
  loadCatalogos()
})
</script>

<style scoped></style>
