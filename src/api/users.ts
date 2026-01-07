import apiClient from './axios';

export interface User {
    id: number;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    images?: any[];
}

export interface UpdateUserDto {
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
}

export const usersApi = {
    // Get current user's profile (requires authentication)
    getMyProfile: () => apiClient.get<User>('/users/profile'),
    
    // Get any user's profile by ID
    getUserProfile: (id: number) => apiClient.get<User>(`/users/profile/${id}`),
    
    // Update current user's profile (requires authentication)
    updateMyProfile: (data: UpdateUserDto) => apiClient.patch<User>('/users/profile', data),
};
