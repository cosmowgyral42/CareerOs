import apiClient from './apiClient';

export async function getGoals() {
  return apiClient.get('/api/v1/goals');
}

export async function createGoal(goalData) {
  return apiClient.post('/api/v1/goals', goalData);
}

export async function updateGoal(goalId, goalData) {
  return apiClient.patch(
    `/api/v1/goals/${goalId}`,
    goalData,
  );
}

export async function deleteGoal(goalId) {
  return apiClient.delete(
    `/api/v1/goals/${goalId}`,
  );
}
