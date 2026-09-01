import apiClient from './apiClient';

export async function getResources() {
  return apiClient.get('/api/v1/resources');
}

export async function createResource(resourceData) {
  return apiClient.post(
    '/api/v1/resources',
    resourceData,
  );
}

export async function updateResource(
  resourceId,
  resourceData,
) {
  return apiClient.patch(
    `/api/v1/resources/${resourceId}`,
    resourceData,
  );
}

export async function deleteResource(resourceId) {
  return apiClient.delete(
    `/api/v1/resources/${resourceId}`,
  );
}
