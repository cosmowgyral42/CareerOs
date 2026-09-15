import apiClient from './apiClient';


export async function getCareerTargets() {
  return apiClient.get(
    '/api/v1/career-targets',
  );
}


export async function getCareerTarget(targetId) {
  return apiClient.get(
    `/api/v1/career-targets/${targetId}`,
  );
}


export async function createCareerTarget(data) {
  return apiClient.post(
    '/api/v1/career-targets',
    data,
  );
}


export async function updateCareerTarget(
  targetId,
  data,
) {
  return apiClient.patch(
    `/api/v1/career-targets/${targetId}`,
    data,
  );
}


export async function deleteCareerTarget(targetId) {
  return apiClient.delete(
    `/api/v1/career-targets/${targetId}`,
  );
}


export async function getTargetSkills(targetId) {
  return apiClient.get(
    `/api/v1/career-targets/${targetId}/skills`,
  );
}


export async function addTargetSkill(
  targetId,
  data,
) {
  return apiClient.post(
    `/api/v1/career-targets/${targetId}/skills`,
    {
      skill_id: Number(data.skill_id),
      importance: data.importance || 'required',
    },
  );
}


export async function updateTargetSkill(
  targetId,
  targetSkillId,
  data,
) {
  return apiClient.patch(
    `/api/v1/career-targets/${targetId}/skills/${targetSkillId}`,
    data,
  );
}


export async function deleteTargetSkill(
  targetId,
  targetSkillId,
) {
  return apiClient.delete(
    `/api/v1/career-targets/${targetId}/skills/${targetSkillId}`,
  );
}
