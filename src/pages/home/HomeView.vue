<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

// Import static images
import imgIstanbul from '@/assets/images/home/grid-istanbul.jpg'
import imgNewYork from '@/assets/images/home/grid-newyork.jpg'
import imgNorway from '@/assets/images/home/grid-norway.jpg'
import imgParis from '@/assets/images/home/grid-paris.jpg'
import imgRome from '@/assets/images/home/grid-rome.jpg'
import imgSydney from '@/assets/images/home/grid-sydney.jpg'
import imgTokyo from '@/assets/images/home/grid-tokyo.jpg'

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

const logos = [
  { name: 'ZenTrailMs', icon: 'pi pi-compass' },
  { name: 'Wavelength', icon: 'pi pi-star' },
  { name: 'AlphaHex', icon: 'pi pi-sun' },
  { name: 'Mistranet', icon: 'pi pi-box' },
  { name: 'BriteMank', icon: 'pi pi-moon' },
  { name: 'Limerantz', icon: 'pi pi-circle' },
  { name: 'Streamlinz', icon: 'pi pi-cloud' }
]

const staticImages = [
  { id: 1, url: imgIstanbul, title: 'Istanbul' },
  { id: 2, url: imgNewYork, title: 'New York' },
  { id: 3, url: imgNorway, title: 'Norway' },
  { id: 4, url: imgParis, title: 'Paris' },
  { id: 5, url: imgRome, title: 'Rome' },
  { id: 6, url: imgSydney, title: 'Sydney' },
  { id: 7, url: imgTokyo, title: 'Tokyo' },
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
        <router-link to="/timeline">
          <Button label="View Gallery" icon="pi pi-images" size="large" variant="outlined"
            class="p-button-rounded p-button-secondary" />
        </router-link>
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
      <div class="marquee-container pt-10 max-w-6xl mx-auto">
        <div class="marquee-content w-max flex gap-16">
          <div v-for="logo in logos" :key="logo.name"
            class="flex items-center gap-3 whitespace-nowrap opacity-70 transition-opacity duration-300 hover:opacity-100">
            <i :class="[logo.icon, 'text-2xl text-slate-400']"></i>
            <span class="text-lg font-medium text-slate-400">{{ logo.name }}</span>
          </div>
          <div v-for="logo in logos" :key="logo.name + '-clone'"
            class="flex items-center gap-3 whitespace-nowrap opacity-70 transition-opacity duration-300 hover:opacity-100">
            <i :class="[logo.icon, 'text-2xl text-slate-400']"></i>
            <span class="text-lg font-medium text-slate-400">{{ logo.name }}</span>
          </div>
        </div>
      </div>
    </section>
    <!-- Gallery Preview -->
    <section class="py-20 px-6 flex flex-col items-center">
      <div class="max-w-6xl w-full">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold mb-2">Community Creations</h2>
            <p class="text-slate-400">See what others are creating with our AI.</p>
          </div>
          <router-link to="/timeline" class="text-emerald-400 hover:underline">View All</router-link>
        </div>

        <!-- Custom Grid Layout -->
        <div class="grid grid-cols-3 grid-rows-4 gap-4 h-[1200px]">
          <!-- div1: row 1, col 2-3 -->
          <div class="row-start-1 row-end-2 col-start-2 col-end-4 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[0]!.url" :alt="staticImages[0]!.title" class="w-full h-full object-cover" />
          </div>

          <!-- div2: row 2-3, col 2 -->
          <div class="row-start-2 row-end-4 col-start-2 col-end-3 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[1]!.url" :alt="staticImages[1]!.title" class="w-full h-full object-cover" />
          </div>

          <!-- div3: row 2-4, col 3 -->
          <div class="row-start-2 row-end-5 col-start-3 col-end-4 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[2]!.url" :alt="staticImages[2]!.title" class="w-full h-full object-cover" />
          </div>

          <!-- div4: row 1-2, col 1 -->
          <div class="row-start-1 row-end-3 col-start-1 col-end-2 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[3]!.url" :alt="staticImages[3]!.title" class="w-full h-full object-cover" />
          </div>

          <!-- div5: row 3-4, col 1 -->
          <div class="row-start-3 row-end-5 col-start-1 col-end-2 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[4]!.url" :alt="staticImages[4]!.title" class="w-full h-full object-cover" />
          </div>

          <!-- div6: row 4, col 2 -->
          <div class="row-start-4 row-end-5 col-start-2 col-end-3 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <img :src="staticImages[5]!.url" :alt="staticImages[5]!.title" class="w-full h-full object-cover" />
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

.marquee-container {
  width: 100%;
  mask-image: linear-gradient(to right, transparent, rgb(236, 236, 236) 10%, rgb(255, 255, 255) 90%, transparent);
}

.marquee-content {
  animation: scroll 30s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
