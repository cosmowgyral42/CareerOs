import apiClient from './apiClient';


export function getMyProfile() {
  return apiClient.get('/api/v1/users/me');
}


export function updateMyProfile(userData) {
  return apiClient.patch(
    '/api/v1/users/me',
    userData,
  );
}