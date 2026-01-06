import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isOpenFormAuth = ref(false)

  const setOpenFormAuth = (value: boolean) => {
    isOpenFormAuth.value = value
  }

  return { isOpenFormAuth, setOpenFormAuth }
})
