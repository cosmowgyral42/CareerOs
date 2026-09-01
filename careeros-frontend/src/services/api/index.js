export {
  getDashboard,
} from './dashboardApi';


export {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from './goalsApi';


export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './tasksApi';


export {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from './projectsApi';


export {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from './applicationsApi';


export {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from './resourcesApi';


export {
  getMySkills,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from './skillsApi';


export {
  getSkillGaps,
  updateSkillGap,
  deleteSkillGap,
} from './skillGapsApi';


export {
  getCareerTargets,
  getCareerTarget,
  createCareerTarget,
  updateCareerTarget,
  deleteCareerTarget,
  addTargetSkill,
  getTargetSkills,
  updateTargetSkill,
  deleteTargetSkill,
} from './careerTargetsApi';


export {
  uploadResume,
  analyzeResume,
  getResumeAnalyses,
  getResumeAnalysis,
} from './resumeAnalysesApi';


export {
  loginUser,
  registerUser,
  getCurrentUser,
} from './authapi';

export {
  getMyProfile,
  updateMyProfile,
} from './userApi';

export {
  analyzeCareerFit,
  getCareerRecommendations,
  createCareerRecommendation,
  completeCareerRecommendation,
} from './careerRecommendationsApi';


export {
  getToken,
  hasToken,
  setToken,
  removeToken,
} from './authStorage';
