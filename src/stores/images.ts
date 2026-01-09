import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getTimeline } from '@/api/images';

export interface Image {
    id: number;
    url: string;
    isPublic: boolean;
    createdAt: string;
    user: {
        id: number;
        username: string;
        avatarUrl?: string;
    };
}

export const useImageStore = defineStore('images', () => {
    const timelineImages = ref<Image[]>([]);
    const loading = ref(false);
    const total = ref(0);

    const fetchTimeline = async (page: number = 1, limit: number = 10) => {
        loading.value = true;
        try {
            const data = await getTimeline(page, limit);
            timelineImages.value = data.data;
            total.value = data.total;
        } catch (error) {
            console.error('Failed to fetch timeline:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        timelineImages,
        loading,
        total,
        fetchTimeline,
    };
});
