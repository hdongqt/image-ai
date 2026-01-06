import { useToast } from 'primevue/usetoast';

type ToastType = 'success' | 'info' | 'warn' | 'error';

export const pushToast = (message: string, type: ToastType = 'info') => {
    const toast = useToast();

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
