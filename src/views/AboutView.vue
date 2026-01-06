<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment } = counterStore
</script>
<template>
  <div class="about">
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
