import apiClient from './apiClient';

export function getCareerTargets() {
  return apiClient.get('/api/v1/career-targets');
}

export function getCareerTarget(targetId) {
  return apiClient.get(
    `/api/v1/career-targets/${targetId}`,
  );
}

export function createCareerTarget(data) {
  return apiClient.post(
    '/api/v1/career-targets',
    data,
  );
}

export function updateCareerTarget(
  targetId,
  data,
) {
  return apiClient.patch(
    `/api/v1/career-targets/${targetId}`,
    data,
  );
}

export function deleteCareerTarget(targetId) {
  return apiClient.delete(
    `/api/v1/career-targets/${targetId}`,
  );
}

export function getTargetSkills(targetId) {
  return apiClient.get(
    `/api/v1/career-targets/${targetId}/skills`,
  );
}

export function addTargetSkill(
  targetId,
  data,
) {
  return apiClient.post(
    `/api/v1/career-targets/${targetId}/skills`,
    data,
  );
}

export function updateTargetSkill(
  targetId,
  targetSkillId,
  data,
) {
  return apiClient.patch(
    `/api/v1/career-targets/${targetId}/skills/${targetSkillId}`,
    data,
  );
}

export function deleteTargetSkill(
  targetId,
  targetSkillId,
) {
  return apiClient.delete(
    `/api/v1/career-targets/${targetId}/skills/${targetSkillId}`,
  );
}