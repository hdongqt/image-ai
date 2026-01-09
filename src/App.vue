<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/ui/AppHeader.vue'
import Toast from 'primevue/toast'
import { registerToast } from '@/composables/useToast'
import { useToast } from 'primevue/usetoast'

registerToast(useToast())
</script>

<template>
  <div class="app-container">
    <Toast />
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
