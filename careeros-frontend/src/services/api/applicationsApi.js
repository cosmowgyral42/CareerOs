import apiClient from './apiClient';

export async function getApplications() {
  return apiClient.get('/api/v1/applications');
}

export async function createApplication(applicationData) {
  return apiClient.post(
    '/api/v1/applications',
    applicationData,
  );
}

export async function updateApplication(
  applicationId,
  applicationData,
) {
  return apiClient.patch(
    `/api/v1/applications/${applicationId}`,
    applicationData,
  );
}

export async function deleteApplication(applicationId) {
  return apiClient.delete(
    `/api/v1/applications/${applicationId}`,
  );
}