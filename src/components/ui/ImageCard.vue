<script setup lang="ts">
import { ref } from 'vue'
import Image from 'primevue/image'
import Button from 'primevue/button'
import { toggleImageVisibility } from '@/api/images'
import { pushToast } from '@/composables/useToast'

const props = defineProps<{
    image: any
    showPrompt?: boolean
}>()

const isPreviewing = ref(false)
const loading = ref(false)

const handleToggleVisibility = async () => {
    loading.value = true
    try {
        await toggleImageVisibility(props.image.id)
        props.image.isPublic = !props.image.isPublic
        pushToast(`Image is now ${props.image.isPublic ? 'public' : 'hidden'}`, 'success')
    } catch (err: any) {
        pushToast('Failed to toggle visibility', 'error')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="group relative aspect-square bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-emerald-400 transition-all shadow-lg cursor-pointer">
        <Image 
            :src="image.url" 
            :alt="image.prompt" 
            preview
            image-class="w-full h-full object-cover" 
            class="w-full h-full"
            @show="isPreviewing = true"
            @hide="isPreviewing = false"
        />
        
        <!-- Visibility Badge -->
        <div class="absolute top-2 right-2 z-10">
            <span 
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg"
                :class="image.isPublic ? 'bg-emerald-500/80 text-white' : 'bg-slate-700/80 text-slate-300'"
            >
                {{ image.isPublic ? 'Public' : 'Hidden' }}
            </span>
        </div>

        <!-- Prompt Overlay (Optional) -->
        <div v-if="showPrompt" class="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p class="text-[10px] text-white line-clamp-2">{{ image.prompt }}</p>
        </div>

        <!-- Floating Visibility Toggle for Preview Mode -->
        <Teleport to="body">
            <div 
                v-if="isPreviewing" 
                class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-3 animate-fade-in"
            >
                <Button 
                    :icon="image.isPublic ? 'pi pi-eye-slash' : 'pi pi-eye'" 
                    :label="image.isPublic ? 'Hide Image' : 'Make Public'"
                    :severity="image.isPublic ? 'secondary' : 'success'"
                    :loading="loading"
                    @click="handleToggleVisibility"
                    class="shadow-2xl border border-white/10 backdrop-blur-md"
                    rounded
                />
            </div>
        </Teleport>
    </div>
</template>
