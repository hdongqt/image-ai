<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import Card from 'primevue/card'
import Slider from 'primevue/slider'

const prompt = ref('')
const negativePrompt = ref('')
const aspectRatio = ref('1:1')
const aspectOptions = ref(['1:1', '4:3', '16:9', '9:16'])
const guidanceScale = ref(7.5)
const isGenerating = ref(false)
const generatedImage = ref<string | null>(null)

const handleGenerate = () => {
    if (!prompt.value) return

    isGenerating.value = true
    // Simulate generation
    setTimeout(() => {
        isGenerating.value = false
        generatedImage.value = `https://picsum.photos/seed/${Math.random()}/1024/1024`
    }, 3000)
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
                                    class="w-full bg-slate-800 border-slate-700 text-white focus:border-emerald-500" />
                            </div>

                            <!-- Negative Prompt -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-slate-400">Negative Prompt (Optional)</label>
                                <InputText v-model="negativePrompt" placeholder="Things to exclude..."
                                    class="w-full bg-slate-800 border-slate-700 text-white focus:border-emerald-500" />
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
                class="lg:col-span-8 flex flex-col items-center justify-center min-h-[600px] bg-slate-900/50 rounded-3xl border border-dashed border-slate-700 relative overflow-hidden">
                <div v-if="!generatedImage && !isGenerating" class="text-center p-12">
                    <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="pi pi-image text-3xl text-slate-600"></i>
                    </div>
                    <h3 class="text-xl font-medium text-slate-300 mb-2">Your masterpiece will appear here</h3>
                    <p class="text-slate-500">Enter a prompt and click generate to start.</p>
                </div>

                <div v-if="isGenerating" class="text-center">
                    <i class="pi pi-spin pi-spinner text-4xl text-emerald-400 mb-4"></i>
                    <p class="text-emerald-400 animate-pulse">AI is dreaming up your image...</p>
                </div>

                <div v-if="generatedImage && !isGenerating" class="w-full h-full p-4">
                    <img :src="generatedImage" alt="Generated Art"
                        class="w-full h-full object-contain rounded-2xl shadow-2xl shadow-black/50" />
                    <div class="absolute bottom-8 right-8 flex gap-2">
                        <Button icon="pi pi-download"
                            class="p-button-rounded p-button-secondary bg-slate-800/80 backdrop-blur-md border-none" />
                        <Button icon="pi pi-share-alt"
                            class="p-button-rounded p-button-secondary bg-slate-800/80 backdrop-blur-md border-none" />
                    </div>
                </div>
            </div>

        </div>
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
