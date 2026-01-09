<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Popover from 'primevue/popover'
import AuthForm from '@/components/AuthForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const { setOpenFormAuth, logout, fetchMyProfile } = authStore
const { user, isAuthenticated } = storeToRefs(authStore)

const userMenuRef = ref()

const items = ref([
  { label: 'Home', icon: 'pi pi-home', route: '/' },
  { label: 'Generate', icon: 'pi pi-sparkles', route: '/generate' },
  { label: 'About', icon: 'pi pi-info-circle', route: '/about' },
])

const isDark = ref(true)

const toggleTheme = () => {
  const html = document.documentElement
  html.classList.toggle('app-dark')
  isDark.value = html.classList.contains('app-dark')
}

onMounted(async () => {
  isDark.value = document.documentElement.classList.contains('app-dark')

  if (isAuthenticated.value && !user.value) {
    try {
      await fetchMyProfile()
    } catch {}
  }
})

const navigate = (route: string) => {
  router.push(route)
}

const toggleUserMenu = (event: Event) => {
  userMenuRef.value.toggle(event)
}

const handleLogout = () => {
  logout()
  userMenuRef.value.hide()
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <header
    class="fixed top-0 right-0 left-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md"
  >
    <nav class="mx-auto flex w-full max-w-7xl items-center justify-between py-4 pl-6">
      <div class="flex cursor-pointer items-center gap-2" @click="navigate('/')">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20"
        >
          <i class="pi pi-spin pi-cog text-xl!"></i>
        </div>
        <span
          class="hidden bg-linear-to-r from-white to-slate-400 bg-clip-text text-xl font-bold text-transparent md:block"
        >
          AI Creator
        </span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden items-center gap-8 md:flex">
        <router-link
          :to="item.route"
          v-for="item in items"
          :key="item.label"
          @click="navigate(item.route)"
          class="flex items-center gap-2 rounded-full px-4 py-2 text-base font-medium text-slate-400 transition-colors hover:text-white"
          :class="{ 'bg-emerald-400 text-slate-900': $route.path === item.route }"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </router-link>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <!-- Login Button (when not authenticated) -->
        <Button
          v-if="!isAuthenticated"
          label="Login"
          variant="text"
          class="hidden text-slate-400 sm:block"
          @click="setOpenFormAuth(true)"
        />

        <!-- User Avatar (when authenticated) -->
        <div v-else class="hidden sm:block">
          <Avatar
            :image="user?.avatarUrl"
            :label="!user?.avatarUrl && user ? getInitials(user.displayName || user.username) : 'U'"
            class="cursor-pointer bg-gradient-to-br from-emerald-400 to-cyan-400 font-semibold text-slate-900"
            shape="circle"
            @click="toggleUserMenu"
          />
          <Popover ref="userMenuRef">
            <div class="flex min-w-[200px] flex-col">
              <!-- User Info -->
              <div class="mb-1 border-b border-slate-700 pb-3">
                <p class="font-semibold text-white">{{ user?.displayName || user?.username }}</p>
                <p class="text-sm text-slate-400">{{ user?.email }}</p>
                <p v-if="user?.bio" class="mt-1 text-xs text-slate-500">{{ user.bio }}</p>
              </div>

              <!-- Menu Items -->
              <Button
                label="Secondary"
                severity="secondary"
                variant="text"
                @click="
                  () => {
                    navigate('/profile')
                    userMenuRef.hide()
                  }
                "
                class="c flex items-center justify-start! gap-3 rounded-lg px-3 py-2 text-left text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <i class="pi pi-user"></i>
                <span>My Profile</span>
              </Button>

              <Button
                label="Secondary"
                severity="secondary"
                variant="text"
                @click="handleLogout"
                class="flex items-center justify-start! gap-3 rounded-lg text-left text-red-400 transition-colors hover:bg-red-900/20 hover:text-red-300"
              >
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
              </Button>
            </div>
          </Popover>
        </div>
        <Button
          :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
          variant="text"
          class="text-slate-400"
          @click="toggleTheme"
        />
      </div>
    </nav>
  </header>
  <AuthForm />
</template>

<style scoped></style>
