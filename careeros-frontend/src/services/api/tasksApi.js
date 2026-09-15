import apiClient from './apiClient';

export async function getTasks() {
  return apiClient.get('/api/v1/tasks');
}

export async function createTask(taskData) {
  return apiClient.post(
    '/api/v1/tasks',
    taskData,
  );
}

export async function updateTask(
  taskId,
  taskData,
) {
  return apiClient.patch(
    `/api/v1/tasks/${taskId}`,
    taskData,
  );
}

export async function deleteTask(taskId) {
  return apiClient.delete(
    `/api/v1/tasks/${taskId}`,
  );
}
