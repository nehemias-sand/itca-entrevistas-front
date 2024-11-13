<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <Button label="Agregar Ciclo" icon="pi pi-plus" @click="openNewCicloDialog" />
    </div>

    <div class="mb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="params.codigo" placeholder="Buscar por código" />
      </IconField>
    </div>

    <DataTable
      :value="ciclos"
      :paginator="true"
      :rows="params.per_page"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ciclos"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="codigo" header="Código" sortable></Column>
      <Column field="anio" header="Año" sortable></Column>
      <Column field="num" header="Número" sortable></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="openEditCicloDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDeleteCiclo(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="cicloDialog"
      :header="dialogMode === 'new' ? 'Nuevo Ciclo' : 'Editar Ciclo'"
      :modal="true"
      :style="{ width: '50rem' }"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="anio" class="font-semibold block mb-2">Año</label>
          <InputNumber
            id="anio"
            v-model.trim="ciclo.anio"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !ciclo.anio }"
          />
          <small class="p-error block mt-1" v-if="submitted && !ciclo.anio">
            El año es requerido.
          </small>
        </div>
        <div class="field">
          <label for="num" class="font-semibold block mb-2">Número</label>
          <InputNumber
            id="num"
            v-model.trim="ciclo.num"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !ciclo.num }"
          />
          <small class="p-error block mt-1" v-if="submitted && !ciclo.num">
            El número de ciclo es requerido.
          </small>
        </div>
        <div class="field">
          <label for="codigo" class="font-semibold block mb-2">Código</label>
          <InputText
            id="codigo"
            v-model.trim="ciclo.codigo"
            required
            autofocus
            :class="{ 'p-invalid': submitted && !ciclo.codigo }"
          />
          <small class="p-error block mt-1" v-if="submitted && !ciclo.codigo">
            El código es requerido.
          </small>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCiclo" />
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { Ciclo } from '../../services/ciclo/interfaces/ciclos-response.interface'
import { onMounted, reactive, ref, watch } from 'vue'
import type { CreateCiclo } from '../../services/ciclo/interfaces/ciclos-request.interface'
import type { GetCiclosParams } from '../../services/ciclo/interfaces/get-ciclos-params.interface'
import * as cicloService from '@/services/ciclo/ciclo.service'
import type { DataTablePageEvent } from 'primevue/datatable'

const toast = useToast()
const confirm = useConfirm()

const ciclos = ref<Ciclo[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const cicloDialog = ref(false)
const submitted = ref(false)
const dialogMode = ref('new')

const ciclo = reactive<CreateCiclo>({
  id: 0,
  anio: 0,
  num: 0,
  codigo: ''
})

const params = reactive<GetCiclosParams>({
  codigo: '',
  paginate: true,
  page: 1,
  per_page: 5
})

const loadCiclos = async (page = 1) => {
  loading.value = true
  params.page = page

  try {
    const response = await cicloService.getAll(params)
    ciclos.value = response.data
    totalRecords.value = response.meta.total
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los ciclos',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => params.codigo,
  () => {
    loadCiclos()
  }
)

const onPage = (event: DataTablePageEvent) => {
  loadCiclos(event.page + 1)
}

const openNewCicloDialog = () => {
  ciclo.id = 0
  ciclo.anio = 0
  ciclo.num = 0
  ciclo.codigo = ''
  submitted.value = false
  cicloDialog.value = true
  dialogMode.value = 'new'
}

const openEditCicloDialog = (data: Ciclo) => {
  ciclo.id = data.id
  ciclo.anio = data.anio
  ciclo.num = data.num
  ciclo.codigo = data.codigo
  cicloDialog.value = true
  dialogMode.value = 'edit'
}

const hideDialog = () => {
  cicloDialog.value = false
  submitted.value = false
}

const saveCiclo = async () => {
  submitted.value = true

  if (ciclo.anio && ciclo.codigo && ciclo.num) {
    try {
      if (dialogMode.value === 'new') {
        await cicloService.create(ciclo)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Ciclo creado',
          life: 3000
        })
      } else {
        await cicloService.update(ciclo.id, ciclo)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Ciclo actualizado',
          life: 3000
        })
      }
      cicloDialog.value = false
      loadCiclos()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el ciclo',
        life: 3000
      })
    }
  }
}

const confirmDeleteCiclo = (data: Ciclo) => {
  confirm.require({
    message: '¿Está seguro que desea eliminar este ciclo?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteCiclo(data.id)
  })
}

const deleteCiclo = async (id: number) => {
  try {
    await cicloService.remove(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estudiante ciclo', life: 3000 })
    loadCiclos()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el ciclo',
      life: 3000
    })
  }
}

onMounted(() => {
  loadCiclos()
})
</script>

<style scoped></style>
