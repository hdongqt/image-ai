<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useImageStore } from '@/stores/images'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'

const imageStore = useImageStore()

onMounted(() => {
  imageStore.fetchTimeline(1, 12)
})

const onPage = (event: any) => {
  imageStore.fetchTimeline(event.page + 1, event.rows)
}

const columns = computed(() => {
  const cols: any[][] = [[], [], [], []]
  imageStore.timelineImages.forEach((img, index) => {
    const colIndex = index % 4
    cols[colIndex]!.push(img)
  })
  return cols
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4 bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Community Timeline
        </h1>
        <p class="text-slate-400">Explore the latest creations from our global community.</p>
      </div>

      <!-- Masonry Layout -->
      <div v-if="imageStore.loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Skeleton v-for="i in 12" :key="i" height="350px" class="rounded-2xl" />
      </div>
      
      <div v-else-if="imageStore.timelineImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="flex flex-col gap-6">
          <div v-for="image in col" :key="image.id" 
            class="rounded-2xl overflow-hidden group relative cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-colors duration-300">
            <img :src="image.url" :alt="`Creation by ${image.user.username}`"
              class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
            
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <div class="flex items-center gap-3 mb-3">
                <img v-if="image.user.avatarUrl" :src="image.user.avatarUrl" class="w-8 h-8 rounded-full border border-emerald-500/30" />
                <div v-else class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
                  {{ image.user.username[0].toUpperCase() }}
                </div>
                <span class="text-sm font-semibold">{{ image.user.username }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-300">{{ formatDate(image.createdAt) }}</span>
                <Button icon="pi pi-search" class="p-button-rounded p-button-text p-button-sm text-white hover:bg-emerald-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
        <i class="pi pi-images text-5xl text-slate-700 mb-4"></i>
        <p class="text-slate-500">No public creations yet. Be the first to create one!</p>
      </div>

      <!-- Pagination -->
      <div class="mt-16 flex justify-center">
        <Paginator 
          :rows="12" 
          :totalRecords="imageStore.total" 
          @page="onPage"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="bg-transparent border-none"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-paginator) {
  background: transparent;
  border: none;
}

:deep(.p-paginator-page),
:deep(.p-paginator-next),
:deep(.p-paginator-last),
:deep(.p-paginator-first),
:deep(.p-paginator-prev) {
  background: transparent;
  color: #94a3b8;
  border-radius: 50%;
  min-width: 2.5rem;
  height: 2.5rem;
  transition: all 0.2s;
}

:deep(.p-paginator-page.p-highlight) {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

:deep(.p-paginator-page:not(.p-highlight):hover) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}
</style>
