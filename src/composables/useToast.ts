import { useToast } from 'primevue/usetoast';

type ToastType = 'success' | 'info' | 'warn' | 'error';

let toast: ReturnType<typeof useToast> | null = null;

export const registerToast = (t: ReturnType<typeof useToast>) => {
    toast = t;
};

export const pushToast = (message: string, type: ToastType = 'info') => {
    if (!toast) {
        console.warn('Toast chưa được register! Hãy thêm <Toast /> và gọi registerToast trong App.vue');
        return;
    }

    const summaryMap = {
        success: 'Success',
        info: 'Info',
        warn: 'Warning',
        error: 'Error'
    };

    toast.add({
        severity: type,
        summary: summaryMap[type],
        detail: message,
        life: 3000
    });
};
