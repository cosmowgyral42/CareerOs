import apiClient from './apiClient';

export async function getSkills() {
  return apiClient.get('/api/v1/skills');
}

export async function createSkill(skillData) {
  return apiClient.post(
    '/api/v1/skills',
    skillData,
  );
}

export async function updateSkill(
  skillId,
  skillData,
) {
  return apiClient.patch(
    `/api/v1/skills/${skillId}`,
    skillData,
  );
}

export async function deleteSkill(skillId) {
  return apiClient.delete(
    `/api/v1/skills/${skillId}`,
  );
}