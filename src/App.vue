<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
</script>

<template>
  <div class="app-container app-dark">
    <Header />
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
