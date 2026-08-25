import apiClient from './apiClient';

export function getMySkills() {
  return apiClient.get('/api/v1/skills');
}

export function getSkills() {
  return getMySkills();
}

export function createSkill(data) {
  return apiClient.post(
    '/api/v1/skills',
    data,
  );
}

export function updateSkill(
  skillId,
  data,
) {
  return apiClient.patch(
    `/api/v1/skills/${skillId}`,
    data,
  );
}

export function deleteSkill(skillId) {
  return apiClient.delete(
    `/api/v1/skills/${skillId}`,
  );
}