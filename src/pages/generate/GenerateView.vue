<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
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
            detail: error.response?.data?.message || 'Failed to generate image' 
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
        const blob = await fetch(base64Data).then(r => r.blob())
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
            detail: `Image saved as ${isPublic ? 'public' : 'hidden'}!` 
        })
    } catch (error: any) {
        console.error('Save error:', error)
        pushToast({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.response?.data?.message || 'Failed to save image' 
        })
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-white p-6 pt-24">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            <!-- Settings Panel -->
            <div class="lg:col-span-4 space-y-6">
                <Card class="bg-slate-900 border-slate-800">
                    <template #title>
                        <h2 class="text-xl font-bold">Generation Settings</h2>
                    </template>
                    <template #content>
                        <div class="space-y-6">
                            <!-- Prompt -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-slate-400">Prompt</label>
                                <Textarea v-model="prompt" rows="4" placeholder="Describe what you want to see..."
                                    class="w-full bg-slate-800 border-slate-700 text-white focus:border-emerald-500 resize-none " />
                            </div>



                            <!-- Aspect Ratio -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-slate-400">Aspect Ratio</label>
                                <SelectButton v-model="aspectRatio" :options="aspectOptions"
                                    class="w-full custom-select-button" />
                            </div>

                            <!-- Guidance Scale -->
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between">
                                    <label class="text-sm text-slate-400">Guidance Scale</label>
                                    <span class="text-emerald-400 font-mono">{{ guidanceScale }}</span>
                                </div>
                                <Slider v-model="guidanceScale" :min="1" :max="20" :step="0.5" class="w-full mt-2" />
                            </div>

                            <Button label="Generate Image" icon="pi pi-sparkles"
                                class="w-full p-button-success shadow-lg shadow-emerald-500/20 py-3"
                                :loading="isGenerating" @click="handleGenerate" />
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Result Panel -->
            <div
                class="lg:col-span-8 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden"
                :class="{ 'bg-slate-900/50 rounded-3xl border border-dashed border-slate-700': !generatedImage }"
                >
                <div v-if="!generatedImage && !isGenerating" class="text-center p-12">
                    <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="pi pi-image text-3xl text-slate-600"></i>
                    </div>
                    <h3 class="text-xl font-medium text-slate-300 mb-2">Your masterpiece will appear here</h3>
                    <p class="text-slate-500">Enter a prompt and click generate to start.</p>
                </div>

                <div v-if="isGenerating" class="text-center">
                    <div>
                        <img src="@/assets/images/pain.gif" alt="Generating..." 
                        class="w-64 h-64 mx-auto mb-4 rounded-lg" />
                    </div>
                    <p class="text-emerald-400 text-lg font-medium animate-pulse">AI is dreaming up your image...</p>
                    <p class="text-slate-400 text-sm mt-2">This may take a few moments</p>
                </div>

                <div v-if="generatedImage && !isGenerating" class="h-full absolute">
                    <img :src="generatedImage" alt="Generated Art"
                        class="w-full h-full object-contain max-h-[600px] rounded-2xl shadow-2xl shadow-black/50" />
                    <div class="absolute bottom-8 right-8 flex gap-2">
                        <Button icon="pi pi-save" @click="handleSaveToLibrary" v-tooltip.top="'Save to Library'"
                            class="p-button-rounded p-button-success bg-slate-800/80 backdrop-blur-md border-none" />
                        <Button icon="pi pi-download" @click="handleDownload" v-tooltip.top="'Download'"
                            class="p-button-rounded p-button-secondary bg-slate-800/80 backdrop-blur-md border-none" />
                        <Button icon="pi pi-share-alt" v-tooltip.top="'Share'"
                            class="p-button-rounded p-button-secondary bg-slate-800/80 backdrop-blur-md border-none" />
                    </div>
                </div>
            </div>

        </div>

        <!-- Save to Library Dialog -->
        <Dialog v-model:visible="showSaveDialog" modal header="Save to Library" :style="{ width: '400px' }">
            <div class="flex flex-col gap-4">
                <p class="text-slate-300">Choose the visibility for this image:</p>
                <div class="flex gap-3">
                    <Button label="Public" icon="pi pi-globe" @click="confirmSave(true)" :loading="isSaving"
                        class="flex-1 p-button-success" />
                    <Button label="Hidden" icon="pi pi-eye-slash" @click="confirmSave(false)" :loading="isSaving"
                        class="flex-1 p-button-secondary" />
                </div>
                <p class="text-xs text-slate-400">
                    <strong>Public:</strong> Visible to everyone in the gallery<br>
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
