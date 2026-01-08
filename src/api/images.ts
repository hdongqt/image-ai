import apiClient from './axios';

export interface SaveImageResponse {
    id: number;
    url: string;
    isPublic: boolean;
    createdAt: string;
}

export const saveImage = async (formData: FormData): Promise<SaveImageResponse> => {
    const response = await apiClient.post<SaveImageResponse>('/images/save', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getMyImages = async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/images/my', { params: { page, limit } });
    return response.data;
};

export const getPublicImages = async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/images', { params: { page, limit } });
    return response.data;
};

export const deleteImage = async (id: number) => {
    const response = await apiClient.delete(`/images/${id}`);
    return response.data;
};

export const toggleImageVisibility = async (id: number) => {
    const response = await apiClient.patch(`/images/${id}/visibility`);
    return response.data;
};
