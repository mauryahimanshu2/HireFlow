import api from './api'

const applicationService = {
  async applyForJob(jobId) {
    const response = await api.post('/applications', {
      jobId: Number(jobId),
    })

    return response.data
  },

  async getMyApplications() {
    const response = await api.get('/applications/my')
    return response.data
  },

  async getMyApplication(applicationId) {
    const response = await api.get(
      `/applications/my/${applicationId}`,
    )

    return response.data
  },

  async withdrawApplication(applicationId) {
    const response = await api.patch(
      `/applications/${applicationId}/withdraw`,
    )

    return response.data
  },

  async getApplicants(jobId) {
    const response = await api.get(
      `/applications/job/${jobId}/applicants`,
    )

    return response.data
  },

  async getAllRecruiterApplicants() {
    const response = await api.get(
      '/applications/recruiter/all',
    )

    return response.data
  },

  async updateApplicationStatus(applicationId, status, recruiterRemarks) {
    const cleanRemarks = recruiterRemarks?.trim() || null

    const response = await api.patch(
      `/applications/${applicationId}/status`,
      {
        status,
        recruiterRemarks: cleanRemarks,
      },
      {
        params: {
          status,
          recruiterRemarks: cleanRemarks,
        },
      },
    )

    return response.data
  },
}

export default applicationService