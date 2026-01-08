<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'

const router = useRouter()

const features = [
  {
    title: 'Text to Image',
    description: 'Transform your wildest imaginations into stunning visuals with our advanced AI models.',
    icon: 'pi pi-pencil'
  },
  {
    title: 'High Resolution',
    description: 'Generate high-quality images up to 4K resolution, perfect for any project.',
    icon: 'pi pi-image'
  },
  {
    title: 'Style Variety',
    description: 'Choose from a wide range of styles, from photorealistic to digital art and beyond.',
    icon: 'pi pi-palette'
  }
]

const navigateToGenerate = () => {
  router.push('/generate')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <!-- Hero Section -->
    <section class="relative py-20 pt-36 px-6 flex flex-col items-center text-center overflow-hidden">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)] pointer-events-none">
      </div>

      <h1
        class="text-5xl md:text-7xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Create Magic with AI
      </h1>
      <p class="text-lg text-slate-400 max-w-2xl pt-6">
        The most powerful AI image generation tool at your fingertips. Turn your words into masterpieces in seconds.
      </p>

      <div class="flex gap-4 pt-10">
        <Button label="Start Creating" icon="pi pi-bolt" size="large" @click="navigateToGenerate"
          class="p-button-rounded p-button-success shadow-lg shadow-emerald-500/20" />
        <Button label="View Gallery" icon="pi pi-images" size="large" variant="outlined"
          class="p-button-rounded p-button-secondary" />
      </div>


    </section>

    <!-- Features Section -->
    <section class="py-20 px-6 bg-slate-900/50 flex flex-col items-center">
      <div class="max-w-6xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Our AI?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card v-for="feature in features" :key="feature.title"
            class="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
            <template #title>
              <div class="flex items-center gap-3 mb-2">
                <i :class="[feature.icon, 'text-2xl text-emerald-400']"></i>
                <span>{{ feature.title }}</span>
              </div>
            </template>
            <template #content>
              <p class="text-slate-400">{{ feature.description }}</p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Gallery Preview -->
    <section class="py-20 px-6 flex flex-col items-center">
      <div class="max-w-6xl">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold mb-2">Community Creations</h2>
            <p class="text-slate-400">See what others are creating with our AI.</p>
          </div>
          <router-link to="/profile/generations" class="text-emerald-400">View All</router-link>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="aspect-square rounded-xl overflow-hidden group relative cursor-pointer">
            <img :src="`https://picsum.photos/seed/${i + 100}/800/800`" alt="Gallery Image"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button icon="pi pi-search" class="p-button-rounded p-button-text text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 px-6 border-t border-slate-800 text-center text-slate-500">
      <p>&copy; 2026 AI Image Creator. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: transparent;
}

:deep(.p-card-body) {
  padding: 1.5rem;
}
</style>
