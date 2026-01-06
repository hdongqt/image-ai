import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { authApi, type LoginDto, type RegisterDto } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);
    const accessToken = ref(localStorage.getItem('accessToken'));
    const refreshToken = ref(localStorage.getItem('refreshToken'));
    const isOpenFormAuth = ref(false);

    const isAuthenticated = computed(() => !!accessToken.value);

    const setOpenFormAuth = (value: boolean) => {
        isOpenFormAuth.value = value;
    };

    const login = async (data: LoginDto) => {
        try {
            const response = await authApi.login(data);
            const { user: userData, accessToken: token, refreshToken: refresh } = response.data;
            
            user.value = userData;
            accessToken.value = token;
            refreshToken.value = refresh;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refresh);
            
            setOpenFormAuth(false);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterDto) => {
        try {
            const response = await authApi.register(data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        user.value = null;
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isOpenFormAuth,
        setOpenFormAuth,
        login,
        register,
        logout,
    };
});
