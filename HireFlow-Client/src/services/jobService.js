import api from './api'

const jobService = {
  async getJobs(filters = {}) {
    const params = {}

    if (filters.keyword?.trim()) {
      params.Keyword = filters.keyword.trim()
    }

    if (filters.location?.trim()) {
      params.Location = filters.location.trim()
    }

    if (filters.employmentType) {
      params.EmploymentType = filters.employmentType
    }

    if (
      filters.minSalary !== '' &&
      filters.minSalary !== null &&
      filters.minSalary !== undefined
    ) {
      params.MinSalary = Number(filters.minSalary)
    }

    if (
      filters.maxSalary !== '' &&
      filters.maxSalary !== null &&
      filters.maxSalary !== undefined
    ) {
      params.MaxSalary = Number(filters.maxSalary)
    }

    const response = await api.get('/jobs', {
      params,
    })

    return response.data
  },

  async getJobById(jobId) {
    const response = await api.get(`/jobs/${jobId}`)
    return response.data
  },

  async getMyJobs() {
    const response = await api.get('/jobs/my')
    return response.data
  },

  async createJob(jobData) {
    const response = await api.post('/jobs', jobData)
    return response.data
  },

  async updateJob(jobId, jobData) {
    const response = await api.put(
      `/jobs/${jobId}`,
      jobData,
    )

    return response.data
  },

  async patchJob(jobId, jobData) {
    const response = await api.patch(
      `/jobs/${jobId}`,
      jobData,
    )

    return response.data
  },

  async deleteJob(jobId) {
    const response = await api.delete(
      `/jobs/${jobId}`,
    )

    return response.data
  },
}

export default jobService