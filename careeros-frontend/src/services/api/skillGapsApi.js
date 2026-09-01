import apiClient from './apiClient';

export async function getSkillGaps() {
  return apiClient.get('/api/v1/skill-gaps');
}

export async function createSkillGap(
  skillGapData,
) {
  return apiClient.post(
    '/api/v1/skill-gaps',
    skillGapData,
  );
}

export async function updateSkillGap(
  skillGapId,
  skillGapData,
) {
  return apiClient.patch(
    `/api/v1/skill-gaps/${skillGapId}`,
    skillGapData,
  );
}

export async function deleteSkillGap(
  skillGapId,
) {
  return apiClient.delete(
    `/api/v1/skill-gaps/${skillGapId}`,
  );
}
