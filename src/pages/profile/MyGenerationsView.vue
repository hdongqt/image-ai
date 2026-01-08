<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyImages } from '@/api/images'
import Button from 'primevue/button'
import ImageCard from '@/components/ui/ImageCard.vue'
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'
import { pushToast } from '@/composables/useToast'

const images = ref<any[]>([])
const loading = ref(true)

const totalRecords = ref(0)
const rows = ref(12)
const first = ref(0)
const currentPage = ref(1)

const loadImages = async (page: number = 1) => {
    loading.value = true
    try {
        const response = await getMyImages(page, rows.value)
        images.value = response.data
        totalRecords.value = response.meta.total
        currentPage.value = response.meta.page
    } catch (err: any) {
        console.error('Failed to load images:', err)
        pushToast('Failed to load images', 'error')
    } finally {
        loading.value = false
    }
}

const onPage = (event: any) => {
    first.value = event.first
    rows.value = event.rows
    const page = event.page + 1
    loadImages(page)
}

onMounted(() => {
    loadImages()
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                        <i class="pi pi-images text-emerald-400"></i>
                        My Generations
                    </h1>
                    <p class="text-slate-400 mt-2">View and manage all your AI generated images</p>
                </div>
            </div>

            <!-- Grid -->
            <div v-if="loading && images.length === 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div v-for="i in 12" :key="i" class="aspect-square">
                    <Skeleton width="100%" height="100%" class="rounded-lg" />
                </div>
            </div>

            <div v-else-if="images.length > 0" class="space-y-8">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <ImageCard 
                        v-for="image in images" 
                        :key="image.id"
                        :image="image"
                        show-prompt
                    />
                </div>

                <!-- Paginator -->
                <div class="flex justify-center mt-8">
                    <Paginator 
                        :first="first" 
                        :rows="rows" 
                        :totalRecords="totalRecords" 
                        @page="onPage"
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        class="bg-transparent border-none"
                    />
                </div>
            </div>

            <div v-else class="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <i class="pi pi-image text-7xl text-slate-800 mb-4"></i>
                <h3 class="text-xl font-semibold text-white">No generations yet</h3>
                <p class="text-slate-500 mt-2 mb-6">Start creating amazing AI art today!</p>
                <Button 
                    label="Generate Now" 
                    icon="pi pi-sparkles" 
                    @click="$router.push('/generate')"
                    class="p-button-lg"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-paginator) {
    background: transparent;
}

:deep(.p-paginator-page),
:deep(.p-paginator-next),
:deep(.p-paginator-last),
:deep(.p-paginator-prev),
:deep(.p-paginator-first) {
    color: #94a3b8;
    background: transparent;
    border-radius: 8px;
}

:deep(.p-paginator-page.p-highlight) {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
}

:deep(.p-paginator-page:not(.p-highlight):hover) {
    background: rgba(255, 255, 255, 0.05);
    color: white;
}
</style>
