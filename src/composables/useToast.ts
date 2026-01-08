import { useToast } from 'primevue/usetoast';

type ToastType = 'success' | 'info' | 'warn' | 'error';

interface ToastMessage {
    severity: ToastType;
    summary: string;
    detail: string;
    life?: number;
}

let toast: ReturnType<typeof useToast> | null = null;

export const registerToast = (t: ReturnType<typeof useToast>) => {
    toast = t;
};

export const pushToast = (message: ToastMessage | string, type: ToastType = 'info') => {
    if (!toast) {
        console.warn('Toast chưa được register! Hãy thêm <Toast /> và gọi registerToast trong App.vue');
        return;
    }

    if (typeof message === 'string') {
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
    } else {
        toast.add({
            ...message,
            life: message.life ?? 3000
        });
    }
};
