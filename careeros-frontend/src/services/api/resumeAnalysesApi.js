import apiClient from './apiClient';

export async function getResumeAnalyses() {
  return apiClient.get('/api/v1/resume-analyses');
}

export async function getResumeAnalysis(analysisId) {
  return apiClient.get(
    `/api/v1/resume-analyses/${analysisId}`,
  );
}

export async function uploadResume(
  file,
  jobDescription,
) {
  const formData = new FormData();

  formData.append('file', file);

  if (jobDescription?.trim()) {
    formData.append(
      'job_description',
      jobDescription.trim(),
    );
  }

  return apiClient.post(
    '/api/v1/resume-analyses',
    formData,
  );
}

export async function analyzeResume(analysisId) {
  return apiClient.post(
    `/api/v1/resume-analyses/${analysisId}/analyze`,
  );
}
