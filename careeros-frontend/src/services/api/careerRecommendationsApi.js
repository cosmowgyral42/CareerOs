import apiClient from './apiClient';

export async function analyzeCareerFit({
  career_target_id,
  job_description,
}) {
  return apiClient.post(
    '/api/v1/career-recommendations/analyze',
    {
      career_target_id:
        Number(career_target_id),
      job_description:
        job_description.trim(),
    },
  );
}

export async function getCareerRecommendations() {
  return apiClient.get(
    '/api/v1/career-recommendations',
  );
}

export async function createCareerRecommendation(
  data,
) {
  return apiClient.post(
    '/api/v1/career-recommendations',
    data,
  );
}

export async function completeCareerRecommendation(
  recommendationId,
) {
  return apiClient.patch(
    `/api/v1/career-recommendations/${recommendationId}/complete`,
  );
}

export async function createTaskFromSkillGap(
  skillGapId,
  data,
) {
  return apiClient.post(
    `/api/v1/tasks/from-skill-gap/${skillGapId}`,
    data,
  );
}
export async function createProjectFromSkillGap(
  skillGapId,
  data,
) {
  return apiClient.post(
    `/api/v1/projects/from-skill-gap/${skillGapId}`,
    data,
  );
}
export async function getCareerFitHistory() {
  return apiClient.get(
    '/api/v1/career-recommendations/analysis-history',
  );
}
