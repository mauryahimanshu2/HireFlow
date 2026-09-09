import api from './api'

const adminService = {
  async getUsers() {
    const response = await api.get('/admin/users')
    return response.data
  },
  async blockUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/block`)
    return response.data
  },
  async unblockUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/unblock`)
    return response.data
  },
  async getJobs() {
    const response = await api.get('/admin/jobs')
    return response.data
  },
  async activateJob(jobId) {
    const response = await api.patch(`/admin/jobs/${jobId}/activate`)
    return response.data
  },
  async deactivateJob(jobId) {
    const response = await api.patch(`/admin/jobs/${jobId}/deactivate`)
    return response.data
  },
  async getStats() {
    const response = await api.get('/admin/stats')
    return response.data
  },
}

export default adminService
