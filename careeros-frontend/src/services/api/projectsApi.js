import apiClient from './apiClient';

export async function getProjects() {
  return apiClient.get('/api/v1/projects');
}

export async function createProject(projectData) {
  return apiClient.post(
    '/api/v1/projects',
    projectData,
  );
}

export async function updateProject(
  projectId,
  projectData,
) {
  return apiClient.patch(
    `/api/v1/projects/${projectId}`,
    projectData,
  );
}

export async function deleteProject(projectId) {
  return apiClient.delete(
    `/api/v1/projects/${projectId}`,
  );
}