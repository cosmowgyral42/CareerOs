from app.models.base import Base
from app.models.goal import Goal
from app.models.user import User
from app.models.task import Task
from app.models.project import Project
from app.models.internship_application import InternshipApplication
from app.models.resource import Resource
from app.models.resume_analysis import ResumeAnalysis
from .activity_log import ActivityLog
from app.models.career_target import CareerTarget
from app.models.skill import Skill
from app.models.skill_gap import SkillGap
from app.models.job_match import JobMatch
from app.models.career_target_skill import CareerTargetSkill
from app.models.career_recommendation import CareerRecommendation
from app.models.user_skill import UserSkill
from app.models.ai_usage import AIUsage
from app.models.user_ai_usage import UserAIUsage
__all__ = [
    "Base",
    "User",
    "Goal",
    "Task",
    "Project",
    "InternshipApplication",
    "Resource",
    "ResumeAnalysis",
    "ActivityLog",
    "CareerTarget",
    "Skill",
    "SkillGap",
    "JobMatch",
    "CareerTargetSkill",
    "CareerRecommendation",
    "UserSkill",
    "AIUsage",
    "UserAIUsage",
]