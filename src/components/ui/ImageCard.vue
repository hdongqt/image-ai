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
    // eslint-disable-next-line vue/no-mutating-props
    props.image.isPublic = !props.image.isPublic
    pushToast(`Image is now ${props.image.isPublic ? 'public' : 'hidden'}`, 'success')
  } catch {
    pushToast('Failed to toggle visibility', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-lg transition-all hover:ring-2 hover:ring-emerald-400"
  >
    <Image
      :src="image.url"
      :alt="image.prompt"
      preview
      image-class="w-full h-full object-cover"
      class="h-full w-full"
      @show="isPreviewing = true"
      @hide="isPreviewing = false"
    />

    <!-- Visibility Badge -->
    <div class="absolute top-2 right-2 z-10">
      <span
        class="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-lg"
        :class="image.isPublic ? 'bg-emerald-500/80 text-white' : 'bg-slate-700/80 text-slate-300'"
      >
        {{ image.isPublic ? 'Public' : 'Hidden' }}
      </span>
    </div>

    <!-- Prompt Overlay (Optional) -->
    <div
      v-if="showPrompt"
      class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"
    >
      <p class="line-clamp-2 text-[10px] text-white">{{ image.prompt }}</p>
    </div>

    <!-- Floating Visibility Toggle for Preview Mode -->
    <Teleport to="body">
      <div
        v-if="isPreviewing"
        class="animate-fade-in fixed bottom-6 left-1/2 z-[10001] flex -translate-x-1/2 items-center gap-3"
      >
        <Button
          :icon="image.isPublic ? 'pi pi-eye-slash' : 'pi pi-eye'"
          :label="image.isPublic ? 'Hide Image' : 'Make Public'"
          :severity="image.isPublic ? 'secondary' : 'success'"
          :loading="loading"
          @click="handleToggleVisibility"
          class="border border-white/10 shadow-2xl backdrop-blur-md"
          rounded
        />
      </div>
    </Teleport>
  </div>
</template>
