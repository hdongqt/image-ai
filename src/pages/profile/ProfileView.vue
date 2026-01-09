<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import ImageCard from '@/components/ui/ImageCard.vue'
import { pushToast } from '@/composables/useToast'
import { formatDate } from '@/utils/format'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { fetchMyProfile } = authStore

const loading = ref(true)

onMounted(async () => {
    try {
        await fetchMyProfile()
    } catch (err: any) {
       const message = err.response?.data?.message || 'Failed to load profile'
       pushToast(message, 'error')
    } finally {
        loading.value = false
    }
})

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-6">
        <div class="max-w-4xl mx-auto">
            <!-- Loading State -->
            <Card v-if="loading" class="bg-slate-900/50 border border-slate-800">
                <template #content>
                    <div class="flex items-center gap-6">
                        <Skeleton shape="circle" size="8rem" />
                        <div class="flex-1 space-y-3">
                            <Skeleton width="200px" height="2rem" />
                            <Skeleton width="300px" height="1.5rem" />
                            <Skeleton width="100%" height="1rem" />
                        </div>
                    </div>
                </template>
            </Card>

            <div v-else class="space-y-6">
                <!-- Profile Header -->
                <Card class="bg-slate-900/50 border border-slate-800">
                    <template #content>
                        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <!-- Avatar -->
                            <Avatar 
                                v-if="user?.avatarUrl"
                                :image="user.avatarUrl"
                                class="w-32 h-32"
                                shape="circle"
                            />
                            <Avatar 
                                v-else
                                :label="user ? getInitials(user.displayName || user.username) : 'U'"
                                class="w-32 h-32 text-4xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900 font-bold"
                                shape="circle"
                            />

                            <!-- User Info -->
                            <div class="flex-1 text-center md:text-left">
                                <h1 class="text-3xl font-bold text-white mb-2">
                                    {{ user?.displayName || user?.username }}
                                </h1>
                                <p class="text-slate-400 mb-1">@{{ user?.username }}</p>
                                <p class="text-emerald-400 text-sm mb-4">{{ user?.email }}</p>
                                
                                <div class="flex items-center gap-2 justify-center md:justify-start mb-4">
                                    <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                                        {{ user?.role }}
                                    </span>
                                </div>

                                <p v-if="user?.bio" class="text-slate-300 max-w-2xl">
                                    {{ user.bio }}
                                </p>
                                <p v-else class="text-slate-500 italic">
                                    No bio yet
                                </p>
                            </div>

                            <!-- Edit Button -->
                            <Button 
                                label="Edit Profile" 
                                icon="pi pi-pencil" 
                                class="p-button-outlined"
                                severity="secondary"
                            />
                        </div>
                    </template>
                </Card>

                <!-- Account Details -->
                <Card class="bg-slate-900/50 border border-slate-800">
                    <template #header>
                        <div class="px-6 pt-6">
                            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                                <i class="pi pi-info-circle text-emerald-400"></i>
                                Account Details
                            </h2>
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p class="text-slate-500 text-sm mb-1">User ID</p>
                                <p class="text-white font-mono">{{ user?.id }}</p>
                            </div>
                            <div>
                                <p class="text-slate-500 text-sm mb-1">Role</p>
                                <p class="text-white">{{ user?.role }}</p>
                            </div>
                            <div>
                                <p class="text-slate-500 text-sm mb-1">Member Since</p>
                                <p class="text-white">{{ formatDate(user?.createdAt || '') }}</p>
                            </div>
                            <div>
                                <p class="text-slate-500 text-sm mb-1">Last Updated</p>
                                <p class="text-white">{{ formatDate(user?.updatedAt || '') }}</p>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Generated Images -->
                <Card class="bg-slate-900/50 border border-slate-800">
                    <template #header>
                        <div class="px-6 pt-6 flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                                <i class="pi pi-images text-emerald-400"></i>
                                Generated Images
                            </h2>
                            <Button 
                                label="View All" 
                                icon="pi pi-images" 
                                variant="link"
                                @click="$router.push('/profile/generations')"
                            />
                        </div>
                    </template>
                    <template #content>
                        <div v-if="user?.images && user.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <ImageCard 
                                v-for="image in user.images" 
                                :key="image.id"
                                :image="image"
                            />
                        </div>
                        <div v-else class="text-center py-12">
                            <i class="pi pi-image text-6xl text-slate-700 mb-4"></i>
                            <p class="text-slate-500">No images generated yet</p>
                            <Button 
                                label="Generate Your First Image" 
                                icon="pi pi-sparkles" 
                                class="mt-4"
                                @click="$router.push('/generate')"
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
