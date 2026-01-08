import apiClient from './axios';

export interface GenerateImageRequest {
    prompt: string;
    width?: number;
    height?: number;
    scale?: number;
}

export interface GenerateImageResponse {
    imageId: string;
    imageUrl: string;
    width: number;
    height: number;
    prompt: string;
}

export const generateImage = async (data: GenerateImageRequest): Promise<GenerateImageResponse> => {
    const response = await apiClient.post<GenerateImageResponse>('/ai/generate', data);
    return response.data;
};

export const getImageUrl = (imageId: string): string => {
    return `${import.meta.env.VITE_API_BASE_URL}/ai/image/${imageId}`;
};

export interface PaginatedGeneratedImages {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getGeneratedImages = async (page: number = 1, limit: number = 10): Promise<PaginatedGeneratedImages> => {
    const response = await apiClient.get<PaginatedGeneratedImages>('/ai/generated', {
        params: { page, limit }
    });
    return response.data;
};
