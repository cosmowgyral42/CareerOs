import apiClient from './apiClient';

export async function getDashboard() {
  return apiClient.get('/api/v1/dashboard');
}