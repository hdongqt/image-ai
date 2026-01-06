<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth';

import Button from 'primevue/button'
import AuthForm from '@/components/AuthForm.vue'

const router = useRouter()
const authStore = useAuthStore();

const { setOpenFormAuth } = authStore;


const items = ref([
    { label: 'Home', icon: 'pi pi-home', route: '/' },
    { label: 'Generate', icon: 'pi pi-sparkles', route: '/generate' },
    { label: 'About', icon: 'pi pi-info-circle', route: '/about' }
])



const isDark = ref(true)

const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle('app-dark')
    isDark.value = html.classList.contains('app-dark')
}

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('app-dark')
})

const navigate = (route: string) => {
    router.push(route)
}
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <nav class="w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div class="flex items-center gap-2 cursor-pointer" @click="navigate('/')">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <i class="pi pi-spin pi-cog text-xl!"></i>
                </div>
                <span
                    class="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent hidden md:block">
                    AI Creator
                </span>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-8">
                <router-link :to="item.route" v-for="item in items" :key="item.label" @click="navigate(item.route)"
                    class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    :class="{ 'text-emerald-400': $route.path === item.route }">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                </router-link>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4">
                <Button :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'" variant="text" class="text-slate-400"
                    @click="toggleTheme" />
                <Button label="Login" variant="text" class="text-slate-400 hidden sm:block"
                    @click="setOpenFormAuth(true)" />
                <Button label="Get Started" size="small" class="p-button-success p-button-rounded"
                    @click="navigate('/generate')" />
            </div>
        </nav>
    </header>
    <AuthForm />
</template>

<style scoped></style>
