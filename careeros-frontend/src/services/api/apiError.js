export function getApiErrorMessage(error) {
  if (!error) {
    return 'Something went wrong.';
  }

  if (error.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error.status === 429) {
    return 'You have reached the AI usage limit. Please try again later.';
  }

  if (error.status >= 500) {
    return 'CareerOS is temporarily unavailable. Please try again.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}