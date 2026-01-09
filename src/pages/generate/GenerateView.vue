<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import Card from 'primevue/card'
import Slider from 'primevue/slider'
import Dialog from 'primevue/dialog'
import { generateImage } from '@/api/ai'
import { saveImage } from '@/api/images'
import { pushToast } from '@/composables/useToast'

const prompt = ref('')
const aspectRatio = ref('1:1')
const aspectOptions = ref(['1:1', '4:3', '16:9', '9:16'])
const guidanceScale = ref(7.5)
const isGenerating = ref(false)
const generatedImage = ref<string | null>(null)
const showSaveDialog = ref(false)
const isSaving = ref(false)

// Calculate dimensions based on aspect ratio
const dimensions = computed(() => {
  const ratios: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1024, height: 1024 },
    '4:3': { width: 1024, height: 768 },
    '16:9': { width: 1024, height: 576 },
    '9:16': { width: 576, height: 1024 },
  }
  return ratios[aspectRatio.value] ?? ratios['1:1']
})

const handleGenerate = async () => {
  if (!prompt.value.trim()) {
    pushToast({ severity: 'error', summary: 'Error', detail: 'Please enter a prompt' })
    return
  }

  isGenerating.value = true
  generatedImage.value = null

  try {
    const dims = dimensions.value!
    const result = await generateImage({
      prompt: prompt.value,
      width: dims.width,
      height: dims.height,
      scale: guidanceScale.value,
    })

    // Backend now returns base64 data URL directly
    generatedImage.value = result.imageUrl
    pushToast({ severity: 'success', summary: 'Success', detail: 'Image generated successfully!' })
  } catch (error: any) {
    console.error('Generation error:', error)
    pushToast({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to generate image',
    })
  } finally {
    isGenerating.value = false
  }
}

const handleDownload = () => {
  if (!generatedImage.value) return

  const link = document.createElement('a')
  link.href = generatedImage.value
  link.download = `generated-${Date.now()}.png`
  link.click()
}

const handleSaveToLibrary = () => {
  showSaveDialog.value = true
}

const confirmSave = async (isPublic: boolean) => {
  if (!generatedImage.value) return

  isSaving.value = true
  try {
    // Convert base64 to File
    const base64Data = generatedImage.value
    const blob = await fetch(base64Data).then((r) => r.blob())
    const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' })

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('isPublic', isPublic.toString())

    // Send as multipart/form-data
    await saveImage(formData)

    showSaveDialog.value = false
    pushToast({
      severity: 'success',
      summary: 'Success',
      detail: `Image saved as ${isPublic ? 'public' : 'hidden'}!`,
    })
  } catch (error: any) {
    console.error('Save error:', error)
    pushToast({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to save image',
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 p-6 pt-24 text-white">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
      <!-- Settings Panel -->
      <div class="space-y-6 lg:col-span-4">
        <Card class="border-slate-800 bg-slate-900">
          <template #title>
            <h2 class="text-xl font-bold">Generation Settings</h2>
          </template>
          <template #content>
            <div class="space-y-6">
              <!-- Prompt -->
              <div class="flex flex-col gap-2">
                <label class="text-sm text-slate-400">Prompt</label>
                <Textarea
                  v-model="prompt"
                  rows="4"
                  placeholder="Describe what you want to see..."
                  class="w-full resize-none border-slate-700 bg-slate-800 text-white focus:border-emerald-500"
                />
              </div>

              <!-- Aspect Ratio -->
              <div class="flex flex-col gap-2">
                <label class="text-sm text-slate-400">Aspect Ratio</label>
                <SelectButton
                  v-model="aspectRatio"
                  :options="aspectOptions"
                  class="custom-select-button w-full"
                />
              </div>

              <!-- Guidance Scale -->
              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <label class="text-sm text-slate-400">Guidance Scale</label>
                  <span class="font-mono text-emerald-400">{{ guidanceScale }}</span>
                </div>
                <Slider
                  v-model="guidanceScale"
                  :min="1"
                  :max="20"
                  :step="0.5"
                  class="mt-2 w-full"
                />
              </div>

              <Button
                label="Generate Image"
                icon="pi pi-sparkles"
                class="p-button-success w-full py-3 shadow-lg shadow-emerald-500/20"
                :loading="isGenerating"
                @click="handleGenerate"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Result Panel -->
      <div
        class="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden lg:col-span-8"
        :class="{
          'rounded-3xl border border-dashed border-slate-700 bg-slate-900/50': !generatedImage,
        }"
      >
        <div v-if="!generatedImage && !isGenerating" class="p-12 text-center">
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800"
          >
            <i class="pi pi-image text-3xl text-slate-600"></i>
          </div>
          <h3 class="mb-2 text-xl font-medium text-slate-300">Your masterpiece will appear here</h3>
          <p class="text-slate-500">Enter a prompt and click generate to start.</p>
        </div>

        <div v-if="isGenerating" class="text-center">
          <div>
            <img
              src="@/assets/images/pain.gif"
              alt="Generating..."
              class="mx-auto mb-4 h-64 w-64 rounded-lg"
            />
          </div>
          <p class="animate-pulse text-lg font-medium text-emerald-400">
            AI is dreaming up your image...
          </p>
          <p class="mt-2 text-sm text-slate-400">This may take a few moments</p>
        </div>

        <div v-if="generatedImage && !isGenerating" class="absolute h-full">
          <img
            :src="generatedImage"
            alt="Generated Art"
            class="h-full max-h-[600px] w-full rounded-2xl object-contain shadow-2xl shadow-black/50"
          />
          <div class="absolute right-8 bottom-8 flex gap-2">
            <Button
              icon="pi pi-save"
              @click="handleSaveToLibrary"
              v-tooltip.top="'Save to Library'"
              class="p-button-rounded p-button-success border-none bg-slate-800/80 backdrop-blur-md"
            />
            <Button
              icon="pi pi-download"
              @click="handleDownload"
              v-tooltip.top="'Download'"
              class="p-button-rounded p-button-secondary border-none bg-slate-800/80 backdrop-blur-md"
            />
            <Button
              icon="pi pi-share-alt"
              v-tooltip.top="'Share'"
              class="p-button-rounded p-button-secondary border-none bg-slate-800/80 backdrop-blur-md"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Save to Library Dialog -->
    <Dialog
      v-model:visible="showSaveDialog"
      modal
      header="Save to Library"
      :style="{ width: '400px' }"
    >
      <div class="flex flex-col gap-4">
        <p class="text-slate-300">Choose the visibility for this image:</p>
        <div class="flex gap-3">
          <Button
            label="Public"
            icon="pi pi-globe"
            @click="confirmSave(true)"
            :loading="isSaving"
            class="p-button-success flex-1"
          />
          <Button
            label="Hidden"
            icon="pi pi-eye-slash"
            @click="confirmSave(false)"
            :loading="isSaving"
            class="p-button-secondary flex-1"
          />
        </div>
        <p class="text-xs text-slate-400">
          <strong>Public:</strong> Visible to everyone in the gallery<br />
          <strong>Hidden:</strong> Only visible to you in your library
        </p>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: transparent;
}

:deep(.p-card-body) {
  padding: 1.5rem;
}

:deep(.custom-select-button .p-button) {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
  flex: 1;
}

:deep(.custom-select-button .p-highlight) {
  background: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}

:deep(.p-slider-handle) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.p-slider-range) {
  background: #10b981;
}
</style>
