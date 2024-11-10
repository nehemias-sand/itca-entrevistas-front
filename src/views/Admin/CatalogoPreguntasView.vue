<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <Button label="Agregar Catálogo" icon="pi pi-plus" @click="openNewCatalogDialog" />
    </div>

    <div class="mb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="params.nombre" placeholder="Buscar por nombre" />
      </IconField>
    </div>

    <DataTable
      :value="catalogs"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} catálogos"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="descripcion" header="Descripción" sortable></Column>
      <Column header="Cantidad Preguntas">
        <template #body="slotProps"> {{ slotProps.data.preguntas.length }} </template>
      </Column>
      <Column header="Cantidad Ciclos">
        <template #body="slotProps"> {{ slotProps.data.ciclos.length }} </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditCatalogDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeleteCatalog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="catalogDialog"
      :header="dialogMode === 'new' ? 'Nuevo Catálogo' : 'Editar Catálogo'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 gap-4">
        <div class="field form-field">
          <label for="nombre" class="font-semibold">Nombre</label>
          <InputText
            id="nombre"
            v-model.trim="catalog.nombre"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !catalog.nombre }"
          />
          <small class="p-error" v-if="submitted && !catalog.nombre">El nombre es requerido.</small>
        </div>
        <div class="field form-field">
          <label for="descripcion" class="font-semibold">Descripción</label>
          <Textarea
            id="descripcion"
            v-model.trim="catalog.descripcion"
            rows="3"
            :class="{ 'p-invalid': submitted && !catalog.descripcion }"
          />
          <small class="p-error" v-if="submitted && !catalog.descripcion"
            >La descripción es requerida.</small
          >
        </div>
        <div class="field form-field">
          <label for="preguntas" class="font-semibold">Preguntas</label>
          <MultiSelect
            id="preguntas"
            v-model="catalog.ids_pregunta"
            :options="preguntas"
            optionLabel="enunciado"
            optionValue="id"
            filter
            :maxSelectedLabels="1"
            placeholder="Seleccione las preguntas"
            :class="{ 'p-invalid': submitted && catalog.ids_pregunta.length === 0 }"
          />
          <small class="p-error" v-if="submitted && catalog.ids_pregunta.length === 0"
            >Seleccione al menos una pregunta.</small
          >
        </div>
        <div class="field form-field">
          <label for="ciclos" class="font-semibold">Ciclos</label>
          <MultiSelect
            id="ciclos"
            v-model="catalog.ids_ciclo"
            :options="ciclos"
            optionLabel="codigo"
            optionValue="id"
            filter
            :maxSelectedLabels="1"
            placeholder="Seleccione los ciclos"
            :class="{ 'p-invalid': submitted && catalog.ids_ciclo.length === 0 }"
          />
          <small class="p-error" v-if="submitted && catalog.ids_ciclo.length === 0"
            >Seleccione al menos un ciclo.</small
          >
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCatalog" />
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { DataTablePageEvent } from 'primevue/datatable'
import * as catalogoPreguntasService from '@/services/catalogo-preguntas/catalogo-preguntas.service'
import * as catalogoService from '@/services/catalogo/catalogo.service'
import type { CreateCatalogoPreguntas } from '@/services/catalogo-preguntas/interfaces/catalogo-preguntas-request.interface'
import type { CatalogoPreguntas } from '@/services/catalogo-preguntas/interfaces/catalogo-preguntas-response.interface'
import type { GetCatalogoPreguntasParams } from '@/services/catalogo-preguntas/interfaces/get-catalogo-preguntas.interface'
import type { Ciclo } from '@/services/ciclo/interfaces/ciclos-response.interface'
import type { Pregunta } from '@/services/pregunta/interface/pregunta-response.interface'

const toast = useToast()
const confirm = useConfirm()

const catalogs = ref<CatalogoPreguntas[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const catalogDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref<'new' | 'edit'>('new')

const preguntas = ref<Pregunta[]>([])
const ciclos = ref<Ciclo[]>([])

const catalog = reactive<CreateCatalogoPreguntas>({
  id: 0,
  nombre: '',
  descripcion: '',
  ids_pregunta: [],
  ids_ciclo: []
})

const params = reactive<GetCatalogoPreguntasParams>({
  nombre: '',
  paginate: true,
  page: 1,
  per_page: 10
})

const loadCatalogs = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await catalogoPreguntasService.getAll(params)
    catalogs.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los catálogos',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params.nombre,
  () => {
    loadCatalogs()
  }
)

const loadPreguntas = async () => {
  try {
    preguntas.value = (await catalogoService.getAllPreguntas()).data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar las preguntas',
      life: 3000
    })
  }
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

const onPage = (event: DataTablePageEvent) => {
  loadCatalogs(event.page + 1)
}

const openNewCatalogDialog = () => {
  catalog.id = 0
  catalog.nombre = ''
  catalog.descripcion = ''
  catalog.ids_pregunta = []
  catalog.ids_ciclo = []
  submitted.value = false
  catalogDialog.value = true
  dialogMode.value = 'new'
}

const openEditCatalogDialog = (data: CatalogoPreguntas) => {
  catalog.id = data.id
  catalog.nombre = data.nombre
  catalog.descripcion = data.descripcion
  catalog.ids_pregunta = data.preguntas.map((p) => p.id)
  catalog.ids_ciclo = data.ciclos.map((c) => c.id)
  catalogDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  catalogDialog.value = false
  submitted.value = false
}

const saveCatalog = async () => {
  submitted.value = true

  if (
    catalog.nombre &&
    catalog.descripcion &&
    catalog.ids_pregunta.length > 0 &&
    catalog.ids_ciclo.length > 0
  ) {
    try {
      if (dialogMode.value === 'new') {
        await catalogoPreguntasService.create(catalog)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Catálogo creado', life: 3000 })
      } else {
        await catalogoPreguntasService.update(catalog.id, catalog)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Catálogo actualizado',
          life: 3000
        })
      }
      catalogDialog.value = false
      loadCatalogs()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el catálogo',
        life: 3000
      })
    }
  }
}

const confirmDeleteCatalog = (data: CatalogoPreguntas) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar este catálogo?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteCatalog(data.id)
  })
}

const deleteCatalog = async (id: number) => {
  try {
    await catalogoPreguntasService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Catálogo eliminado', life: 3000 })
    loadCatalogs()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el catálogo',
      life: 3000
    })
  }
}

onMounted(() => {
  loadCatalogs()
  loadPreguntas()
  loadCiclos()
})
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
