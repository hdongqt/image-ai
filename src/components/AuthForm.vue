<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { Button, Dialog, InputText, Password, IconField, InputIcon } from 'primevue'
import { pushToast } from '@/composables/useToast'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const authStore = useAuthStore()
const { isOpenFormAuth } = storeToRefs(authStore)

const isLogin = ref(true)
const loading = ref(false)

// Define Schemas
const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
)

const registerSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
)

// Define Form Values Type
interface AuthFormValues {
  username: string
  email?: string
  password: string
}

// Initialize VeeValidate Form
const { handleSubmit, errors, defineField, resetForm } = useForm<AuthFormValues>({
  validationSchema: computed(() => (isLogin.value ? loginSchema : registerSchema)),
  initialValues: {
    username: '',
    email: '',
    password: '',
  },
})

const [username, usernameProps] = defineField('username')
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const title = computed(() => (isLogin.value ? 'Welcome Back' : 'Join Us'))
const subtitle = computed(() =>
  isLogin.value
    ? 'Please enter your details to sign in.'
    : 'Start your creative journey with us today.',
)
const submitLabel = computed(() => (isLogin.value ? 'Sign In' : 'Create Account'))
const toggleText = computed(() =>
  isLogin.value ? "Don't have an account?" : 'Already have an account?',
)
const toggleAction = computed(() => (isLogin.value ? 'Sign Up' : 'Sign In'))

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    if (isLogin.value) {
      await authStore.login({
        username: values.username,
        password: values.password,
      })
    } else {
      await authStore.register({
        username: values.username,
        email: values.email as string,
        password: values.password,
      })
      pushToast('Your account has been created. Please sign in.', 'success')
      isLogin.value = true
    }
  } catch (err: any) {
    pushToast(err.response?.data?.message || 'An error occurred during authentication.', 'error')
  } finally {
    loading.value = false
  }
})

watch(isOpenFormAuth, (val) => {
  if (!val) {
    resetForm()
    isLogin.value = true
  }
})
</script>

<template>
  <Dialog
    v-model:visible="isOpenFormAuth"
    modal
    :draggable="false"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="auth-dialog"
    :closable="false"
  >
    <template #header>
      <button
        @click="isOpenFormAuth = false"
        class="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-700"
      >
        <i class="pi pi-times text-2xl"></i>
      </button>
      <div class="flex w-full flex-col items-center gap-3">
        <div class="header-icon-container">
          <i
            :class="isLogin ? 'pi pi-sign-in' : 'pi pi-user-plus'"
            class="text-primary text-3xl"
          ></i>
        </div>
        <div class="text-center">
          <h2 class="text-surface-900 dark:text-surface-0 m-0 text-2xl font-bold">{{ title }}</h2>
          <p class="text-surface-500 dark:text-surface-400 mt-1 mb-0 text-sm">{{ subtitle }}</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-5 px-2 py-6">
      <!-- Username Field -->
      <div class="flex flex-col gap-2">
        <label for="username" class="text-surface-700 dark:text-surface-200 text-sm font-medium"
          >Username</label
        >
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="username"
            v-model="username"
            v-bind="usernameProps"
            :invalid="!!errors.username"
            placeholder="Your username"
            class="w-full"
            autocomplete="username"
          />
        </IconField>
        <small v-if="errors.username" class="flex items-center gap-1 text-red-500">
          <i class="pi pi-exclamation-circle text-xs"></i>
          {{ errors.username }}
        </small>
      </div>

      <!-- Email Field (Register Only) -->
      <div v-if="!isLogin" class="flex flex-col gap-2">
        <label for="email" class="text-surface-700 dark:text-surface-200 text-sm font-medium"
          >Email Address</label
        >
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="email"
            v-model="email"
            v-bind="emailProps"
            :invalid="!!errors.email"
            placeholder="name@example.com"
            class="w-full"
            autocomplete="email"
          />
        </IconField>
        <small v-if="errors.email" class="flex items-center gap-1 text-red-500">
          <i class="pi pi-exclamation-circle text-xs"></i>
          {{ errors.email }}
        </small>
      </div>

      <!-- Password Field -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-surface-700 dark:text-surface-200 text-sm font-medium"
          >Password</label
        >
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="password"
            v-model="password"
            v-bind="passwordProps"
            :invalid="!!errors.password"
            placeholder=""
            :feedback="!isLogin"
            toggleMask
            class="w-full"
            :inputStyle="{ width: '100%', paddingLeft: '2.5rem' }"
            autocomplete="current-password"
          />
        </IconField>
        <small v-if="errors.password" class="flex items-center gap-1 text-red-500">
          <i class="pi pi-exclamation-circle text-xs"></i>
          {{ errors.password }}
        </small>
      </div>

      <!-- Submit Button -->
      <Button
        type="submit"
        :label="submitLabel"
        :loading="loading"
        class="mt-2 w-full py-3 text-lg font-bold"
        rounded
      />
    </form>

    <template #footer>
      <div class="flex w-full items-center justify-center gap-2 pb-4 text-sm">
        <span class="text-surface-500">{{ toggleText }}</span>
        <Button
          :label="toggleAction"
          link
          class="p-0 font-bold hover:underline"
          @click="toggleMode"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.header-icon-container {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--p-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.dark .header-icon-container {
  background: var(--p-primary-900-opacity-20);
}

:deep(.p-dialog) {
  position: relative;
}

:deep(.p-dialog-header) {
  padding: 2rem 1.5rem 0.5rem 1.5rem !important;
  border: none !important;
  display: flex;
  justify-content: center;
  position: relative;
}

:deep(.p-dialog-header-actions) {
  position: absolute !important;
  top: 1rem !important;
  right: 1rem !important;
  margin: 0 !important;
  z-index: 100;
}

:deep(.p-dialog-content) {
  padding-top: 0;
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-inputtext) {
  padding-left: 2.5rem;
}
</style>
