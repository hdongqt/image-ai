<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth';

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Popover from 'primevue/popover'
import AuthForm from '@/components/AuthForm.vue'

const router = useRouter()
const authStore = useAuthStore();

const { setOpenFormAuth, logout } = authStore;
const { user, isAuthenticated } = storeToRefs(authStore);

const userMenuRef = ref();

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

const toggleUserMenu = (event: Event) => {
    userMenuRef.value.toggle(event);
}

const handleLogout = () => {
    logout();
    userMenuRef.value.hide();
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
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
                   <Button label="Get Started" size="small" class="p-button-success p-button-rounded"
                    @click="navigate('/generate')" />
                <Button :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'" variant="text" class="text-slate-400"
                    @click="toggleTheme" />
                
                <!-- Login Button (when not authenticated) -->
                <Button v-if="!isAuthenticated" label="Login" variant="text" class="text-slate-400 hidden sm:block"
                    @click="setOpenFormAuth(true)" />
                
                <!-- User Avatar (when authenticated) -->
                <div v-else class="hidden sm:block">
                    <Avatar 
                        :label="user ? getInitials(user.username) : 'U'" 
                        class="cursor-pointer bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900 font-semibold"
                        shape="circle"
                        @click="toggleUserMenu"
                    />
                    <Popover ref="userMenuRef">
                        <div class="flex flex-col gap-3 p-4 min-w-[200px]">
                            <!-- User Info -->
                            <div class="pb-3 border-b border-slate-700">
                                <p class="font-semibold text-white">{{ user?.username }}</p>
                                <p class="text-sm text-slate-400">{{ user?.email }}</p>
                            </div>
                            
                            <!-- Menu Items -->
                            <button 
                                @click="() => { navigate('/profile'); userMenuRef.hide(); }"
                                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left text-slate-300 hover:text-white">
                                <i class="pi pi-user"></i>
                                <span>My Profile</span>
                            </button>
                            
                            <button 
                                @click="handleLogout"
                                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors text-left text-red-400 hover:text-red-300">
                                <i class="pi pi-sign-out"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </Popover>
                </div>

             
            </div>
        </nav>
    </header>
    <AuthForm />
</template>

<style scoped></style>
