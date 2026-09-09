export const ROLES = {
  JOB_SEEKER: 'JobSeeker',
  RECRUITER: 'Recruiter',
  ADMIN: 'Admin',
}

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'UnderReview',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7221/api'