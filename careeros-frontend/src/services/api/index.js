export {
  getCurrentUser,
  loginUser,
  registerUser,
} from './authapi';

export {
  getDashboard,
} from './dashboardAPI';

export {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from './goalsApi';

export {
  getToken,
  hasToken,
  removeToken,
  setToken,
} from './authStorage';